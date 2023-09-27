import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from "typeorm";

@Entity()
export class DevicesData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 10,
  })
  deviceId: string;


  
  @Column({ type: "timestamptz", default: () => "NOW()" })
  timestamp: Date;

  @Column({
    type: "numeric",
    precision: 5,
    scale: 2,
    default: null,
  })
  temp1: number;

  @Column({
    type: "numeric",
    precision: 5,
    scale: 2,
    default: null,
  })
  temp2: number;

  @Column({
    type: "numeric",
    precision: 5,
    scale: 2,
    default: null,
  })
  humidity: number;

  @Column({ type: "boolean", default: null })
  presence: boolean;

  @Column({
    type: "int",
    default: null,
  })
  rssi: number;

  @Column({
    type: "int",
    default: null,
  })
  uptime: number;
}
