import { DataSource } from 'typeorm';
import { Trip } from '../models';

// eslint-disable-next-line no-var
var userTripsConnection: DataSource;

export const createConnection = async (): Promise<DataSource> => {
  if (!userTripsConnection) {
    userTripsConnection = new DataSource({
      type: 'sqlite',
      database: process.env.DB_LOCATION,
      entities: [Trip],
    });

    await userTripsConnection
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!');
      })
      .catch((err) => {
        console.error('Error during Data Source initialization', err);
      });
  }

  return userTripsConnection;
};
