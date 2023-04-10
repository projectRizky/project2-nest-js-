import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'cities',
})
export class Cities {
  @PrimaryGeneratedColumn({
    type: 'mediumint',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    name: 'state_id',
    type: 'mediumint',
    unsigned: true,
    nullable: false,
  })
  stateId: number;

  @Column({
    name: 'state_code',
    type: 'varchar',
    length: 255,
  })
  stateCode: string;

  @Column({
    name: 'country_id',
    type: 'mediumint',
    unsigned: true,
    nullable: false,
  })
  countryId: number;

  @Column({
    name: 'country_code',
    type: 'char',
    length: 2,
  })
  countryCode: string;

  @Column({
    name: 'latitude',
    type: 'decimal',
  })
  latitude: number;

  @Column({
    name: 'longitude',
    type: 'decimal',
  })
  longitude: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: '2014-01-01 01:01:01',
  })
  created_at: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({
    name: 'flag',
    type: 'tinyint',
    scale: 1,
    default: 1,
  })
  flag: number;

  @Column({
    name: 'wikiDataId',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  wikiDataId: string;
}
