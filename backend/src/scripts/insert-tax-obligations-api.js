const axios = require('axios');

// Dados das obrigações tributárias para o usuário "italo"
const taxObligations = [
  {
    name: 'IRPJ - Janeiro',
    description: 'Imposto de Renda Pessoa Jurídica',
    type: 'IRPJ',
    dueDate: '2025-01-31',
    amount: 2500.00,
    status: 'pendente',
    frequency: 'mensal',
    referenceMonth: '2025-01',
    notes: 'Vencimento último dia útil do mês',
    taxType: 'IRPJ'
  },
  {
    name: 'CSLL - Janeiro',
    description: 'Contribuição Social sobre Lucro Líquido',
    type: 'CSLL',
    dueDate: '2025-01-31',
    amount: 1200.00,
    status: 'pendente',
    frequency: 'mensal',
    referenceMonth: '2025-01',
    notes: 'Vencimento último dia útil do mês',
    taxType: 'CSLL'
  },
  {
    name: 'PIS/COFINS - Janeiro',
    description: 'PIS e COFINS sobre faturamento',
    type: 'PIS/COFINS',
    dueDate: '2025-02-15',
    amount: 850.00,
    status: 'pendente',
    frequency: 'mensal',
    referenceMonth: '2025-01',
    notes: 'Vencimento até o dia 15 do mês seguinte',
    taxType: 'PIS'
  },
  {
    name: 'ISS - Janeiro',
    description: 'Imposto sobre Serviços',
    type: 'ISS',
    dueDate: '2025-02-10',
    amount: 450.00,
    status: 'pago',
    frequency: 'mensal',
    referenceMonth: '2025-01',
    notes: 'Pago antecipadamente',
    taxType: 'ISS'
  }
];

async function insertTaxObligations() {
  try {
    // Primeiro, fazer login como usuário "italo"
    console.log('Fazendo login como usuário italo...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'devrhafael@outlook.com',
      password: 'Viver321'
    });

    const token = loginResponse.data.token;
    console.log('Login realizado com sucesso!');

    // Inserir cada obrigação tributária
    for (const obligation of taxObligations) {
      console.log(`Inserindo obrigação: ${obligation.name}...`);
      
      const response = await axios.post('http://localhost:3000/api/tax-obligations', obligation, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✓ Obrigação inserida: ${obligation.name} (ID: ${response.data.id})`);
    }

    console.log('\n✅ Todas as obrigações tributárias foram inseridas com sucesso!');

    // Verificar as obrigações inseridas
    console.log('\nVerificando obrigações inseridas...');
    const listResponse = await axios.get('http://localhost:3000/api/tax-obligations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`Total de obrigações: ${listResponse.data.length}`);
    listResponse.data.forEach(obligation => {
      console.log(`- ${obligation.name} (${obligation.type}) - R$ ${obligation.amount} - ${obligation.status}`);
    });

  } catch (error) {
    console.error('Erro ao inserir obrigações tributárias:', error.response?.data || error.message);
  }
}

insertTaxObligations();
