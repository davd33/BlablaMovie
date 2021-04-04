import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BlablaUser } from "./user.entity";

@Entity()
export class LoggedInUser {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @ManyToOne(() => BlablaUser)
  @JoinColumn({ referencedColumnName: "name" })
  user: BlablaUser;

  @Column({
    unique: true
  })
  token: string;
}
