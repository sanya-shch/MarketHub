import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { OAuthUser } from './interfaces/oauth-user.interface';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 7; // must match the refresh JWT lifetime below
  REFRESH_TOKEN_NAME = 'refreshToken';

  private readonly refreshSecret: string;
  private dummyHash?: Promise<string>;

  constructor(
    private jwt: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Fail fast on startup. Refresh tokens use their own secret so that a
    // refresh token can never be accepted as an access token.
    this.refreshSecret = configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    if (this.refreshSecret === configService.get('JWT_SECRET')) {
      throw new Error('JWT_REFRESH_SECRET must differ from JWT_SECRET');
    }
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email);

    if (oldUser) throw new BadRequestException('User already exists');

    const user = await this.userService.create(dto);
    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  async getNewTokens(refreshToken: string) {
    let result: { id?: string };

    try {
      result = await this.jwt.verifyAsync(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!result?.id) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userService.getById(result.id);

    if (!user) throw new UnauthorizedException('User not found');

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  issueTokens(userId: string) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
      secret: this.refreshSecret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmailWithPassword(dto.email);

    // Same work and same error for "no such user", "Google-only account" and
    // "wrong password": no user enumeration, no timing difference.
    const hashToCheck = user?.password ?? (await this.getDummyHash());
    const isValid = await verify(hashToCheck, dto.password).catch(() => false);

    if (!user || !user.password || !isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password, ...safeUser } = user;

    return safeUser;
  }

  private getDummyHash() {
    return (this.dummyHash ??= hash(randomUUID()));
  }

  async validateOAuthLogin(oauthUser: OAuthUser) {
    let user = await this.userService.getByEmail(oauthUser.email);

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: oauthUser.email,
          name: oauthUser.name,
          picture: oauthUser.picture,
        },
        include: {
          stores: true,
          favorites: true,
          orders: true,
        },
      });
    }

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get('SERVER_DOMAIN'),
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }
}
