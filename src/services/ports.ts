export interface ITrip {
  tripStart: string;
  tripEnd: string;
  duration: string;
  distance: number;
  cost: number;
}

export interface ITripInput {
  userId: number;
  tripStart: string;
  tripEnd: string;
  distance: number;
}

export interface ITripInsert extends ITripInput {
  duration: string;
  cost: number;
}
