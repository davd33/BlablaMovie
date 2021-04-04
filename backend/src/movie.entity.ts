import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Movie {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  year: string;

  @Column()
  type: string;

  @Column({ unique: true })
  imdbID: string;

  @Column()
  poster: string;

}
