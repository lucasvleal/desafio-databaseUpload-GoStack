import { getRepository } from 'typeorm';

import TransactionError from '../errors/TransactionError';
import Transaction from '../models/Transaction';

interface Request {
  transactionId: string;
}

class DeleteTransactionService {
  public async execute({ transactionId }: Request): Promise<void> {
    const transactionsRepository = getRepository(Transaction);

    const transactionExists = transactionsRepository.findOne(transactionId);

    if (!transactionExists) {
      throw new TransactionError('Transaction dont exists', 404);
    }

    await transactionsRepository.delete(transactionId);
  }
}

export default DeleteTransactionService;
