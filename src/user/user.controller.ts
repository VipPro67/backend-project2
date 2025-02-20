import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('User')
@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  getAllUser(@Query() filterquery: FilterUserDto) {
    return this.userService.getAllUser(filterquery);
  }
  @UseGuards(AuthGuard)
  @Get('my-profile')
  getMyProfile(@Req() req: any) {
    return this.userService.getUserById(req.user_data.id);
  }
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post('upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = [
          '.jpg',
          '.png',
          '.jpeg',
          '.gif',
          '.bmp',
          '.svg',
          '.webp',
          '.tiff',
          '.psd',
          '.raw',
          '.heif',
          '.indd',
          '.jpeg 2000',
          '.pdf',
        ];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.userService.updateAvatar(req.user_data.id, file);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() req: any, @Body() createUserDto: CreateUserDto) {
    if (req.user_data.userType != 'admin') {
      return new HttpException(
        'You are not allowed to access this resource',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Put('delete-history-tags/')
  deleteHistoryTags(@Req() req: any) {
    return this.userService.deleteHistoryTags(req.user_data.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
