import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindDto, MinioService, Serialize } from '@app/common';
import { UserDto } from './dtos/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './models/user.entity';
import { FilterUserDto } from './dtos/filter-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { USERS_AVATAR } from '@app/common/constants';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly minioService: MinioService,
  ) {}

  @Post()
  @Serialize(UserDto)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllPagination(@Query() filterUserDto: FilterUserDto) {
    const where = plainToClass(User, {});
    const nameTable = 'user';
    const searchColumns: (keyof User)[] = ['name', 'address', 'contact'];
    const results = await this.usersService.findByKeywordsWithPagination(
      filterUserDto.page ?? 1,
      filterUserDto.limit ?? 10,
      nameTable,
      filterUserDto.keywords,
      searchColumns,
      where,
      [],
      filterUserDto.order,
      [
        'name',
        'address',
        'contact',
        'created_at',
        'updated_at',
        'avatar',
        'status',
      ],
    );
    return plainToClass(UserDto, results);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async findAllNoPagination() {
    return this.usersService.find({});
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.usersService.findOne(findDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new BadRequestException('Id required');
    }
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.usersService.update(findDto, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.usersService.remove(findDto);
  }

  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async updateAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!id) {
      throw new BadRequestException('Id required');
    }
    // check user valid or not
    const key = `${Date.now().toString()}-${file.originalname}`;
    const results = await this.minioService.uploadFile({
      bucket: USERS_AVATAR,
      file: file.buffer,
      key,
    });
    if (results.etag) {
      // save
      const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
      let updateUserDto: UpdateUserDto = new UpdateUserDto();
      updateUserDto.avatar = key;
      return this.usersService.update(findDto, updateUserDto);
    } else {
      throw new InternalServerErrorException('Failed to upload!.');
    }
  }
}
