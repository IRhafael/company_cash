// Script para popular a conta do italo com dados completos para visualização de gráficos
const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    
    req.end();
  });
}

async function login() {
  console.log('🔐 Fazendo login como usuário italo...');
  
  const loginResult = await makeRequest({
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }, {
    email: 'devrhafael@outlook.com',
    password: 'Viver321'
  });
  
  if (loginResult.status === 200) {
    console.log('✅ Login realizado com sucesso!');
    return loginResult.data.token;
  } else {
    throw new Error(`Falha no login: ${loginResult.data?.error || 'Erro desconhecido'}`);
  }
}

async function insertIncomes(token) {
  console.log('\n💰 Inserindo receitas...');
  
  const incomes = [
    {
      description: 'Consultoria de TI - Cliente A',
      amount: 15000.00,
      date: '2025-01-05',
      source: 'Consultoria',
      category: 'Serviços',
      notes: 'Projeto de desenvolvimento de sistema'
    },
    {
      description: 'Venda de Software - Licença Anual',
      amount: 8500.00,
      date: '2025-01-10',
      source: 'Vendas',
      category: 'Produtos',
      notes: 'Licença anual do software proprietário'
    },
    {
      description: 'Treinamento Corporativo',
      amount: 4200.00,
      date: '2025-01-15',
      source: 'Treinamentos',
      category: 'Educação',
      notes: 'Treinamento de React para equipe'
    },
    {
      description: 'Manutenção de Sistemas',
      amount: 3500.00,
      date: '2025-01-20',
      source: 'Manutenção',
      category: 'Serviços',
      notes: 'Manutenção mensal de sistemas'
    },
    {
      description: 'Consultoria de TI - Cliente B',
      amount: 12000.00,
      date: '2025-02-02',
      source: 'Consultoria',
      category: 'Serviços',
      notes: 'Migração para cloud'
    },
    {
      description: 'Desenvolvimento de App Mobile',
      amount: 18000.00,
      date: '2025-02-10',
      source: 'Desenvolvimento',
      category: 'Projetos',
      notes: 'App mobile para e-commerce'
    },
    {
      description: 'Suporte Técnico Premium',
      amount: 2800.00,
      date: '2025-02-15',
      source: 'Suporte',
      category: 'Serviços',
      notes: 'Suporte premium mensal'
    }
  ];
  
  for (const income of incomes) {
    try {
      const result = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/incomes',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }, income);
      
      if (result.status === 201) {
        console.log(`✅ Receita inserida: ${income.description} - R$ ${income.amount}`);
      } else {
        console.log(`❌ Falha ao inserir receita: ${income.description}`);
      }
    } catch (error) {
      console.log(`❌ Erro ao inserir receita ${income.description}: ${error.message}`);
    }
  }
}

