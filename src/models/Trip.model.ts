import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Trip' })
export class Trip extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: string;

  @Column({ name: 'tripStart' })
  tripStart: string;

  @Column({ name: 'tripEnd' })
  tripEnd: string;

  @Column({ name: 'duration' })
  duration: string;

  @Column({ name: 'cost' })
  cost: number;

  @Column({ name: 'distance' })
  distance: number;

  @Column({ name: 'userId' })
  userId: number;
}
