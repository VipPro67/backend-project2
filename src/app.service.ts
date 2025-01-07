import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message/entities/message.entity';
import { CreateMessageDto } from './message/dto/create-message.dto';
import { User } from './user/entities/user.entity';
import { Group } from './group/entities/group.entity';
import { Media } from './media/entities/media.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
  ) {}
  async saveMessage(
    user_id: string,
    receiver_id: string,
    group_id: string,
    content: string,
  ): Promise<Message> {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
    });
    if (!user) {
      throw new Error('Sender not found');
    }
    const messageData = new Message();
    messageData.content = content;
    messageData.sender = user;

    if (receiver_id != undefined)
      messageData.receiver = await this.userRepository.findOne({
        where: { id: receiver_id },
      });
    if (group_id != undefined)
      messageData.group = await this.groupRepository.findOne({
        where: { id: group_id },
      });
    const savedMessage = await this.messageRepository.save(messageData);
    if (messageData.group) {
      // Message is for a group
      const group = await this.groupRepository.findOne({
        where: { id: messageData.group.id },
      });
      if (!group) {
        throw new Error('Group not found');
      }
      // Set the group in the message
      savedMessage.group = group;
      await this.messageRepository.save(savedMessage);
    }

    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['sender', 'receiver', 'group', 'media'],
      select: {
        id: true,
        content: true,

        sender: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
        receiver: {
          id: true,
          first_name: true,
          last_name: true,
          avatar: true,
        },
        group: {
          id: true,
          name: true,
          avatar: true,
        },
        created_at: true,
      },
    });
  }
}
