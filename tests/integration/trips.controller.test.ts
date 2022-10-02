import express, { Express } from 'express';
import request from 'supertest';
import { tripsRouter } from '../../src/controllers';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(tripsRouter);

describe('Integration tests for the trips routes', () => {
  describe('Integration tests for route /users/:userId/trips', () => {
    it('get - success - Gets all of a user trips', async () => {
      const { body, statusCode } = await request(app).get('/users/100/trips');

      console.log('env variables============================\n');
      console.log(process.env.POLICY_URL);
      console.log(process.env.PUSH_URL);
      console.log(process.env.DB_LOCATION);
      console.log(process.env.MY_VARIABLE);

      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            tripStart: expect.any(String),
            tripEnd: expect.any(String),
            duration: expect.any(String),
            cost: expect.any(Number),
            distance: expect.any(Number),
          }),
        ]),
      );
      expect(statusCode).toEqual(200);
    });
    it('get - failure - invalid format id passed in so errors returned', async () => {
      const { body, statusCode } = await request(app).get(
        '/users/100ads/trips',
      );

      expect(body).toEqual({
        errors: [
          {
            value: '100ads',
            msg: 'User id is required to be a numeric integer.',
            param: 'userId',
            location: 'params',
          },
        ],
      });
      expect(statusCode).toEqual(400);
    });
  });
  describe('Integration tests for route /trips', () => {
    jest.setTimeout(10000);
    it('post - success - Saves a new user trip', async () => {
      const tripEnd: string = new Date().toISOString();

      const { body, statusCode } = await request(app).post('/trips').send({
        userId: 100,
        tripStart: '2022-10-11T11:37:00.000Z',
        tripEnd,
        distance: 85.7,
      });

      expect(body).toEqual({
        cost: expect.any(Number),
        tripStart: '2022-10-11T11:37:00.000Z',
        tripEnd,
        distance: 85.7,
        duration: expect.any(String),
      });
      expect(statusCode).toEqual(200);
    });
    it('post - success - Saves repeated save trip request so last saved trip returned', async () => {
      const { body, statusCode } = await request(app).post('/trips').send({
        userId: 100,
        tripStart: '2022-10-11T11:37:00.000Z',
        tripEnd: '2022-10-11T12:57:00.000Z',
        distance: 85.7,
      });

      expect(body).toEqual({
        cost: expect.any(Number),
        tripStart: '2022-10-11T11:37:00.000Z',
        tripEnd: '2022-10-11T12:57:00.000Z',
        distance: 85.7,
        duration: 'PT4800',
      });
      expect(statusCode).toEqual(200);
    });
    it('post - failure - Input does not pass validation', async () => {
      const { body, statusCode } = await request(app).post('/trips').send({
        userId: '100a',
        tripStart: '2022-10-11T11:37:00.000ZIncorrectFormat',
        tripEnd: '2022-10-11T12:57:00.000Z',
        distance: '85.7sdaf',
      });

      expect(body).toEqual({
        errors: [
          {
            value: '2022-10-11T11:37:00.000ZIncorrectFormat',
            msg: 'Trip start timestamp is required to follow ISO formatting.',
            param: 'tripStart',
            location: 'body',
          },
          {
            value: '100a',
            msg: 'User id is required to be a numeric integer.',
            param: 'userId',
            location: 'body',
          },
          {
            value: '85.7sdaf',
            msg: 'Distance is required to be numeric.',
            param: 'distance',
            location: 'body',
          },
        ],
      });
      expect(statusCode).toEqual(400);
    });
  });
});
