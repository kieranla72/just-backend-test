import { TripsAdapter } from '../adapters/trips.adapter';
import { ITrip, ITripInput, ITripInsert } from './ports';

export class TripService {
  async getAllUserTrips(
    userId: string,
    tripsAdapter: TripsAdapter,
  ): Promise<ITrip[]> {
    const userTrips: ITrip[] = await tripsAdapter.getAllUserTrips(userId);

    return userTrips;
  }

  async createUserTrip(
    tripInput: ITripInput,
    tripsAdapter: TripsAdapter,
  ): Promise<ITripInsert> {
    const pricePerMile: number = await tripsAdapter.getTripPricePerMile();

    const tripInsert: ITripInsert = this.buildTripInserts(
      tripInput,
      pricePerMile,
    );

    await tripsAdapter.insertUserTrip([tripInsert]);

    await tripsAdapter.pushUserNotification(tripInsert);

    return tripInsert;
  }

  buildTripInserts(tripInput: ITripInput, pricePerMile: number): ITripInsert {
    const { tripStart, tripEnd, distance }: ITripInput = tripInput;

    const durationInMs =
      new Date(tripEnd).getTime() - new Date(tripStart).getTime();

    const durationISOFormat = `PT${durationInMs / 1000}`;

    const cost: number = pricePerMile * distance;

    const tripInsert: ITripInsert = {
      ...tripInput,
      duration: durationISOFormat,
      cost,
    };

    return tripInsert;
  }
}
