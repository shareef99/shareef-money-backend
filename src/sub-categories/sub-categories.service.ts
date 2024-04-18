import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from "src/sub-categories/sub-categories.dto";
import { SubCategory } from "src/sub-categories/sub-categories.model";

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectModel(SubCategory) private subCategoryModel: typeof SubCategory,
  ) {}

  create(createSubCategoryDto: CreateSubCategoryDto) {
    const { category_id, name } = createSubCategoryDto;
    return this.subCategoryModel.create({ category_id, name });
  }

  findAll() {
    return this.subCategoryModel.findAll();
  }

  findOne(id: number) {
    return this.subCategoryModel.findOne({ where: { id } });
  }

  async update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    await this.subCategoryModel.update(updateSubCategoryDto, { where: { id } });
  }

  async remove(id: number) {
    await this.subCategoryModel.destroy({ where: { id } });
  }
}
