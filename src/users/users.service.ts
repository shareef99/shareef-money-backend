import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  CreateUserDto,
  SigninDto,
  SignupDto,
  UpdateUserDto,
} from "src/users/users.dto";
import { User } from "src/users/users.model";
import * as bcrypt from "bcrypt";

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

  async signup(data: SignupDto) {
    if (data.password !== data.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const user = await this.userModel.findOne({ where: { email: data.email } });

    if (user) {
      throw new BadRequestException("User already exists");
    }

    const hash = bcrypt.hashSync(data.password, 10);

    const newUser = await this.userModel.create({
      name: data.name,
      email: data.email,
      password: hash,
      refer_code: this.generateRandomString(6),
    });

    return {
      message: "Signup successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        currency: newUser.currency,
        month_start_date: newUser.month_start_date,
        week_start_day: newUser.week_start_day,
        refer_code: newUser.refer_code,
        is_active: newUser.is_active,
      },
    };
  }

  async signin(data: SigninDto) {
    const user = await this.userModel.findOne({ where: { email: data.email } });

    if (!user) {
      throw new BadRequestException("Invalid email");
    }

    const isMatch = bcrypt.compareSync(data.password, user.password);

    if (!isMatch) {
      throw new BadRequestException("Invalid password");
    }

    return { message: "Signin successfully", user: user };
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
