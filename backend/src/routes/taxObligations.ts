import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'GET tax obligations - TODO: implementar' });
});

router.post('/', async (req: Request, res: Response) => {
  res.json({ message: 'POST tax obligations - TODO: implementar' });
});

router.put('/:id', async (req: Request, res: Response) => {
  res.json({ message: 'PUT tax obligations - TODO: implementar' });
});

router.delete('/:id', async (req: Request, res: Response) => {
  res.json({ message: 'DELETE tax obligations - TODO: implementar' });
});

export default router;
