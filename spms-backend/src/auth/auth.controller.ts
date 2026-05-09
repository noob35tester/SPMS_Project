import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { RequestUser } from '../common/types/auth-user.type';
import { AuthService } from './auth.service';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @Public()
  @Get('social/:provider/start')
  socialStart(
    @Param('provider') provider: string,
    @Query('returnTo') returnTo: string | undefined,
    @Res() response: Response,
  ) {
    return response.redirect(this.authService.getSocialStartUrl(provider, returnTo));
  }

  @Public()
  @Get('social/:provider/callback')
  async socialCallback(
    @Param('provider') provider: string,
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Res() response: Response,
  ) {
    if (error || !code) {
      const callback = new URL(`${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/auth/callback`);
      callback.searchParams.set('error', error ?? 'Provider did not return an authorization code');
      return response.redirect(callback.toString());
    }

    try {
      return response.redirect(await this.authService.socialCallback(provider, code, state));
    } catch (caught) {
      const callback = new URL(`${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/auth/callback`);
      callback.searchParams.set('error', caught instanceof Error ? caught.message : 'OAuth sign-in failed');
      return response.redirect(callback.toString());
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: RequestUser) {
    return this.authService.me(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@CurrentUser() user: RequestUser) {
    return this.authService.logout(user);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() input: ForgotPasswordDto) {
    return this.authService.forgotPassword(input);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() input: ResetPasswordDto) {
    return this.authService.resetPassword(input);
  }

  @Public()
  @Post('activate')
  activate(@Body() input: ActivateAccountDto) {
    return this.authService.activate(input);
  }
}
