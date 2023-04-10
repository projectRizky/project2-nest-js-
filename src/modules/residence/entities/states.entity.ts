import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'states',
})
export class States {
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
    name: 'country_id',
    type: 'mediumint',
    unsigned: true,
  })
  countryId: number;

  @Column({
    name: 'country_code',
    type: 'char',
    length: 2,
  })
  countryCode: string;

  @Column({
    name: 'fips_code',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  fipsCode: string;

  @Column({
    name: 'iso2',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  iso2: string;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 191,
    nullable: true,
  })
  type: string;

  @Column({
    name: 'latitude',
    type: 'decimal',
    nullable: true,
  })
  latitude: number;

  @Column({
    name: 'longitude',
    type: 'decimal',
    nullable: true,
  })
  longitude: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @Column({
    name: 'flag',
    type: 'tinyint',
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
