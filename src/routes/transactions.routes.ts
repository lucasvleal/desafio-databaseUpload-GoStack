import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import Transaction from '../models/Transaction';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import configUpload from '../config/upload';

const upload = multer(configUpload);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();

  const balance = await transactionsRepository.getBalance();

  const returnedObject = {
    transactions,
    balance,
  };

  return response.json(returnedObject);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createService = new CreateTransactionService();

  const newTransaction = await createService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(newTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteService = new DeleteTransactionService();

  await deleteService.execute({ transactionId: id });

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { path } = request.file;
    // console.log(request.file);
    const importService = new ImportTransactionsService();

    const newTransactions = await importService.execute(path);

    return response.json(newTransactions);
    // return response.json({ ok: true });
  },
);

export default transactionsRouter;
