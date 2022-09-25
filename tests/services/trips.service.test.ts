import { PolicyAdapter } from '../../src/adapters/policy.adapter';
import { NotificationsAdapter } from '../../src/adapters/notifications.adapter';
import { TripsAdapter } from '../../src/adapters/trips.adapter';
import { ITrip, ITripInput, ITripInsert } from '../../src/services/ports';
import { TripService } from '../../src/services/trips.service';

describe('Testing the trips service', () => {
  let tripService: TripService;
  let tripsAdapter: TripsAdapter;
  let policyAdapter: PolicyAdapter;
  let notificationsAdapter: NotificationsAdapter;

  beforeAll(async () => {
    tripService = new TripService();
    tripsAdapter = new TripsAdapter();
    policyAdapter = new PolicyAdapter();
    notificationsAdapter = new NotificationsAdapter();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('getAllUserTrips', () => {
    it('Should work, returns all of the trips for a given user', async () => {
      const userId = 1;

      const userTrips: ITrip[] = [
        {
          tripStart: 'startTimeStamp1',
          tripEnd: 'endTimeStamp1',
          cost: 80,
        } as ITrip,
        {
          tripStart: 'startTimeStamp2',
          tripEnd: 'endTimeStamp2',
          cost: 70,
        } as ITrip,
      ];

      const getAllUserTripsAdapterSpy = jest
        .spyOn(tripsAdapter, 'getAllUserTrips')
        .mockReturnValueOnce(Promise.resolve(userTrips));

      const result: ITrip[] = await tripService.getAllUserTrips(
        userId,
        tripsAdapter,
      );

      expect(result).toEqual(userTrips);
      expect(getAllUserTripsAdapterSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUserTrip', () => {
    it('Should work, calls all of the adapter/service functions and returns inserts', async () => {
      const tripInput: ITripInput = {
        userId: 1,
        tripStart: 'tripStart1',
        tripEnd: 'tripEnd1',
        distance: 10,
      };

      const tripInsert: ITripInsert = {
        ...tripInput,
        duration: 'PT5370',
        cost: 117,
      };

      const tripPricePerMile = 15;

      const getTripPricePerMileSpy = jest
        .spyOn(policyAdapter, 'getTripPricePerMile')
        .mockReturnValueOnce(Promise.resolve(tripPricePerMile));

      const insertUserTripSpy = jest
        .spyOn(tripsAdapter, 'insertUserTrip')
        .mockReturnValueOnce(undefined);

      const pushUserNotificationSpy = jest
        .spyOn(notificationsAdapter, 'pushUserNotification')
        .mockReturnValueOnce(undefined);

      const buildTripInsertsSpy = jest
        .spyOn(tripService, 'buildTripInserts')
        .mockReturnValueOnce(tripInsert);

      const result: ITripInsert = await tripService.createUserTrip(
        tripInput,
        tripsAdapter,
        policyAdapter,
        notificationsAdapter,
      );

      expect(result).toEqual(tripInsert);
      expect(getTripPricePerMileSpy).toHaveBeenCalledTimes(1);
      expect(insertUserTripSpy).toHaveBeenCalledTimes(1);
      expect(pushUserNotificationSpy).toHaveBeenCalledTimes(1);
      expect(buildTripInsertsSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('buildTripInserts', () => {
    it('Should work, calls all of the adapter/service functions and returns inserts', async () => {
      const tripInput: ITripInput = {
        userId: 1,
        tripStart: '2022-09-08T11:37:00.000Z',
        tripEnd: '2022-09-08T12:40:00.000Z',
        distance: 24.14,
      };

      const tripInsert: ITripInsert = {
        ...tripInput,
        duration: 'PT3780',
        cost: 150,
      };

      const tripPricePerMile = 10;

      const result: ITripInsert = tripService.buildTripInserts(
        tripInput,
        tripPricePerMile,
      );

      expect(result).toEqual(tripInsert);
    });
  });
});
