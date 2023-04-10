import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StreamProducts } from './stream-products.entity';

@Entity()
export class LoginLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  user_id: string;

  @Column()
  status_login: number;

  @Column()
  device: string;

  @Column()
  ip: string;

  @Column()
  os: string;

  @Column()
  browser: string;

  @Column()
  brand: string;

  @ManyToOne(() => StreamProducts, (streamProducts) => streamProducts.id)
  @JoinColumn([{ name: 'source_product', referencedColumnName: 'id' }])
  source_product: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
