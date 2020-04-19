// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const existsTransaction = await transactionsRepository.findOne({
      where: { id },
    });

    if (!existsTransaction) {
      throw new AppError('Impossible to delete, not found id');
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
