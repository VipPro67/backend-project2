import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Media } from 'src/media/entities/media.entity';
import { User } from 'src/user/entities/user.entity';

export class CreateCommnetDto {
    @ApiProperty()
    @IsNotEmpty()
    post_id: string;

    @ApiProperty()
    @IsNotEmpty()
    comment: string;

    @ApiProperty()
    replied_comment_id:string;

}
