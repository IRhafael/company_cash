import { Router, Request, Response } from 'express';

const router = Router();

router.get('/financial-summary', async (req: Request, res: Response) => {
  res.json({ message: 'GET financial summary - TODO: implementar' });
});

router.get('/monthly-data', async (req: Request, res: Response) => {
  res.json({ message: 'GET monthly data - TODO: implementar' });
});

router.get('/export', async (req: Request, res: Response) => {
  res.json({ message: 'GET export data - TODO: implementar' });
});

export default router;
