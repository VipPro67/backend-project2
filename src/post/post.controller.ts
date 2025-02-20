import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './entities/post.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Post')
@Controller('api/v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('media', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedImageExtArr = ['.jpg', '.png', '.jpeg'];
        const allowedVideoExtArr = ['.mp4', '.avi', '.mkv'];
        if (
          !allowedImageExtArr.includes(ext) &&
          !allowedVideoExtArr.includes(ext)
        ) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedImageExtArr
            .concat(allowedVideoExtArr)
            .toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5 && allowedImageExtArr.includes(ext)) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else if (
            fileSize > 1024 * 1024 * 50 &&
            allowedVideoExtArr.includes(ext)
          ) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 50 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  create(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    return this.postService.create(req.user_data.id, createPostDto, file);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('media', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedImageExtArr = ['.jpg', '.png', '.jpeg'];
        const allowedVideoExtArr = ['.mp4', '.avi', '.mkv'];
        if (
          !allowedImageExtArr.includes(ext) &&
          !allowedVideoExtArr.includes(ext)
        ) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedImageExtArr
            .concat(allowedVideoExtArr)
            .toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5 && allowedImageExtArr.includes(ext)) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5 MB';
            cb(null, false);
          } else if (
            fileSize > 1024 * 1024 * 50 &&
            allowedVideoExtArr.includes(ext)
          ) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 50 MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    return this.postService.update(id, req.user_data.id, updatePostDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string): Promise<void> {
    return this.postService.remove(id, req.user_data.id);
  }

  @UseGuards(AuthGuard)
  @Get('user/group')
  getPostByUserGroup(@Req() req: any): Promise<PostEntity[]> {
    return this.postService.getPostByUserGroup(req.user_data.id);
  }

  @Get()
  getAllPost(@Query() filterquery: FilterPostDto) {
    return this.postService.findAll(filterquery);
  }

  @UseGuards(AuthGuard)
  @Get('group/:id')
  getPostByGroupId(@Param('id') id: string): Promise<PostEntity[]> {
    return this.postService.getPostByGroupId(id);
  }

  @Get('user/:id')
  getPostByUserId(@Param('id') id: string): Promise<PostEntity[]> {
    return this.postService.getPostByUserId(id);
  }

  @UseGuards(AuthGuard)
  @Get('recommended')
  getRecommendedPosts(@Req() req: any) {
    return this.postService.getRecommendedPosts(req.user_data.id);
  }
  @Get(':id')
  getPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.findOne(id);
  }
  @UseGuards(AuthGuard)
  @Post(':id/like')
  async togglePostLike(@Req() req: any, @Param('id') id: string): Promise<any> {
    await this.postService.togglePostLike(id, req.user_data.id);
  }
}
