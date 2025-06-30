import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'GET expenses - TODO: implementar' });
});

router.post('/', async (req: Request, res: Response) => {
  res.json({ message: 'POST expenses - TODO: implementar' });
});

router.put('/:id', async (req: Request, res: Response) => {
  res.json({ message: 'PUT expenses - TODO: implementar' });
});

router.delete('/:id', async (req: Request, res: Response) => {
  res.json({ message: 'DELETE expenses - TODO: implementar' });
});

export default router;
