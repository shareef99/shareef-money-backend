import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto, SigninDto, UpdateUserDto } from "src/users/users.dto";
import { User } from "src/users/users.model";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  generateRandomString(length: number): string {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const result: string[] = [];
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result.push(charset[randomIndex]);
    }
    return result.join("");
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      refer_code: this.generateRandomString(6),
    };
    return this.userModel.create(user);
  }

  async signin(data: SigninDto) {
    const user = await this.userModel.findOne({ where: { email: data.email } });

    if (user) {
      return { message: "Signin successfully", user: user };
    }

    const newUser = await this.userModel.create({
      name: data.name,
      email: data.email,
      refer_code: this.generateRandomString(6),
    });

    return { message: "Signup successfully", user: newUser };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User> {
    return this.userModel.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userModel.update(updateUserDto, { where: { id } });
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
