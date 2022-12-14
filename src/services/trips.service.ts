import { PolicyAdapter } from '../adapters/policy.adapter';
import { NotificationsAdapter } from '../adapters/notifications.adapter';
import { TripsAdapter } from '../adapters/trips.adapter';
import { ITrip, ITripInput, ITripInsert } from './ports';

export class TripService {
  async getAllUserTrips(
    userId: number,
    tripsAdapter: TripsAdapter,
  ): Promise<ITrip[]> {
    const userTrips: ITrip[] = await tripsAdapter.getAllUserTrips(userId);

    return userTrips;
  }

  async createUserTrip(
    tripInput: ITripInput,
    tripsAdapter: TripsAdapter,
    policyAdapter: PolicyAdapter,
    notificationsAdapter: NotificationsAdapter,
  ): Promise<ITrip> {
    // The last user trip is only returned if it is the same as the incoming one
    const lastTrip: ITrip = await this.checkIfRepeatedTrip(
      tripInput,
      tripsAdapter,
    );

    if (lastTrip) {
      return lastTrip;
    }

    const pricePerMile: number = await policyAdapter.getTripPricePerMile();

    const tripInsert: ITripInsert = this.buildTripInserts(
      tripInput,
      pricePerMile,
    );

    await tripsAdapter.insertUserTrip([tripInsert]);

    await notificationsAdapter.pushUserNotification(tripInsert);

    const newTrip: ITrip = this.buildNewTrip(tripInsert);

    return newTrip;
  }

  buildNewTrip({
    tripStart,
    tripEnd,
    distance,
    duration,
    cost,
  }: ITripInsert): ITrip {
    return {
      tripStart,
      tripEnd,
      distance,
      duration,
      cost,
    };
  }

  async checkIfRepeatedTrip(
    { tripEnd, userId }: ITripInput,
    tripsAdapter: TripsAdapter,
  ): Promise<ITrip> {
    const userTrips: ITrip[] = await tripsAdapter.getAllUserTrips(userId);

    const lastTrip: ITrip = userTrips[0];

    if (!lastTrip) {
      return;
    }

    const isRepeatedTrip: boolean = lastTrip.tripEnd === tripEnd;

    if (isRepeatedTrip) {
      return lastTrip;
    }
  }

  // Construct the inserts required to insert trips into the DB
  buildTripInserts(tripInput: ITripInput, pricePerMile: number): ITripInsert {
    const { tripStart, tripEnd, distance }: ITripInput = tripInput;

    const durationInMs =
      new Date(tripEnd).getTime() - new Date(tripStart).getTime();

    const durationInSecs = durationInMs / 1000;

    const durationISOFormat = `PT${durationInSecs}`;

    const kilometerConversionToMiles = 0.621371;

    const distanceInMiles: number = distance * kilometerConversionToMiles;

    const cost: number = pricePerMile * distanceInMiles;

    const tripInsert: ITripInsert = {
      ...tripInput,
      duration: durationISOFormat,
      distance,
      cost: Math.round(cost * 10) / 10,
    };

    return tripInsert;
  }
}

var tripService: TripService;

export const initializeTripService = () => {
  if (!tripService) {
    tripService = new TripService();
  }

  return tripService;
};
