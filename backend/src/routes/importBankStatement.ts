import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { parse } from 'ofx-parser';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Middleware de autenticação (ajuste conforme seu projeto)
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // ...implemente a verificação do JWT aqui...
  next();
}

// POST /api/import/bank-statement

router.post('/bank-statement', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ error: 'Arquivo OFX não enviado.' });
    }
    const filePath = path.resolve(file.path);
    const ofxContent = fs.readFileSync(filePath, 'utf8');
    const data = parse(ofxContent);
    // Remove arquivo temporário
    fs.unlinkSync(filePath);

    // Extrai transações do OFX
    const transactions = (data?.bankAccount?.statement?.transactions || []).map((tx: any) => ({
      date: tx.date,
      amount: tx.amount,
      type: tx.type, // DEBIT/CREDIT
      description: tx.memo || tx.name || '',
      id: tx.id || null
    }));

    // Mapeia para receitas/despesas sugeridas
    const preview = transactions.map((tx: any) => ({
      date: tx.date,
      amount: tx.amount,
      description: tx.description,
      type: tx.amount > 0 ? 'income' : 'expense',
      originalType: tx.type
    }));

    return res.json({ preview });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao processar arquivo OFX', details: err?.message || String(err) });
  }
});

export default router;


