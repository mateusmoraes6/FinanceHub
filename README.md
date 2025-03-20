# FinançasVis - Controle Financeiro Pessoal

![FinançasVis](https://via.placeholder.com/800x400?text=Finan%C3%A7asVis)

## 📋 Sobre o Projeto

FinançasVis é uma aplicação web moderna de controle financeiro pessoal que permite aos usuários gerenciar suas finanças de forma intuitiva e visual. Desenvolvida com React, TypeScript e Tailwind CSS, a aplicação oferece uma interface responsiva e amigável para o controle de transações financeiras.

## ✨ Funcionalidades

- **Dashboard Visual:** Visualização rápida do saldo atual, receitas, despesas e investimentos.
- **Gerenciamento de Transações:** Adicione, edite e exclua transações financeiras.
- **Categorização:** Organize suas transações por categorias personalizáveis.
- **Tipos de Transações:** Suporte para receitas, despesas e investimentos.
- **Gráficos e Análises:** Visualize suas finanças através de gráficos interativos.
- **Interface Responsiva:** Design adaptável para dispositivos móveis e desktop.

## 🚀 Tecnologias Utilizadas

- **React:** Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript:** Superconjunto tipado de JavaScript
- **Tailwind CSS:** Framework CSS utilitário para design rápido
- **Vite:** Build tool e servidor de desenvolvimento
- **Recharts:** Biblioteca de gráficos para React
- **Lucide React:** Ícones modernos e personalizáveis

## 🔧 Instalação e Uso

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/financasvis.git
cd financasvis
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse a aplicação em seu navegador:
```
http://localhost:5173
```

## 📦 Estrutura do Projeto

```
src/
├── components/         # Componentes React reutilizáveis
│   ├── BalanceCard.tsx       # Cartão de saldo/receita/despesa
│   ├── CategoryBadge.tsx     # Badge para categorias
│   ├── TransactionChart.tsx  # Gráficos para visualização
│   ├── TransactionForm.tsx   # Formulário de transações
│   └── TransactionList.tsx   # Lista de transações
├── types/              # Definições de tipos TypeScript
│   └── finance.ts      # Tipos relacionados às finanças
├── App.tsx             # Componente principal
├── main.tsx            # Ponto de entrada da aplicação
└── index.css           # Estilos globais
```

## 🧩 Principais Componentes

### BalanceCard
Exibe cartões com informações de saldo, receitas, despesas e investimentos.

### TransactionForm
Formulário para adicionar ou editar transações, com suporte para categorias personalizadas.

### TransactionList
Lista todas as transações com opções para filtrar, editar e excluir.

### TransactionChart
Componente de visualização gráfica para análise de dados financeiros.

## 📊 Modelo de Dados

### Transaction
- `id`: Identificador único
- `amount`: Valor da transação
- `type`: Tipo (receita, despesa ou investimento)
- `category`: Categoria da transação
- `description`: Descrição detalhada
- `date`: Data da transação

### Category
- `id`: Identificador único
- `name`: Nome da categoria
- `type`: Tipo associado (receita, despesa ou investimento)
- `color`: Cor para representação visual

## 🔄 Fluxo de Trabalho

1. Visualize seu resumo financeiro no dashboard
2. Adicione novas transações com o botão "Nova Transação"
3. Visualize, edite ou exclua transações na lista
4. Analise seus padrões financeiros através dos gráficos

## 🛠️ Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria a versão otimizada para produção
- `npm run preview`: Visualiza a versão de produção localmente
- `npm run lint`: Executa a verificação de código com ESLint

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

Desenvolvido com ❤️ como uma ferramenta para facilitar o controle financeiro pessoal. 