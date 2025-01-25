import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { LoginDto, SignupDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookMarkDto, EditBookMarkDto } from '../src/bookmark/dto';

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
    // Set the base URL for all requests.
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

  /**
   * Test the Bookmark module.
   * This module contains the bookmark endpoints.
   * The create bookmark endpoint should return a 201 status code when a bookmark is created.
   * The get all bookmarks endpoint should return a 200 status code when all bookmarks are fetched.
   * The get bookmark by id endpoint should return a 200 status code when a bookmark is fetched by id.
   * The edit bookmark by id endpoint should return a 200 status code when a bookmark is edited by id.
   * The delete bookmark by id endpoint should return a 200 status code when a bookmark is deleted by id.
   */

  describe('Bookmarks', () => {
    describe('Get Empty Bookmarks', () => {
      it('Should return empty array', () => {
        return pactum
          .spec()
          .get(`/bookmarks`)
          .withBearerToken(`$S{userAt}`)
          .expectStatus(200)
          .expectBody([]);
      }, 10000);
    });

    describe('Create Bookmark', () => {
      it('Should create a bookmark', () => {
        const dto: CreateBookMarkDto = {
          title: 'test',
          link: 'http://test.com',
        };
        return pactum
          .spec()
          .post(`/bookmarks`)
          .withBearerToken(`$S{userAt}`)
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
          .stores('bookmarkId', 'id');
      }, 10000);
    });

    describe('Get All Bookmarks', () => {
      it('Should get all Bookmarks', () => {
        return pactum
          .spec()
          .get(`/bookmarks`)
          .withBearerToken(`$S{userAt}`)
          .expectStatus(200)
          .expectJsonLength(1);
      }, 10000);
    });

    describe('Get a Bookmark by ID', () => {
      it('Should get one Bookmark by ID', () => {
        return pactum
          .spec()
          .get(`/bookmarks/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      }, 10000);
    });

    describe('Edit Bookmark by Id', () => {
      it('Should edit and return one Bookmark by ID', () => {
        const dto: EditBookMarkDto = {
          title: 'test edit',
          description: 'test description',
          link: 'http://test.com/edit',
        };
        return pactum
          .spec()
          .patch(`/bookmarks/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken(`$S{userAt}`)
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link);
      }, 10000);
    });

    describe('Delete Bookmark by ID', () => {
      it('Should delete one Bookmark by ID', () => {
        return pactum
          .spec()
          .delete(`/bookmarks/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(204);
      }, 10000);
    });

    describe('Verify Bookmark is Deleted', () => {
      it('Should return empty array', () => {
        return pactum
          .spec()
          .get(`/bookmarks`)
          .withBearerToken(`$S{userAt}`)
          .expectStatus(200)
          .expectBody([]);
      }, 10000);
    });
  });
});
