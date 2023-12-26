import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Like, Not, Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import * as AWS from 'aws-sdk';
import { FilterPetDto } from './dto/filter-pet.dto';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}
  keyID: string = process.env.AWS_ACCESS_KEY_ID;
  keySecret: string = process.env.AWS_SECRET_ACCESS_KEY;
  region: string = process.env.AWS_REGION;
  bucketName: string = process.env.AWS_S3_BUCKET_NAME;

  s3 = new AWS.S3({
    accessKeyId: this.keyID,
    secretAccessKey: this.keySecret,
  });
  async findAll(filterquery: FilterPetDto) {
    const page = filterquery.page || 1;
    const items_per_page = filterquery.items_per_page || 10;
    const search = filterquery.search || '';
    const skip = items_per_page * (page - 1);
    const [res, total] = await this.petRepository.findAndCount({
      order: { id: 'DESC' },
      relations: ['owner'],
      where: [
        {
          name: Like(`%${search}%`),
        },
        {
          species: Like(`%${search}%`),
        },
        {
          breed: Like(`%${search}%`),
        },
        {
          description: Like(`%${search}%`),
        },
      ],
      take: items_per_page,
      skip: skip,
      select: {
        owner: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    });
    const totalPage = Math.ceil(total / items_per_page);
    const nextPage = Number(page) + 1 <= totalPage ? Number(page) + 1 : null;
    const prePage = Number(page) - 1 > 0 ? Number(page) - 1 : null;

    return {
      data: res,
      total,
      currentPage: page,
      items_per_page,
      totalPage,
      nextPage,
      prePage,
    };
  }

  async findOne(id: string) {
    return await this.petRepository.findOne({ where: { id } });
  }

  async findMyPets(userId: string) {
    return await this.petRepository.find({
      relations: ['owner'],
      where: {
        owner: {
          id: userId,
        },
      },
    });
  }

  async findPetsByUserId(id: string) {
    return await this.petRepository.find({
      relations: ['owner'],
      where: {
        owner: {
          id,
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    const pet = await this.petRepository.findOne({
      where: {
        id,
        owner: {
          id: userId,
        },
      },
    });
    if (!pet) {
      return 'Pet not found or you are not owner of this pet';
    }

    return await this.petRepository.delete({ id });
  }

  async create(
    userId: string,
    createPetDto: CreatePetDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const pet = new Pet();
    pet.owner = user;
    pet.name = createPetDto.name;
    pet.species = createPetDto.species;
    pet.date_of_birth = new Date(createPetDto.date_of_birth);
    pet.breed = createPetDto.breed;
    pet.sex = createPetDto.sex;
    pet.description = createPetDto.description;
    if (file) {
      const params = {
        Bucket: this.bucketName,
        Key: `pet-avatar/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };

      try {
        const result = await this.s3.upload(params).promise();
        pet.avatar = result.Location;
      } catch (error) {
        throw new BadRequestException('Failed to upload avatar' + error);
      }
    }

    await this.petRepository.save(pet);
    return this.petRepository.findOne({
      where: { id: pet.id },
      relations: ['owner'],
      select: {
        owner: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    });
  }

  async update(
    userId: string,
    petId: string,
    createPetDto: CreatePetDto,
    file: Express.Multer.File,
  ) {
    const pet = await this.petRepository.findOne({
      where: {
        id: petId,
        owner: {
          id: userId,
        },
      },
    });
    //save pet
    if (!pet) {
      return 'Pet not found';
    }
    pet.name = createPetDto.name;
    pet.species = createPetDto.species;
    pet.date_of_birth = new Date(createPetDto.date_of_birth);
    pet.breed = createPetDto.breed;
    pet.sex = createPetDto.sex;
    pet.description = createPetDto.description;
    if (file) {
      const params = {
        Bucket: this.bucketName,
        Key: `pet-avatar/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };

      try {
        const result = await this.s3.upload(params).promise();
        pet.avatar = result.Location;
      } catch (error) {
        throw new BadRequestException('Failed to upload avatar' + error);
      }
    }
    await this.petRepository.save(pet);
    return this.petRepository.findOne({ where: { id: petId } });
  }

  async pairing(userId: string, petId: string) {
    const pet = await this.petRepository.findOne({
      where: {
        id: petId,
        owner: {
          id: userId,
        },
      },
    });
    if (!pet) {
      return 'Pet not found';
    }
    // find some pet have same information with this pet
    return await this.petRepository.find({
      relations: ['owner'],
      where: [
        {
          breed: pet.breed,
          owner: {
            id: Not(userId),
          },
        },
        {
          species: pet.species,
          owner: {
            id: Not(userId),
          },
        },
      ],
      select: {
        owner: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    });
  }
}
