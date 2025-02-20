import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Delete,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  Query,
} from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { FilterPetDto } from './dto/filter-pet.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Pet')
@Controller('api/v1/pets')
export class PetController {
  constructor(private petService: PetService) {}

  @Get()
  findAll(@Query() filterquery: FilterPetDto) {
    return this.petService.findAll(filterquery);
  }
  @Get('my-pets')
  @UseGuards(AuthGuard)
  findMyPets(@Req() req: any) {
    return this.petService.findMyPets(req.user_data.id);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  findPetsByUserId(@Param('id') id: string) {
    return this.petService.findPetsByUserId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petService.findOne(id);
  }

  @Get('pairing/:id')
  @UseGuards(AuthGuard)
  pairing(@Req() req: any, @Param('id') id: string) {
    return this.petService.pairing(req.user_data.id, id);
  }

  @Post()
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
  create(
    @Req() req: any,
    @Body() createPetDto: CreatePetDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.petService.create(req.user_data.id, createPetDto, file);
  }

  @Put(':id')
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
  update(
    @Req() req: any,
    @Body() updatePetDto: UpdatePetDto,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.petService.update(req.user_data.id, id, updatePetDto, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Req() req: any, @Param('id') id: string) {
    return this.petService.remove(req.user_data.id, id);
  }
}
