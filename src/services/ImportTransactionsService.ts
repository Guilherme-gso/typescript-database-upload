import fs from 'fs';
import csv from 'csvtojson';
import path from 'path';
import Transaction from '../models/Transaction';
import uploadConfig from '../config/upload';

import CreateTransactionsService from './CreateTransactionService';
import AppError from '../errors/AppError';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const transactionService = new CreateTransactionsService();
    const filePath = path.join(uploadConfig.directory, filename);
    const pathExists = await fs.promises.stat(filePath);

    if (!pathExists) {
      throw new AppError('File not found');
    }

    const toCsvFile = await csv({ checkType: true }).fromFile(filePath);

    const transcations: Transaction[] = [];

    toCsvFile.map(async file => {
      const { title, type, value, category } = file;

      const transaction = await transactionService.execute({
        title,
        type,
        value: Number(value),
        category,
      });

      transcations.push(transaction);
    });

    return transcations;
  }
}

export default ImportTransactionsService;
