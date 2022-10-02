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
      res.status(400).json(errors);
      return;
    }

    const trips: ITrip[] = await tripService.getAllUserTrips(
      Number(userId),
      initializeTripsAdapter(),
    );

    res.status(200).send(trips);
    return;
  } catch (err) {
    console.log(err);
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
      res.status(400).json(errors);
      return;
    }

    const tripReturn: ITrip = await tripService.createUserTrip(
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
  param('userId', 'User id is required to be a numeric integer.')
    .isNumeric()
    .toInt(),
  getAllUserTrips,
);
tripsRouter.post(
  '/trips',
  body(
    'tripStart',
    'Trip start timestamp is required to follow ISO formatting.',
  ).isISO8601(),
  body(
    'tripEnd',
    'Trip end timestamp is required to follow ISO formatting.',
  ).isISO8601(),
  body('userId', 'User id is required to be a numeric integer.')
    .isNumeric()
    .toInt(),
  body('distance', 'Distance is required to be numeric.').isNumeric().toFloat(),
  createUserTrip,
);

export default tripsRouter;
