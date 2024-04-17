import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/users.model";

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: "sqlite",
      storage: "database/database.sqlite",
      autoLoadModels: true,
      synchronize: true,
      models: [User],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // constructor() {
  //   this.syncDatabase();
  // }
  // sequelize = new Sequelize({
  //   dialect: "sqlite", // Specify your database dialect (e.g., sqlite, mysql, postgres)
  //   storage: "database/database.sqlite", // Path to your SQLite database file
  //   models: [User],
  // });
  // // Sync models with the database
  // async syncDatabase() {
  //   try {
  //     await this.sequelize.sync({ alter: true });
  //     console.log("Database synchronized successfully.");
  //   } catch (error) {
  //     console.error("Error syncing database:", error);
  //   }
  // }
}
