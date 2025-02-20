import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Media } from 'src/media/entities/media.entity';
import { Group } from 'src/group/entities/group.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @ManyToOne(() => Group, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToOne(() => Media, (media) => media.message, {
    cascade: true,
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
  })
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @CreateDateColumn()
  created_at: Date;
}
