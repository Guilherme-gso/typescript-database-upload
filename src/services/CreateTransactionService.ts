import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    category,
    title,
    type,
    value,
  }: RequestDTO): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    let categoryTitle = await categoryRepository.findOne({
      where: { title: category },
    });

    const { total } = await transactionRepository.getBalance();

    if (total < value && type === 'outcome') {
      throw new AppError('Insuficient value to outcome transactions');
    }

    if (!categoryTitle) {
      categoryTitle = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryTitle);
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category: categoryTitle,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
