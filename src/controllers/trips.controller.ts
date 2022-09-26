import { NextFunction, Request, Response, Router } from 'express';
import { ITrip, ITripInput, ITripInsert } from '../services/ports';
import { initializeTripService, TripService } from '../services/trips.service';
import bodyParser from 'body-parser';
import { initializeTripsAdapter } from '../adapters/trips.adapter';
import { initializePolicyAdapter } from '../adapters/policy.adapter';
import { initializeNotificationsAdapter } from '../adapters/notifications.adapter';

const tripsRouter: Router = Router();

tripsRouter.use(bodyParser.text({ type: '*/*' }));

const getAllUserTrips = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId: string = req.params.userId;

    const tripService: TripService = initializeTripService();

    const trips: ITrip[] = await tripService.getAllUserTrips(
      Number(userId),
      initializeTripsAdapter(),
    );

    res.status(200).send(trips);
  } catch (err) {
    next(err);
  }
};

const createUserTrip = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tripInput: ITripInput = JSON.parse(req.body);

    const tripService: TripService = initializeTripService();

    const tripReturn: ITripInsert = await tripService.createUserTrip(
      tripInput,
      initializeTripsAdapter(),
      initializePolicyAdapter(),
      initializeNotificationsAdapter(),
    );

    res.status(200).send(tripReturn);
  } catch (err) {
    next(err);
  }
};

tripsRouter.get('/users/:userId/trips', getAllUserTrips);
tripsRouter.get('/trips', createUserTrip);

export default tripsRouter;
