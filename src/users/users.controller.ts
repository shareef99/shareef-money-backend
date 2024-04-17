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
import { UsersService } from "./users.service";
import { CreateUserDto, SigninDto, UpdateUserDto } from "src/users/users.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("signin")
  async signin(@Body(ValidationPipe) data: SigninDto) {
    return this.usersService.signin(data);
  }

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { user };
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return { users };
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return { user };
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.update(id, updateUserDto);
    return { message: "User updated successfully" };
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return { message: "User deleted successfully" };
  }
}
