import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Middleware de autenticação (ajuste conforme seu projeto)
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // ...implemente a verificação do JWT aqui...
  next();
}

// POST /api/import/nfe-xml
router.post('/nfe-xml', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ error: 'Arquivo XML não enviado.' });
    }
    const filePath = path.resolve(file.path);
    const xmlContent = fs.readFileSync(filePath, 'utf8');
    // Remove arquivo temporário
    fs.unlinkSync(filePath);

    // Parse XML para JSON
    const json = await parseStringPromise(xmlContent, { explicitArray: false, mergeAttrs: true });

    // Extrair dados principais da NFe (ajuste conforme estrutura do seu XML)
    // Exemplo para NFe padrão nacional
    const nfeProc = json.nfeProc || json.NFe || json.nfe || json;
    const infNFe = nfeProc.NFe?.infNFe || nfeProc.infNFe || nfeProc;
    const ide = infNFe.ide || {};
    const emit = infNFe.emit || {};
    const dest = infNFe.dest || {};
    const total = infNFe.total?.ICMSTot || {};
    const produtos = Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det];

    // Montar preview das "transações" (produtos/serviços)
    const preview = produtos.map((item: any) => ({
      nNF: ide.nNF,
      dataEmissao: ide.dhEmi || ide.dEmi,
      emitente: emit.xNome,
      destinatario: dest.xNome,
      valorTotal: total.vNF,
      produto: item.prod.xProd,
      valorProduto: item.prod.vProd,
      cfop: item.prod.CFOP,
      ncm: item.prod.NCM,
      quantidade: item.prod.qCom,
      unidade: item.prod.uCom
    }));

    return res.json({ preview });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao processar arquivo XML', details: err?.message || String(err) });
  }
});

export default router;
