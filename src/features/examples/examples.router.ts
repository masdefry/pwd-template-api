import express from 'express';
import { ExamplesController } from './examples.controller';

export const examplesRouter = express.Router();

examplesRouter.get('/', ExamplesController.list);
examplesRouter.post('/', ExamplesController.create);
examplesRouter.put('/:id', ExamplesController.update);
examplesRouter.delete('/:id', ExamplesController.delete);
