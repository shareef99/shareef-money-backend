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
  Query,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from "src/transactions/transactions.dto";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(
    @Body(ValidationPipe) createTransactionDto: CreateTransactionDto,
  ) {
    const transaction =
      await this.transactionsService.create(createTransactionDto);

    return {
      message: "Transaction created successfully",
      transaction,
    };
  }

  @Get()
  async findAll() {
    const transactions = await this.transactionsService.findAll();

    return {
      message: "Transactions retrieved successfully",
      transactions,
    };
  }

  @Get("user/:id")
  async findByUserId(@Param("id", ParseIntPipe) id: number) {
    const transactions = await this.transactionsService.findByUserId(id);

    return {
      message: "Transactions retrieved successfully",
      transactions,
    };
  }

  @Get("account/:id")
  async findByAccountId(@Param("id", ParseIntPipe) id: number) {
    const transactions = await this.transactionsService.findByAccountId(id);

    return {
      message: "Transactions retrieved successfully",
      transactions,
    };
  }

  @Get("category/:id")
  async findByCategoryId(@Param("id", ParseIntPipe) id: number) {
    const transactions = await this.transactionsService.findByCategoryId(id);

    return {
      message: "Transactions retrieved successfully",
      transactions,
    };
  }

  @Get("sub-category/:id")
  async findBySubCategoryId(@Param("id", ParseIntPipe) id: number) {
    const transactions = await this.transactionsService.findBySubCategoryId(id);

    return {
      message: "Transactions retrieved successfully",
      transactions,
    };
  }

  @Get("monthly")
  async getMonthlyTransactions(
    @Query("user_id", ParseIntPipe) userId: number,
    @Query("month", ParseIntPipe) month: number,
    @Query("year", ParseIntPipe) year: number,
  ) {
    const dailyTransactions =
      await this.transactionsService.getDailyTransactionByMonth(
        userId,
        month,
        year,
      );

    return {
      message: "Transactions Fetched!",
      transactions: dailyTransactions,
    };
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const transaction = await this.transactionsService.findOne(id);

    return {
      message: "Transaction retrieved successfully",
      transaction,
    };
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body(ValidationPipe) updateTransactionDto: UpdateTransactionDto,
  ) {
    await this.transactionsService.update(id, updateTransactionDto);

    return {
      message: "Transaction updated successfully",
    };
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.transactionsService.remove(id);

    return {
      message: "Transaction deleted successfully",
    };
  }
}
