import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
        { folder: 'users' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
  async getAllUser(filterquery: FilterUserDto) {
    const page = filterquery.page || 1;
    const items_per_page = filterquery.items_per_page || 10;
    const search = filterquery.search || '';
    const skip = items_per_page * (page - 1);
    const [res, total] = await this.userRepository.findAndCount({
      where: [
        { first_name: Like(`%${search}%`) },
        { last_name: Like(`%${search}%`) },
        { email: Like(`%${search}%`) },
      ],
      take: items_per_page,
      skip: skip,
      select: [
        'id',
        'email',
        'first_name',
        'last_name',
        'avatar',
        'status',
        'created_at',
        'updated_at',
      ],
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
  async getUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        avatar: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return this.userRepository.findOne({
      where: { id: newUser.id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        avatar: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    return await this.userRepository.update(id, updateUserDto);
  }
  deleteHistoryTags(userId: string) {
    const user = this.userRepository.findOne({
      where: { id: userId },
      relations: ['historyTags'],
    });
    user.then((res) => {
      res.historyTags = [];
      this.userRepository.save(res);
    });
    return new HttpException('Delete history tags successfully', HttpStatus.OK);
  }
  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async updateAvatar(
    id: string,
    file: Express.Multer.File,
  ): Promise<UpdateResult> {
    try {
      const result = await this.uploadToCloudinary(file);

      return await this.userRepository.update(id, {
        avatar: result.secure_url,
      });
    } catch (error) {
      throw new BadRequestException('Failed to upload avatar' + error);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
