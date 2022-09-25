import { TripService } from '../services/trips.service';

// eslint-disable-next-line no-var
var tripService: TripService;

export const initializeClass = () => {
  if (!tripService) {
    tripService = new TripService();
  }

  return tripService;
};
