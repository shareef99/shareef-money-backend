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
import { CategoriesService } from "./categories.service";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "src/categories/categories.dto";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);
    return {
      message: "Category created successfully",
      category,
    };
  }

  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return {
      message: "Categories retrieved successfully",
      categories,
    };
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    return {
      message: "Category retrieved successfully",
      category,
    };
  }

  @Get("user/:id")
  async findByUserId(@Param("id", ParseIntPipe) id: number) {
    const categories = await this.categoriesService.findByUserId(id);
    return {
      message: "Categories retrieved successfully",
      categories,
    };
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    this.categoriesService.update(id, updateCategoryDto);
    return {
      message: "Category updated successfully",
    };
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    this.categoriesService.remove(id);
    return {
      message: "Category deleted successfully",
    };
  }
}
