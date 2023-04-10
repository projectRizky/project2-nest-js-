import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'countries',
})
export class Countries {
  @PrimaryGeneratedColumn({
    type: 'mediumint',
    unsigned: true,
  })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    name: 'iso3',
    type: 'char',
    length: 3,
    nullable: true,
  })
  iso3: string;

  @Column({
    name: 'numeric_code',
    type: 'char',
    length: 3,
    nullable: true,
  })
  numericCode: string;

  @Column({
    name: 'iso2',
    type: 'char',
    length: 2,
    nullable: true,
  })
  iso2: string;

  @Column({
    name: 'phonecode',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  phoneCode: string;

  @Column({
    name: 'capital',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  capital: string;

  @Column({
    name: 'currency',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  currency: string;

  @Column({
    name: 'currency_symbol',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  currencySymbol: string;

  @Column({
    name: 'tld',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  tld: string;

  @Column({
    name: 'native',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  native: string;

  @Column({
    name: 'region',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  region: string;

  @Column({
    name: 'subregion',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  subRegion: string;

  @Column({
    name: 'timezones',
    type: 'json',
    nullable: true,
  })
  timeZones: string;

  @Column({
    name: 'translations',
    type: 'json',
    nullable: true,
  })
  translations: string;

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
    name: 'emoji',
    type: 'varchar',
    length: 191,
    nullable: true,
  })
  emoji: string;

  @Column({
    name: 'emojiU',
    type: 'varchar',
    length: 191,
    nullable: true,
  })
  emojiU: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    nullable: true,
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
