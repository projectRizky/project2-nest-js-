import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StreamProducts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
