import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { DataSource } from 'typeorm';
import { Trip } from '../models';
import { ITrip, ITripInsert } from '../services/ports';
import { createConnection } from '../utils/createConnection';
import { IPolicyServiceResponse, IPushNotificationData } from './types';

export class TripsAdapter {
  async getAllUserTrips(userId: string): Promise<ITrip[]> {
    const userTripsConnection: DataSource = await createConnection();

    const trips: Trip[] = await userTripsConnection
      .getRepository(Trip)
      .createQueryBuilder()
      .where('trip.userId = :userId', { userId })
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

  async getTripPricePerMile(): Promise<number> {
    const options: AxiosRequestConfig = {
      headers: {
        user: JSON.stringify({ email: 'kierancareer@hotmail.com' }),
      },
    };

    const policyServiceResponse: AxiosResponse<IPolicyServiceResponse> =
      await axios.post<IPolicyServiceResponse>(
        process.env.POLICY_URL,
        undefined,
        options,
      );

    const pricePerMile: number = policyServiceResponse.data.pricePerMile;

    return pricePerMile;
  }

  async pushUserNotification({ cost, distance }: ITripInsert): Promise<void> {
    const title = `Thanks for driving with Just 🚘`;
    const body = `You have driven for ${distance} miles and it cost you $${cost}`;

    const data: IPushNotificationData = {
      title,
      body,
    };

    const options: AxiosRequestConfig = {
      headers: {
        user: JSON.stringify({ email: 'kierancareer@hotmail.com' }),
      },
    };

    await axios.post(process.env.PUSH_URL, data, options);
  }
}
