import { IsEmail, MinLength } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'full_name',
  })
  @Index('full_name_idx')
  fullName: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'username',
    unique: true,
  })
  @Index('username_idx')
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'email',
    unique: true,
    nullable: true,
  })
  @IsEmail()
  @Index('email_idx')
  email: string;

  @Column({
    name: 'email_verified',
    default: false,
  })
  emailVerified: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'password',
    nullable: true,
  })
  @MinLength(8)
  password: string;

  @Column({
    type: 'timestamp',
    name: 'date_of_birth',
    nullable: true,
  })
  @MinLength(8)
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'undefined'],
    default: 'undefined',
    name: 'gender',
  })
  gender: string;

  @Column({
    type: 'varchar',
    name: 'phone_number',
    unique: true,
    nullable: true,
  })
  @Index('phone_number_idx')
  phoneNumber: string;

  @Column({
    name: 'phone_verified',
    nullable: true,
  })
  phoneVerified: boolean;

  @Column({
    type: 'text',
    name: 'avatar',
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'mediumint',
    name: 'countries_id',
    nullable: true,
  })
  countriesId: number;

  @Column({
    type: 'mediumint',
    name: 'states_id',
    nullable: true,
  })
  statesId: number;

  @Column({
    type: 'mediumint',
    name: 'cities_id',
    nullable: true,
  })
  citiesId: number;

  @Column({
    type: 'varchar',
    name: 'address',
    nullable: true,
  })
  address: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;
}
