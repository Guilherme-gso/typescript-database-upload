import fs from 'fs';
import csv from 'csvtojson';
import path from 'path';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';

import CreateTransactionsService from './CreateTransactionService';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const transactionService = new CreateTransactionsService();
    const filePath = path.join(uploadConfig.directory, filename);
    const pathExists = await fs.promises.stat(filePath);

    const transactionsRepository = getRepository(TransactionsRepository);

    if (!pathExists) {
      throw new AppError('File not found');
    }

    const toCsvFile = await csv({ checkType: true }).fromFile(filePath);

    const transactions: Transaction[] = [];

    toCsvFile.map(async file => {
      const { title, type, value, category } = file;

      const transaction = await transactionService.execute({
        title,
        type,
        value: Number(value),
        category,
      });

      transactions.push(transaction);
    });

    await transactionsRepository.save(transactions);
    return transactions;
  }
}

export default ImportTransactionsService;
