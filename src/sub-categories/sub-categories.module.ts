import { Module } from "@nestjs/common";
import { SubCategoriesService } from "./sub-categories.service";
import { SubCategoriesController } from "./sub-categories.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { SubCategory } from "src/sub-categories/sub-categories.model";

@Module({
  imports: [SequelizeModule.forFeature([SubCategory])],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
})
export class SubCategoriesModule {}
