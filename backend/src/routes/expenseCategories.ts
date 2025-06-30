import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'GET expense categories - TODO: implementar' });
});

router.post('/', async (req: Request, res: Response) => {
  res.json({ message: 'POST expense categories - TODO: implementar' });
});

router.put('/:id', async (req: Request, res: Response) => {
  res.json({ message: 'PUT expense categories - TODO: implementar' });
});

router.delete('/:id', async (req: Request, res: Response) => {
  res.json({ message: 'DELETE expense categories - TODO: implementar' });
});

export default router;
