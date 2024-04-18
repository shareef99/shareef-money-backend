import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  Put,
} from "@nestjs/common";
import { SubCategoriesService } from "./sub-categories.service";
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from "src/sub-categories/sub-categories.dto";

@Controller("sub-categories")
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createSubCategoryDto: CreateSubCategoryDto,
  ) {
    const subCategory =
      await this.subCategoriesService.create(createSubCategoryDto);
    return {
      message: "SubCategory created successfully",
      sub_Category: subCategory,
    };
  }

  @Get()
  async findAll() {
    const subCategories = await this.subCategoriesService.findAll();
    return {
      message: "SubCategories retrieved successfully",
      sub_Categories: subCategories,
    };
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const subCategory = await this.subCategoriesService.findOne(id);
    return {
      message: "SubCategory retrieved successfully",
      sub_Category: subCategory,
    };
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    await this.subCategoriesService.update(id, updateSubCategoryDto);
    return {
      message: "SubCategory updated successfully",
    };
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.subCategoriesService.remove(id);
    return {
      message: "SubCategory deleted successfully",
    };
  }
}
