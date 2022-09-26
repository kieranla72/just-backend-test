import { NextFunction, Request, Response, Router } from 'express';
import { ITrip, ITripInput, ITripInsert } from '../services/ports';
import { initializeTripService, TripService } from '../services/trips.service';
import bodyParser from 'body-parser';
import { initializeTripsAdapter } from '../adapters/trips.adapter';
import { initializePolicyAdapter } from '../adapters/policy.adapter';
import { initializeNotificationsAdapter } from '../adapters/notifications.adapter';
import {
  body,
  param,
  Result,
  ValidationError,
  validationResult,
} from 'express-validator';

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

    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors });
      return;
    }

    const trips: ITrip[] = await tripService.getAllUserTrips(
      Number(userId),
      initializeTripsAdapter(),
    );

    res.status(200).send(trips);
    return;
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
    const tripInput: ITripInput = req.body;

    const tripService: TripService = initializeTripService();

    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors });
      return;
    }

    const tripReturn: ITripInsert = await tripService.createUserTrip(
      tripInput,
      initializeTripsAdapter(),
      initializePolicyAdapter(),
      initializeNotificationsAdapter(),
    );

    res.status(200).send(tripReturn);
    return;
  } catch (err) {
    next(err);
  }
};

tripsRouter.get(
  '/users/:userId/trips',
  param('userId').isNumeric().toInt(),
  getAllUserTrips,
);
tripsRouter.post(
  '/trips',
  body('tripStart').isISO8601(),
  body('tripEnd').isISO8601(),
  body('userId').isNumeric().toInt(),
  body('distance').isNumeric().toFloat(),
  createUserTrip,
);

export default tripsRouter;
