import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuditService } from '../audit/audit.service';
import { ACTIVE_LOGIN_STATUS, ROLE_LANDING_PATHS, type SystemRole } from '../common/rbac.constants';
import type { AuthenticatedUserResponse, RequestUser } from '../common/types/auth-user.type';
import { PrismaService } from '../prisma/prisma.service';
import type { ActivateAccountDto } from './dto/activate-account.dto';
import type { ForgotPasswordDto } from './dto/forgot-password.dto';
import type { LoginDto } from './dto/login.dto';
import type { ResetPasswordDto } from './dto/reset-password.dto';

const userInclude = {
  department: true,
  userRoles: {
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
} as const;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private auditService: AuditService,
  ) {}

  private activationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async getUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email: { equals: email.toLowerCase(), mode: 'insensitive' } },
      include: userInclude,
    });
  }

  private frontendUrl() {
    return this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:5173';
  }

  private socialRedirectUri(provider: string) {
    return `${this.configService.get<string>('BACKEND_URL') ?? 'http://localhost:3000'}/api/auth/social/${provider}/callback`;
  }

  private encodeState(state: Record<string, string>) {
    return Buffer.from(JSON.stringify(state), 'utf8').toString('base64url');
  }

  private decodeState(state?: string) {
    if (!state) {
      return { returnTo: `${this.frontendUrl()}/auth/callback` };
    }

    try {
      return JSON.parse(Buffer.from(state, 'base64url').toString('utf8')) as { returnTo?: string };
    } catch {
      return { returnTo: `${this.frontendUrl()}/auth/callback` };
    }
  }

  private safeReturnTo(returnTo?: string) {
    const fallback = `${this.frontendUrl()}/auth/callback`;
    if (!returnTo) {
      return fallback;
    }

    try {
      const parsed = new URL(returnTo);
      const frontend = new URL(this.frontendUrl());
      return parsed.origin === frontend.origin ? returnTo : fallback;
    } catch {
      return fallback;
    }
  }

  private socialConfig(provider: string) {
    if (provider === 'google') {
      return {
        clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
        scope: 'openid email profile',
      };
    }

    if (provider === 'microsoft' || provider === 'outlook') {
      const prefix = provider === 'outlook' ? 'OUTLOOK' : 'MICROSOFT';
      return {
        clientId: this.configService.get<string>(`${prefix}_CLIENT_ID`) ?? this.configService.get<string>('MICROSOFT_CLIENT_ID'),
        clientSecret:
          this.configService.get<string>(`${prefix}_CLIENT_SECRET`) ?? this.configService.get<string>('MICROSOFT_CLIENT_SECRET'),
        authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        userUrl: 'https://graph.microsoft.com/oidc/userinfo',
        scope: 'openid email profile User.Read',
      };
    }

    throw new BadRequestException('Unsupported social provider');
  }

  private async issueSessionForUser(user: NonNullable<Awaited<ReturnType<AuthService['getUserByEmail']>>>) {
    const responseUser = this.formatUser(user);
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      roles: responseUser.roles,
      permissions: responseUser.permissions,
    });

    return { accessToken, user: responseUser };
  }

  formatUser(user: NonNullable<Awaited<ReturnType<AuthService['getUserByEmail']>>>): AuthenticatedUserResponse {
    const roles = user.userRoles.map((userRole) => userRole.role.name);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((userRole) =>
          userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.key),
        ),
      ),
    ];
    const primaryRole = (roles[0] ?? 'EMPLOYEE') as SystemRole;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: primaryRole,
      roles,
      permissions,
      department: user.department?.name,
      designation: user.designation ?? undefined,
      mobile: user.mobile ?? undefined,
      status: user.status,
      landingPath: ROLE_LANDING_PATHS[primaryRole] ?? '/dashboard/employee',
    };
  }

  async login(input: LoginDto) {
    const user = await this.getUserByEmail(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    if (user.status !== ACTIVE_LOGIN_STATUS) {
      throw new UnauthorizedException(`Account status is ${user.status}`);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login credentials');
    }

    const session = await this.issueSessionForUser(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
    });

    return session;
  }

  getSocialStartUrl(provider: string, returnTo?: string) {
    const config = this.socialConfig(provider);
    const callbackReturnTo = this.safeReturnTo(returnTo);

    if (!config.clientId || !config.clientSecret) {
      const callback = new URL(callbackReturnTo);
      callback.searchParams.set('error', `${provider} OAuth is not configured`);
      return callback.toString();
    }

    const url = new URL(config.authUrl);
    url.searchParams.set('client_id', config.clientId);
    url.searchParams.set('redirect_uri', this.socialRedirectUri(provider));
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', config.scope);
    url.searchParams.set('state', this.encodeState({ returnTo: callbackReturnTo }));
    url.searchParams.set('prompt', 'select_account');
    return url.toString();
  }

  async socialCallback(provider: string, code: string, state?: string) {
    const config = this.socialConfig(provider);
    const returnTo = this.safeReturnTo(this.decodeState(state).returnTo);

    if (!config.clientId || !config.clientSecret) {
      throw new BadRequestException(`${provider} OAuth is not configured`);
    }

    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.socialRedirectUri(provider),
      }),
    });

    if (!tokenResponse.ok) {
      throw new UnauthorizedException('Unable to complete provider token exchange');
    }

    const tokenData = (await tokenResponse.json()) as { access_token?: string; id_token?: string };
    const userResponse = await fetch(config.userUrl, {
      headers: { Authorization: `Bearer ${tokenData.access_token ?? tokenData.id_token}` },
    });

    if (!userResponse.ok) {
      throw new UnauthorizedException('Unable to read provider profile');
    }

    const profile = (await userResponse.json()) as { email?: string; preferred_username?: string; upn?: string };
    const email = profile.email ?? profile.preferred_username ?? profile.upn;
    if (!email) {
      throw new UnauthorizedException('Provider did not return an email address');
    }

    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('No SPMS account exists for this provider email');
    }

    if (user.status !== ACTIVE_LOGIN_STATUS) {
      throw new UnauthorizedException(`Account status is ${user.status}`);
    }

    const session = await this.issueSessionForUser(user);
    await this.auditService.log({
      userId: user.id,
      action: 'SOCIAL_LOGIN',
      entity: 'User',
      entityId: user.id,
      details: { provider },
    });

    const callback = new URL(returnTo);
    callback.searchParams.set('accessToken', session.accessToken);
    return callback.toString();
  }

  async me(currentUser: RequestUser) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
      include: userInclude,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.formatUser(user);
  }

  async logout(currentUser: RequestUser) {
    await this.auditService.log({
      userId: currentUser.id,
      action: 'LOGOUT',
      entity: 'User',
      entityId: currentUser.id,
    });

    return { success: true };
  }

  async forgotPassword(input: ForgotPasswordDto) {
    const user = await this.getUserByEmail(input.email);
    if (!user || user.status !== ACTIVE_LOGIN_STATUS) {
      throw new BadRequestException('Only active accounts can reset passwords');
    }

    const resetCode = this.activationCode();
    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetCode },
    });

    await this.auditService.log({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      entity: 'User',
      entityId: user.id,
    });

    return { resetCode };
  }

  async resetPassword(input: ResetPasswordDto) {
    const user = await this.getUserByEmail(input.email);
    if (!user || user.resetCode !== input.code) {
      throw new BadRequestException('Invalid reset code');
    }

    const saltRounds = Number(this.configService.get('BCRYPT_SALT_ROUNDS') ?? 10);
    const passwordHash = await bcrypt.hash(input.password, saltRounds);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetCode: null },
    });
    await this.auditService.log({
      userId: user.id,
      action: 'PASSWORD_RESET',
      entity: 'User',
      entityId: user.id,
    });

    return { success: true };
  }

  async activate(input: ActivateAccountDto) {
    if (!input.acceptedPolicy) {
      throw new BadRequestException('Company policy acceptance is required');
    }

    const user = await this.getUserByEmail(input.email);
    if (!user || user.activationCode !== input.code) {
      throw new BadRequestException('Invalid activation link or OTP');
    }

    const saltRounds = Number(this.configService.get('BCRYPT_SALT_ROUNDS') ?? 10);
    const passwordHash = await bcrypt.hash(input.password, saltRounds);
    const activated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        activationCode: null,
        status: 'ACTIVE',
        policyAccepted: true,
      },
      include: userInclude,
    });

    await this.auditService.log({
      userId: activated.id,
      action: 'USER_ACTIVATED',
      entity: 'User',
      entityId: activated.id,
    });

    return this.issueSessionForUser(activated);
  }
}
