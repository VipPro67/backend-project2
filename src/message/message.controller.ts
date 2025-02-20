import {
  Body,
  Controller,
  Param,
  Post,
  Delete,
  Req,
  UseGuards,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiBearerAuth()
@ApiTags('Message')
@Controller('api/v1/messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  // GET Endpoints
  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Message[]> {
    return this.messageService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get('conversations/all')
  getAllUserConversation(@Req() req: any): Promise<Message[]> {
    return this.messageService.getAllUserConversation(req.user_data.id);
  }

  @Get('sender/:sender_id')
  findAllBySender(@Param('sender_id') sender_id: string): Promise<Message[]> {
    return this.messageService.findAllBySender(sender_id);
  }

  @Get('receiver/:receiver_id')
  findAllByReceiver(
    @Param('receiver_id') receiver_id: string,
  ): Promise<Message[]> {
    return this.messageService.findAllByReceiver(receiver_id);
  }

  @UseGuards(AuthGuard)
  @Get('my-messages-to/:receiver_id')
  findMyMessagesTo(@Req() req: any, @Param('receiver_id') receiver_id: string) {
    return this.messageService.findMyMessagesTo(req.user_data, receiver_id);
  }

  @UseGuards(AuthGuard)
  @Get('conversation/user/:user_id')
  getUserConversation(
    @Req() req: any,
    @Param('user_id') user_id: string,
  ): Promise<Message[]> {
    return this.messageService.getUserConversation(req.user_data.id, user_id);
  }

  @UseGuards(AuthGuard)
  @Get('conversation/group/:group_id')
  getGroupConversation(
    @Req() req: any,
    @Param('group_id') group_id: string,
  ): Promise<Message[]> {
    return this.messageService.getGroupConversation(req.user_data.id, group_id);
  }

  // POST Endpoint
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
    @Body() createMessageDto: CreateMessageDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Message> {
    return this.messageService.create(req.user_data.id, createMessageDto, file);
  }

  // DELETE Endpoint
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.messageService.remove(id);
  }
}
