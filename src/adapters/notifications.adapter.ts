import axios, { AxiosRequestConfig } from 'axios';
import { ITripInsert } from '../services/ports';
import { IPushNotificationData } from './types';

export class NotificationsAdapter {
  async pushUserNotification({ cost, distance }: ITripInsert): Promise<void> {
    const costInDollars: number = Math.round(cost * 100) / 100;

    const title = `Thanks for driving with Just 🚘`;
    const body = `You have driven for ${distance} miles and it cost you $${costInDollars}`;

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

var notificationsAdapter: NotificationsAdapter;

export const initializeNotificationsAdapter = () => {
  if (!notificationsAdapter) {
    notificationsAdapter = new NotificationsAdapter();
  }

  return notificationsAdapter;
};
