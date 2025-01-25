import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { LoginDto, SignupDto } from '../src/auth/dto';
import { EditUserDto } from 'src/user/dto';

const BASE_URL = 'http://localhost:3300';

describe('App e2e', () => {
  let app: INestApplication;
  let primsa: PrismaService;

  /**
   * Before all tests, create a module reference and initialize the app
   * with the global validation pipe.
   */
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3300);

    // Get the PrismaService instance from the app container and clean the database.
    primsa = app.get<PrismaService>(PrismaService);
    await primsa.cleanDb();
    pactum.request.setBaseUrl(BASE_URL);
  });

  /**
   * After all tests, close the app.
   * This is important to prevent the app from running indefinitely.
   */

  afterAll(async () => {
    await app.close();
  });

  /**
   * Test the Auth module.
   * This module contains the sign-up and login endpoints.
   * The sign-up endpoint should return a 201 status code when a user is created.
   * The login endpoint should return a 200 status code when a user is logged in.
   */

  describe('Auth', () => {
    describe('Sign Up', () => {
      it('Should throw error, email is empty', () => {
        const signUpDto: SignupDto = {
          email: '',
          password: '123',
          firstName: 'test',
          lastName: 'user',
        };
        return pactum
          .spec()
          .post(`/auth/sign-up`)
          .withBody(signUpDto)
          .expectStatus(400);
      }, 10000);

      it('should signup and return a JWT token', () => {
        const signUpDto: SignupDto = {
          email: 'test@test.com',
          password: '123',
          firstName: 'test',
          lastName: 'user',
        };
        return pactum
          .spec()
          .post(`/auth/sign-up`)
          .withBody(signUpDto)
          .expectStatus(201);
      }, 10000);

      it('Should throw email already exists', () => {
        const signUpDto: SignupDto = {
          email: 'test@test.com',
          password: '123',
          firstName: 'test',
          lastName: 'user',
        };
        return pactum
          .spec()
          .post(`/auth/sign-up`)
          .withBody(signUpDto)
          .expectStatus(403);
      }, 10000);
    });

    describe('Sign In', () => {
      it('Should throw error no email', () => {
        const loginDto: LoginDto = {
          email: '',
          password: '123',
        };
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody(loginDto)
          .expectStatus(400);
      }, 10000);

      it('Should throw error no email', () => {
        const loginDto: LoginDto = {
          email: 'test@test.com',
          password: '',
        };
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody(loginDto)
          .expectStatus(400);
      }, 10000);

      it('should login and return a JWT token', () => {
        const loginDto: LoginDto = {
          email: 'test@test.com',
          password: '123',
        };
        return pactum
          .spec()
          .post(`/auth/login`)
          .withBody(loginDto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      }, 10000);
    });
  });

  /**
   * Test the User module.
   * This module contains the user endpoints.
   * The get me endpoint should return the user details.
   * The edit me endpoint should return the updated user details.
   */

  describe('User', () => {
    describe('Get Me', () => {
      it('Should return user details', () => {
        return pactum
          .spec()
          .get(`/users/me`)
          .withBearerToken(`$S{userAt}`)
          .expectStatus(200);
      }, 10000);
    });

    describe('Get Me', () => {
      it('Should Edit and Return User', () => {
        const dto: EditUserDto = {
          firstName: '123',
          lastName: '321',
          email: '123@123.com',
        };
        return pactum
          .spec()
          .patch(`/users`)
          .withBearerToken(`$S{userAt}`)
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
          .expectBodyContains(dto.email);
      }, 10000);
    });

    describe('Edit me', () => {});
  });
  describe('Bookmarks', () => {
    describe('Create Bookmark', () => {});

    describe('Get All Bookmarks', () => {});

    describe('Get a Bookmark by ID', () => {});

    describe('Edit Bookmark by Id', () => {});

    describe('Delete Bookmark by ID', () => {});
  });
});
