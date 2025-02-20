import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateGrouptDto } from './dto/create-group.dto';
import { UpdateGrouptDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { DeepPartial, Like, Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { v2 as cloudinary } from 'cloudinary';
import { FilterGroupDto } from './dto/filter-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  private async uploadToCloudinary(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'groups' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
  async findAll(filterquery: FilterGroupDto) {
    const page = filterquery.page || 1;
    const items_per_page = filterquery.items_per_page || 10;
    const search = filterquery.search || '';
    const skip = items_per_page * (page - 1);
    const [res, total] = await this.groupRepository.findAndCount({
      order: { id: 'DESC' },
      relations: ['users'],
      where: [
        {
          name: Like(`%${search}%`),
        },
      ],
      take: items_per_page,
      skip: skip,
      select: {
        users: {
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

  findOne(id: string) {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['users'],
      select: {
        id: true,
        name: true,
        avatar: true,
        users: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    });
  }

  findAllByUser(user_id: string) {
    return this.groupRepository.find({
      where: { users: { id: user_id } },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });
  }

  async create(
    user_id: string,
    createGroupDto: CreateGrouptDto,
    file: Express.Multer.File,
  ) {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    const group = await this.groupRepository.save({
      name: createGroupDto.name,
      users: [user],
    });
    if (file) {
      try {
        const result = await this.uploadToCloudinary(file);
        group.avatar = result.secure_url;
      } catch (error) {
        throw new BadRequestException('Failed to upload avatar' + error);
      }
      await this.userRepository.save(group.users);
      await this.groupRepository.save(group);
    }

    return this.groupRepository.find({
      where: { id: group.id },
      relations: ['users'],
      select: {
        id: true,
        name: true,
        users: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
      },
    });
  }

  async update(
    user_id: string,
    id: string,
    updateGroupDto: UpdateGrouptDto,
    file: Express.Multer.File,
  ) {
    const group = await this.groupRepository.findOne({
      where: { id, users: { id: user_id } },
      relations: ['users'],
    });

    if (!group) {
      throw new Error('Group not found or user is not part of the group');
    }
    try {
      var result = await this.uploadToCloudinary(file);
      group.avatar = result.secure_url;
    } catch (error) {
      throw new BadRequestException('Failed to upload avatar' + error);
    }
    await this.userRepository.save(group.users);
    await this.groupRepository.save(group);

    return this.groupRepository.update(
      { id, users: { id: user_id } },
      {
        name: updateGroupDto.name,
      },
    );
  }
  async join(user_id: string, id: string) {
    try {
      //only add user to group if user is not already part of the group

      const user = await this.userRepository.findOne({
        where: { id: user_id },
        relations: ['groups'],
      });
      const group = await this.groupRepository.findOne({
        where: { id },
        relations: ['users'],
      });
      if (!user || !group) {
        throw new HttpException(
          'User or group not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const isUserPartOfGroup = group.users.some((user) => user.id === user_id);
      if (isUserPartOfGroup) {
        throw new HttpException(
          'User is already part of the group',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.groupRepository
        .createQueryBuilder()
        .relation(Group, 'users')
        .of(id)
        .add(user_id);

      return this.groupRepository.findOne({
        where: { id },
        relations: ['users'],
        select: {
          id: true,
          name: true,
          users: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
          },
        },
      });
    } catch (error) {
      throw new HttpException('Can not join group', HttpStatus.BAD_REQUEST);
    }
  }

  async leave(user_id: string, id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
        relations: ['groups'],
      });
      const group = await this.groupRepository.findOne({
        where: { id },
        relations: ['users'],
      });
      if (!user || !group) {
        throw new HttpException(
          'User or group not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      const isUserPartOfGroup = group.users.some((user) => user.id === user_id);
      if (!isUserPartOfGroup) {
        throw new HttpException(
          'User is not part of the group',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.groupRepository
        .createQueryBuilder()
        .relation(Group, 'users')
        .of(id)
        .remove(user_id);

      return this.groupRepository.findOne({
        where: { id },
        relations: ['users'],
        select: {
          id: true,
          name: true,
          users: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
          },
        },
      });
    } catch (error) {
      throw new HttpException('Can not leave group', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(user_id: string, id: string) {
    try {
      const group = await this.groupRepository.findOne({
        where: { id, users: { id: user_id } },
        relations: ['users'],
      });
      if (!group) {
        throw new Error('Group not found or user is not part of the group');
      }
      return this.groupRepository.delete({ id });
    } catch (error) {
      throw new HttpException('Can not delete group', HttpStatus.BAD_REQUEST);
    }
  }
}
