import { useEffect, useState } from 'react';
import { dataFetcher } from '../../utils/helpers';
import styled from 'styled-components';
import { CurrencyMap } from '../../utils/interfaces';

function Table() {
  const [data, setData] = useState<CurrencyMap | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'quant' | 'index' | 'date' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'name' | 'value' | 'quant' | 'index' | 'date') => {
    if (sortBy === column) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: CurrencyMap = await dataFetcher('db.json');
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const headers = [
    { name: 'Currency', key: 'name' },
    { name: 'Price', key: 'value' },
    { name: 'Quantity', key: 'quant' },
    { name: 'Index', key: 'index' },
    { name: 'Date', key: 'date' },
  ];


  return (
    <TableContainer>
      <TableHeader>
        {headers.map(({key, name}) => (
          <TableCell
            key={key}
            onClick={() => handleSort(key as 'name' | 'value' | 'quant' | 'index' | 'date')}
            style={{ cursor: 'pointer' }}
          >
            {name}
            {sortBy === key && (
              <span>{sortDirection === 'asc' ? ' 🔼' : ' 🔽'}</span>
            )}
          </TableCell>
        ))}
      </TableHeader>
      {data && Object.keys(data).map((date) => {
        const currencies = Object.values(data[date]);

        const sorted = [...currencies].sort((a, b) => {
          if (!sortBy) return 0;

          const aVal = sortBy === 'value' || sortBy === 'quant'
            ? parseFloat(a[sortBy])
            : a[sortBy];
          const bVal = sortBy === 'value' || sortBy === 'quant'
            ? parseFloat(b[sortBy])
            : b[sortBy];

          if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });

        return (
          <div key={date}>
            {sorted.map((currency) => {
              const { currency: code, name, value, quant, index } = currency;
              return (
                <TableRow key={code}>
                  <TableCell $name={name}>{name}</TableCell>
                  <TableCell>{value}</TableCell>
                  <TableCell $quantValue={parseFloat(quant)}>{quant}</TableCell>
                  <TableCell $indexStatus={index}>{index}</TableCell>
                  <TableCell>{date}</TableCell>
                </TableRow>
              );
            })}
          </div>
        );
      })}
    </TableContainer>
  );
}

const TableContainer = styled.div`
  border: 1px solid #ccc;
  border-bottom: none;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 25px 20px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
  & > div {
    font-size: 1rem;
  }
`;

const TableRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #ccc;

  &:nth-child(odd) {
    background-color: #c2c2c2;
  }
`;

const TableCell = styled.div<{
  $name?: string,
  $quantValue?: number,
  $indexStatus?: string,
}>`
  flex: 1;
  text-align: ${props => props.$name ? 'left' : 'center'};
  font-size: .7rem;
  font-weight: 500;
  color: ${props => props.$quantValue !== undefined
    ? props.$quantValue < 5
      ? '#cb6161'
      : '#157213'
    : props.$indexStatus === 'DOWN'
      ? 'red'
      : props.$indexStatus
        ? '#cb6161'
        : '#4d4d4d'};
`;

export default Table;
