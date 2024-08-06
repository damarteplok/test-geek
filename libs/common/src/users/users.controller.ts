import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './models/user.entity';
import { FilterUserDto } from './dtos/filter-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { MinioService } from '../minio';
import { Serialize } from '../interceptors';
import { JwtAuthGuard } from '../guards';
import { FindDto } from '../dto';
import { USERS_AVATAR } from '../constants';
import { Roles } from '../decorator';
import { PermissionsGuard } from '../auth/guards/permission.guard';

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
    const nameTable = 'users';
    const searchColumns: (keyof User)[] = ['name', 'address', 'contact'];
    const results = await this.usersService.findByKeywordsWithPagination(
      filterUserDto.page ?? 1,
      filterUserDto.limit ?? 10,
      nameTable,
      filterUserDto.keywords,
      searchColumns,
      where,
      ['role'],
      filterUserDto.order,
      [
        'id',
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
    const where = plainToClass(User, {});
    return this.usersService.findWithRelations(where, ['role']);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async findOne(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.usersService.findOne(findDto, ['role']);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!id) {
      throw new BadRequestException('Id required');
    }
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    const userEntity = plainToClass(User, updateUserDto);
    return this.usersService.update(findDto, userEntity);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Serialize(UserDto)
  async remove(@Param('id') id: string) {
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    return this.usersService.remove(findDto);
  }

  @Patch('avatar/:id')
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

  @Get('avatar/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Roles('admin', 'user')
  async getAvatar(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!id) {
      throw new BadRequestException('Id required');
    }
    const findDto = plainToClass(FindDto, { id: parseInt(id, 10) });
    const user = await this.usersService.findOne(findDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const fileStream = await this.minioService.getFile(
      USERS_AVATAR,
      user.avatar,
    );
    if (!fileStream) {
      throw new NotFoundException(`File for User with ID ${id} not found`);
    }
    res.set({
      'Content-Type': 'image/*',
      'Content-Disposition': `attachment; filename="${user.avatar}"`,
    });

    return new StreamableFile(fileStream);
  }
}
