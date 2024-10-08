import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../users/models/user.entity';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dtos/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from '../interceptors';
import { CurrentUser } from '../decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Serialize(UserDto)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    return user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    this.authService.logout(response);
    return { message: 'success', statusCode: 200 };
  }
}
