import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie.entity";
import { BlablaUser } from "./users/entities/user.entity";

@Entity()
export class Vote {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @ManyToOne(() => BlablaUser)
  @JoinColumn({ referencedColumnName: "name" })
  user: BlablaUser

  @ManyToOne(() => Movie)
  movie: Movie;

  @Column({ type: 'timestamptz', nullable: false })
  timestampWithTimezone: Date;

}
