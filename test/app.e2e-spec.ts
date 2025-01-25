import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

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

    // Get the PrismaService instance from the app container and clean the database.
    primsa = app.get<PrismaService>(PrismaService);
    await primsa.cleanDb();
  });

  /**
   * After all tests, close the app.
   * This is important to prevent the app from running indefinitely.
   */

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {});
});
