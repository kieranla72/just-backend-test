import { DataSource } from 'typeorm';
import { Trip, User } from '../models';

// eslint-disable-next-line no-var
var userTripsConnection: DataSource;

export const createConnection = async (): Promise<DataSource> => {
  if (!userTripsConnection) {
    userTripsConnection = new DataSource({
      type: 'better-sqlite3',
      database: '../../../../databases/UserTrips.db',
      entities: [User, Trip],
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
