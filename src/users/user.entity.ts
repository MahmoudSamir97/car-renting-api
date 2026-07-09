import { Report } from '@/reports/report.entity';
import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Exclude()
  @Column()
  password!: string;

  @OneToMany(() => Report, (report) => report.user)
  reports!: Report[];

  @AfterInsert()
  logUserInsert() {
    console.log('Inserted user with id', this.id);
  }

  @AfterUpdate()
  logUserUpdate() {
    console.log('Updated user with id', this.id);
  }

  @AfterRemove()
  logUserRemove() {
    console.log('Removed user with id', this.id);
  }
}