async function insertExpenses(token) {
  console.log('\n💸 Inserindo despesas...');
  
  const expenses = [
    {
      description: 'Aluguel do Escritório',
      amount: 2500.00,
      date: '2025-01-05',
      category: 'Aluguel',
      notes: 'Aluguel mensal do escritório'
    },
    {
      description: 'Energia Elétrica',
      amount: 450.00,
      date: '2025-01-08',
      category: 'Utilidades',
      notes: 'Conta de luz do escritório'
    },
    {
      description: 'Internet e Telefone',
      amount: 320.00,
      date: '2025-01-10',
      category: 'Telecomunicações',
      notes: 'Plano empresarial'
    },
    {
      description: 'Material de Escritório',
      amount: 680.00,
      date: '2025-01-12',
      category: 'Materiais',
      notes: 'Papel, canetas, cartuchos'
    },
    {
      description: 'Software Adobe Creative Suite',
      amount: 250.00,
      date: '2025-01-15',
      category: 'Software',
      notes: 'Licença mensal'
    },
    {
      description: 'Combustível',
      amount: 420.00,
      date: '2025-01-18',
      category: 'Transporte',
      notes: 'Visitas a clientes'
    },
    {
      description: 'Almoco com Cliente',
      amount: 180.00,
      date: '2025-01-20',
      category: 'Alimentação',
      notes: 'Reunião de negócios'
    },
    {
      description: 'Contador',
      amount: 800.00,
      date: '2025-01-25',
      category: 'Serviços Profissionais',
      notes: 'Serviços contábeis mensais'
    },
    {
      description: 'Seguro Empresarial',
      amount: 350.00,
      date: '2025-01-30',
      category: 'Seguros',
      notes: 'Seguro do escritório'
    },
    {
      description: 'Marketing Digital',
      amount: 1200.00,
      date: '2025-02-02',
      category: 'Marketing',
      notes: 'Campanhas Google Ads'
    },
    {
      description: 'Hospedagem de Servidores',
      amount: 890.00,
      date: '2025-02-05',
      category: 'Tecnologia',
      notes: 'AWS e serviços cloud'
    },
    {
      description: 'Equipamentos de TI',
      amount: 2100.00,
      date: '2025-02-08',
      category: 'Equipamentos',
      notes: 'Upgrade de computadores'
    }
  ];
  
  for (const expense of expenses) {
    try {
      const result = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/expenses',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }, expense);
      
      if (result.status === 201) {
        console.log(`✅ Despesa inserida: ${expense.description} - R$ ${expense.amount}`);
      } else {
        console.log(`❌ Falha ao inserir despesa: ${expense.description}`);
      }
    } catch (error) {
      console.log(`❌ Erro ao inserir despesa ${expense.description}: ${error.message}`);
    }
  }
}

async function insertTaxObligations(token) {
  console.log('\n📋 Inserindo obrigações tributárias...');
  
  const obligations = [
    {
      title: 'IRPJ - Janeiro 2025',
      description: 'Imposto de Renda Pessoa Jurídica',
      category: 'IRPJ',
      dueDate: '2025-01-31',
      amount: 2800.00,
      status: 'pago',
      priority: 'alta',
      frequency: 'mensal',
      referenceMonth: '2025-01',
      notes: 'Pago via DAS',
      taxType: 'IRPJ'
    },
    {
      title: 'CSLL - Janeiro 2025',
      description: 'Contribuição Social sobre Lucro Líquido',
      category: 'CSLL',
      dueDate: '2025-01-31',
      amount: 1400.00,
      status: 'pago',
      priority: 'alta',
      frequency: 'mensal',
      referenceMonth: '2025-01',
      notes: 'Pago via DAS',
      taxType: 'CSLL'
    },
    {
      title: 'PIS/COFINS - Janeiro 2025',
      description: 'PIS e COFINS sobre faturamento',
      category: 'PIS/COFINS',
      dueDate: '2025-02-15',
      amount: 950.00,
      status: 'pago',
      priority: 'media',
      frequency: 'mensal',
      referenceMonth: '2025-01',
      notes: 'Calculado sobre receita bruta',
      taxType: 'PIS'
    },
    {
      title: 'ISS - Janeiro 2025',
      description: 'Imposto sobre Serviços',
      category: 'ISS',
      dueDate: '2025-02-10',
      amount: 680.00,
      status: 'pago',
      priority: 'media',
      frequency: 'mensal',
      referenceMonth: '2025-01',
      notes: 'ISS municipal - 2% sobre serviços',
      taxType: 'ISS'
    },
    {
      title: 'IRPJ - Fevereiro 2025',
      description: 'Imposto de Renda Pessoa Jurídica',
      category: 'IRPJ',
      dueDate: '2025-02-28',
      amount: 3200.00,
      status: 'pendente',
      priority: 'alta',
      frequency: 'mensal',
      referenceMonth: '2025-02',
      notes: 'Vencimento último dia útil',
      taxType: 'IRPJ'
    },
    {
      title: 'CSLL - Fevereiro 2025',
      description: 'Contribuição Social sobre Lucro Líquido',
      category: 'CSLL',
      dueDate: '2025-02-28',
      amount: 1600.00,
      status: 'pendente',
      priority: 'alta',
      frequency: 'mensal',
      referenceMonth: '2025-02',
      notes: 'Vencimento último dia útil',
      taxType: 'CSLL'
    },
    {
      title: 'Simples Nacional - Março 2025',
      description: 'DAS Simples Nacional',
      category: 'Simples Nacional',
      dueDate: '2025-03-20',
      amount: 4500.00,
      status: 'pendente',
      priority: 'alta',
      frequency: 'mensal',
      referenceMonth: '2025-03',
      notes: 'Anexo III - Serviços',
      taxType: 'Simples Nacional'
    },
    {
      title: 'IRRF - Março 2025',
      description: 'Imposto de Renda Retido na Fonte',
      category: 'IRRF',
      dueDate: '2025-03-20',
      amount: 850.00,
      status: 'pendente',
      priority: 'media',
      frequency: 'mensal',
      referenceMonth: '2025-03',
      notes: 'Retenção sobre serviços prestados',
      taxType: 'IRRF'
    }
  ];
  
  for (const obligation of obligations) {
    try {
      const result = await makeRequest({
        hostname: 'localhost',
        port: 3001,
        path: '/api/tax-obligations',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }, obligation);
      
      if (result.status === 201) {
        console.log(`✅ Obrigação inserida: ${obligation.title} - R$ ${obligation.amount} (${obligation.status})`);
      } else {
        console.log(`❌ Falha ao inserir obrigação: ${obligation.title}`);
      }
    } catch (error) {
      console.log(`❌ Erro ao inserir obrigação ${obligation.title}: ${error.message}`);
    }
  }
}

