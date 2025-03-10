"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDataSource = void 0;
const typeorm_1 = require("typeorm");
const observation_entity_1 = require("./observation.entity");
exports.PostgresDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "userpg",
    password: "1234",
    database: "db_requests",
    entities: [observation_entity_1.Requests],
    synchronize: true,
});
