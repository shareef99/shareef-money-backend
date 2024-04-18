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
import { AccountsService } from "./accounts.service";
import { CreateAccountDto, UpdateAccountDto } from "src/accounts/accounts.dto";

@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Body(ValidationPipe) createAccountDto: CreateAccountDto) {
    const account = await this.accountsService.create(createAccountDto);
    return {
      message: "Account created successfully",
      account,
    };
  }

  @Get()
  async findAll() {
    const accounts = await this.accountsService.findAll();
    return {
      message: "Accounts retrieved successfully",
      accounts,
    };
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const account = await this.accountsService.findOne(id);
    return {
      message: "Account retrieved successfully",
      account,
    };
  }

  @Get("user/:id")
  async findByUserId(@Param("id", ParseIntPipe) id: number) {
    const accounts = await this.accountsService.findByUserId(id);
    return {
      message: "Accounts retrieved successfully",
      accounts,
    };
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body(ValidationPipe) updateAccountDto: UpdateAccountDto,
  ) {
    await this.accountsService.update(id, updateAccountDto);
    return {
      message: "Account updated successfully",
    };
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.accountsService.remove(id);
    return {
      message: "Account deleted successfully",
    };
  }
}