async function getSummary(token) {
  console.log('\n📊 Resumo dos dados inseridos:');
  
  try {
    // Obter receitas
    const incomesResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/incomes',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const totalIncomes = incomesResult.data?.reduce((sum, income) => sum + parseFloat(income.amount), 0) || 0;
    console.log(`💰 Total de Receitas: R$ ${totalIncomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${incomesResult.data?.length || 0} itens)`);
    
    // Obter despesas
    const expensesResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/expenses',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const totalExpenses = expensesResult.data?.reduce((sum, expense) => sum + parseFloat(expense.amount), 0) || 0;
    console.log(`💸 Total de Despesas: R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${expensesResult.data?.length || 0} itens)`);
    
    // Obter obrigações tributárias
    const obligationsResult = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/api/tax-obligations',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const totalObligations = obligationsResult.data?.reduce((sum, obligation) => sum + parseFloat(obligation.amount), 0) || 0;
    console.log(`📋 Total de Obrigações: R$ ${totalObligations.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${obligationsResult.data?.length || 0} itens)`);
    
    const profit = totalIncomes - totalExpenses - totalObligations;
    console.log(`\n🎯 Resultado Líquido: R$ ${profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    
    // Separar obrigações por status
    if (obligationsResult.data) {
      const paid = obligationsResult.data.filter(o => o.status === 'pago');
      const pending = obligationsResult.data.filter(o => o.status === 'pendente');
      
      console.log(`   ✅ Obrigações Pagas: ${paid.length}`);
      console.log(`   ⏳ Obrigações Pendentes: ${pending.length}`);
    }
    
  } catch (error) {
    console.log(`❌ Erro ao obter resumo: ${error.message}`);
  }
}

async function populateItalosAccount() {
  try {
    const token = await login();
    
    await insertIncomes(token);
    await insertExpenses(token);
    await insertTaxObligations(token);
    
    await getSummary(token);
    
    console.log('\n🎉 Conta do italo populada com sucesso!');
    console.log('🌐 Agora você pode acessar o frontend em http://localhost:5173 para visualizar os gráficos!');
    
  } catch (error) {
    console.error('❌ Erro durante a população da conta:', error.message);
  }
}

populateItalosAccount();
