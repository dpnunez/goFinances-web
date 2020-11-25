import React, { useState, useEffect } from 'react';
import moment from 'moment';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface TransactionInfo {
  balance: Balance;
  transactions: Transaction[];
}
interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const transactionsInfo = await api.get<TransactionInfo>('transactions');
      const {
        balance: balanceInfo,
        transactions: transactionList,
      } = transactionsInfo.data;

      setTransactions(transactionList);
      setBalance(balanceInfo);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        {balance && (
          <CardContainer>
            <Card>
              <header>
                <p>Entradas</p>
                <img src={income} alt="Income" />
              </header>
              <h1 data-testid="balance-income">
                {formatValue(balance.income)}
              </h1>
            </Card>
            <Card>
              <header>
                <p>Saídas</p>
                <img src={outcome} alt="Outcome" />
              </header>
              <h1 data-testid="balance-outcome">
                {formatValue(balance.outcome)}
              </h1>
            </Card>
            <Card total>
              <header>
                <p>Total</p>
                <img src={total} alt="Total" />
              </header>
              <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
            </Card>
          </CardContainer>
        )}

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {`${
                      transaction.type === 'outcome' ? '- ' : ''
                    }${formatValue(transaction.value)}`}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{moment(transaction.created_at).format('DD/MM/YYYY')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
