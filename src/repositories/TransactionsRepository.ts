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

    const somatoryIncome = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((somatory, transaction) => somatory + transaction.value, 0);

    const somatoryOutcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((somatory, transaction) => somatory + transaction.value, 0);

    const total = somatoryIncome - somatoryOutcome;

    const balance = {
      income: somatoryIncome,
      outcome: somatoryOutcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
