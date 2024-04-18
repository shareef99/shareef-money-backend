import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateAccountDto, UpdateAccountDto } from "src/accounts/accounts.dto";
import { Account } from "src/accounts/accounts.model";

@Injectable()
export class AccountsService {
  constructor(@InjectModel(Account) private accountModel: typeof Account) {}

  create(createAccountDto: CreateAccountDto) {
    const { amount, description, is_hidden, name, user_id } = createAccountDto;
    return this.accountModel.create({
      amount,
      description,
      is_hidden,
      name,
      user_id,
    });
  }

  findAll() {
    return this.accountModel.findAll();
  }

  findOne(id: number) {
    return this.accountModel.findOne({ where: { id } });
  }

  findByUserId(userId: number) {
    return this.accountModel.findAll({ where: { user_id: userId } });
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    await this.accountModel.update(updateAccountDto, { where: { id } });
  }

  async remove(id: number) {
    await this.accountModel.destroy({ where: { id } });
  }
}
