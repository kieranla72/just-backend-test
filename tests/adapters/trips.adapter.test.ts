import { DataSource } from 'typeorm';
import { TripsAdapter } from '../../src/adapters/trips.adapter';
import { Trip } from '../../src/models';
import { ITrip, ITripInsert } from '../../src/services/ports';
import * as connectionUtil from '../../src/utils/createConnection';
import { queryBuilderObject, typeORMMock } from './adapterMocks/typeORM.mock';

describe('Testing the trips service', () => {
  let tripsAdapter: TripsAdapter;

  beforeAll(async () => {
    tripsAdapter = new TripsAdapter();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('getAllUserTrips', () => {
    it('Should work, returns all the trips for a given user and transforms shape using a port', async () => {
      const mockConnection: DataSource = typeORMMock;

      const trips: Trip[] = [
        {
          userId: 1,
          id: 'id1',
          tripEnd: 'tripEnd1',
          cost: 10,
        } as Trip,
        {
          userId: 1,
          id: 'id2',
          tripEnd: 'tripEnd2',
          cost: 10,
        } as Trip,
      ];

      jest.spyOn(queryBuilderObject, 'getMany').mockReturnValue(trips);
      jest
        .spyOn(connectionUtil, 'createConnection')
        .mockReturnValue(Promise.resolve(mockConnection));

      const tripsWithoutUserId: ITrip[] = [
        { tripEnd: 'tripEnd1', cost: 10 } as ITrip,
        { tripEnd: 'tripEnd2', cost: 10 } as ITrip,
      ];

      const result: ITrip[] = await tripsAdapter.getAllUserTrips(1);

      expect(result).toEqual(tripsWithoutUserId);
    });
  });

  describe('insertUserTrip', () => {
    it('Should work, inserts all of the trips', async () => {
      const mockConnection: DataSource = typeORMMock;

      const tripInserts: ITripInsert[] = [
        {
          userId: 1,
          tripEnd: 'tripEnd1',
          cost: 10,
        } as ITripInsert,
        {
          userId: 1,
          tripEnd: 'tripEnd2',
          cost: 10,
        } as ITripInsert,
      ];

      jest.spyOn(queryBuilderObject, 'getMany').mockReturnValue(undefined);
      jest
        .spyOn(connectionUtil, 'createConnection')
        .mockReturnValue(Promise.resolve(mockConnection));

      const result: ITrip[] = await tripsAdapter.insertUserTrip(tripInserts);

      expect(result).toEqual(tripInserts);
    });
  });
});
