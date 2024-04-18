import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "src/categories/categories.dto";
import { Category } from "src/categories/categories.model";
import { SubCategory } from "src/sub-categories/sub-categories.model";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryModel: typeof Category,
    @InjectModel(SubCategory) private subCategoryModel: typeof SubCategory,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, type, user_id } = createCategoryDto;
    const category = await this.categoryModel.create({ name, type, user_id });
    await this.subCategoryModel.create({
      category_id: category.id,
      name: "Default",
    });
    return category;
  }

  findAll() {
    return this.categoryModel.findAll();
  }

  findOne(id: number) {
    return this.categoryModel.findOne({ where: { id } });
  }

  findByUserId(id: number) {
    return this.categoryModel.findAll({
      where: { user_id: id },
      include: ["sub_categories"],
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryModel.update(updateCategoryDto, { where: { id } });
  }

  async remove(id: number) {
    await this.categoryModel.destroy({ where: { id } });
  }
}
