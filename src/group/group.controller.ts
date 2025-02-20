import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Group } from './entities/group.entity';
import { CreateGrouptDto } from './dto/create-group.dto';
import { UpdateGrouptDto } from './dto/update-group.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { FilterGroupDto } from './dto/filter-group.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Group')
@Controller('api/v1/groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get()
  findAll(@Query() filterquery: FilterGroupDto) {
    return this.groupService.findAll(filterquery);
  }
  @UseGuards(AuthGuard)
  @Get('my-groups')
  getMyGroup(@Req() req: any): Promise<Group[]> {
    return this.groupService.findAllByUser(req.user_data.id);
  }
  @Get(':id')
  finfOne(@Param('id') id: string): Promise<Group> {
    return this.groupService.findOne(id);
  }

  @Get('user/:user_id')
  findAllByUser(@Param('user_id') user_id: string): Promise<Group[]> {
    return this.groupService.findAllByUser(user_id);
  }

  @UseGuards(AuthGuard)
  @Post()
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
  create(
    @Req() req: any,
    @Body() createGroupDto: CreateGrouptDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.groupService.create(req.user_data.id, createGroupDto, file);
  }

  @UseGuards(AuthGuard)
  @Post(':id/join')
  join(@Req() req: any, @Param('id') id: string) {
    return this.groupService.join(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/leave')
  leave(@Req() req: any, @Param('id') id: string) {
    return this.groupService.leave(req.user_data.id, id);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
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
  @Put(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateGroupDto: UpdateGrouptDto,
  ) {
    return this.groupService.update(req.user_data.id, id, updateGroupDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.groupService.remove(req.user_data.id, id);
  }
}
