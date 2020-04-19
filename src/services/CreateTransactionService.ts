import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';
import Category from '../models/Category';

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

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    let category_id;

    if (categoryExists) {
      category_id = categoryExists.id;
    } else {
      const newCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);
      category_id = newCategory.id;
    }

    const { total } = await transactionRepository.getBalance();

    if (total < value && type === 'outcome') {
      throw new AppError('Insuficient value to outcome transactions');
    }

    const transaction = transactionRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
