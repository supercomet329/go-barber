import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from '@shared/infra/http/routes';

import '@shared/infra/typeorm';
import '@shared/container';

console.log('==> [FP17] <== Before server start');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

app.use(errors()); // erros do celebrate, sempre depois das rotas

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: `==> [FP17] <== Handled error: ${err.message}`,
    });
  }

  console.error(`==> [FP17] <== Internal server error:  ${err}`);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

// console.trace();

app.listen(3333, () => {
  console.log('==> [FP17] <== Server started on http://localhost:3333');
});
