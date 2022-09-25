import { DataSource } from 'typeorm';
import { Trip } from '../models';
import { ITrip, ITripInsert } from '../services/ports';
import { createConnection } from '../utils/createConnection';

export class TripsAdapter {
  async getAllUserTrips(userId: number): Promise<ITrip[]> {
    const userTripsConnection: DataSource = await createConnection();

    const trips: Trip[] = await userTripsConnection
      .getRepository(Trip)
      .createQueryBuilder()
      .where('trip.userId = :userId', { userId })
      .orderBy('trip.tripEnd', 'DESC')
      .getMany();

    const tripsWithoutUserId: ITrip[] = trips.map(
      ({ userId, id, ...rest }) => ({
        ...rest,
      }),
    );

    return tripsWithoutUserId;
  }

  async insertUserTrip(tripInserts: ITripInsert[]): Promise<ITripInsert[]> {
    const userTripsConnection: DataSource = await createConnection();

    await userTripsConnection
      .getRepository(Trip)
      .createQueryBuilder()
      .insert()
      .values(tripInserts)
      .execute();

    return tripInserts;
  }
}

var tripAdapter: TripsAdapter;

export const initializeTripsAdapter = () => {
  if (!tripAdapter) {
    tripAdapter = new TripsAdapter();
  }

  return tripAdapter;
};
