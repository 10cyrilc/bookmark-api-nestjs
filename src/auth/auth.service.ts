import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const passwordMatch = argon.verify(user.hash, dto.password);

    if (!passwordMatch) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signup(dto: SignupDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
        throw error;
      }
    }
  }

  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    // TODO: Implement refresh token.

    return { access_token };
  }
}
