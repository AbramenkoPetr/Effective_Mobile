import { DataSource } from 'typeorm'
import { Requests } from './observation.entity';

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "userpg",
  password: "1234",
  database: "db_requests",
  entities: [Requests],
  synchronize: true,
})