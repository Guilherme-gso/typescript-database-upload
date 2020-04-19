import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const initialValues = {
      outcome: 0,
      income: 0,
      total: 0,
    };

    const balance = transactions.reduce((currentValue, transaction) => {
      return transaction.type === 'outcome'
        ? {
            ...currentValue,
            outcome: transaction.value + currentValue.outcome,
            total:
              currentValue.income - (transaction.value + currentValue.outcome),
          }
        : {
            ...currentValue,
            income: transaction.value + currentValue.income,
            total:
              transaction.value + currentValue.income - currentValue.outcome,
          };
    }, initialValues);

    return balance;
  }
}

export default TransactionsRepository;
