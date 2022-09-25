import { NextFunction, Request, Response } from 'express';
import { TripsAdapter } from '../adapters/trips.adapter';
import { ITrip, ITripInput, ITripInsert } from '../services/ports';
import { TripService } from '../services/trips.service';
import { initializeClass } from '../utils/classSingleton';

export const getAllUserTrips = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId: string = req.params.userId;

    const tripService: TripService = initializeClass();
    const tripsAdapter: TripsAdapter = new TripsAdapter();

    const trips: ITrip[] = await tripService.getAllUserTrips(
      userId,
      tripsAdapter,
    );

    res.status(200).send(trips);
  } catch (err) {
    next(err);
  }
};

export const createUserTrip = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tripInput: ITripInput = JSON.parse(req.body);

    const tripService: TripService = initializeClass();
    const tripsAdapter: TripsAdapter = new TripsAdapter();

    const tripReturn: ITripInsert = await tripService.createUserTrip(
      tripInput,
      tripsAdapter,
    );

    res.status(200).send(tripReturn);
  } catch (err) {
    next(err);
  }
};
