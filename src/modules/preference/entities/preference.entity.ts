import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Preference {
  @PrimaryColumn({
    name: 'user_id',
    type: 'char',
    length: 36,
  })
  userId: string;

  @Column({
    name: 'email_notification',
    type: 'boolean',
    default: () => false,
  })
  emailNotification: boolean;

  @Column({
    name: 'languange',
    type: 'enum',
    enum: ['id', 'en'],
    default: 'id',
  })
  language: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
