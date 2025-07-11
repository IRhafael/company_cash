import React, { useState } from 'react';
import axios from 'axios';

interface NfePreview {
  nNF: string;
  dataEmissao: string;
  emitente: string;
  destinatario: string;
  valorTotal: string;
  produto: string;
  valorProduto: string;
  cfop: string;
  ncm: string;
  quantidade: string;
  unidade: string;
}

const ImportarNfeXml: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<NfePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setPreview([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setPreview([]);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:3001/api/import/nfe-xml', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Resposta da API:', response.data);
      if (response.data.preview && response.data.preview.length > 0) {
        setPreview(response.data.preview);
      } else if (response.data.preview && response.data.preview.length === 0) {
        setError('Nenhum produto/serviço encontrado no XML.');
      } else {
        setError('Resposta inesperada da API.');
      }
    } catch (err: any) {
      console.error('Erro ao importar XML:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao importar arquivo XML');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow bg-white">
      <h2 className="text-lg font-bold mb-2">Importar Nota Fiscal Eletrônica (XML)</h2>
      <input type="file" accept=".xml" onChange={handleFileChange} className="mb-2" />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Importar'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {file && <div className="text-xs text-gray-500 mt-1">Arquivo selecionado: {file.name}</div>}
      {preview.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Preview dos Produtos/Serviços:</h3>
          <div className="max-h-64 overflow-y-auto border rounded p-2 bg-gray-50">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Nº NF</th>
                  <th className="text-left">Data</th>
                  <th className="text-left">Emitente</th>
                  <th className="text-left">Destinatário</th>
                  <th className="text-left">Produto</th>
                  <th className="text-right">Valor Produto</th>
                  <th className="text-right">Valor Total NF</th>
                  <th className="text-center">CFOP</th>
                  <th className="text-center">NCM</th>
                  <th className="text-center">Qtd</th>
                  <th className="text-center">Unid</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.nNF}</td>
                    <td>{item.dataEmissao ? new Date(item.dataEmissao).toLocaleDateString() : ''}</td>
                    <td>{item.emitente}</td>
                    <td>{item.destinatario}</td>
                    <td>{item.produto}</td>
                    <td className="text-right">{Number(item.valorProduto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="text-right">{Number(item.valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="text-center">{item.cfop}</td>
                    <td className="text-center">{item.ncm}</td>
                    <td className="text-center">{item.quantidade}</td>
                    <td className="text-center">{item.unidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportarNfeXml;
