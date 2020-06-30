import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
// import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);
    let category_id: string;

    let transactionCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    // console.log(transactionCategory);

    if (!transactionCategory) {
      transactionCategory = categoriesRepository.create({
        title: category,
      });
    }

    await categoriesRepository.save(transactionCategory);

    const currentBalance = await transactionsRepository.getBalance();

    if (type === 'outcome' && currentBalance.total - value < 0) {
      throw new AppError('Outcome higher than current balance');
    }

    const createdTransaction = transactionsRepository.create({
      title,
      type,
      value,
      category: transactionCategory,
    });

    await transactionsRepository.save(createdTransaction);

    return createdTransaction;
  }
}

export default CreateTransactionService;
