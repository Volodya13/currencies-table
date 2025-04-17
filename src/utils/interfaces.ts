interface CurrencyData {
  name: string;
  currency: string;
  date: string;
  logo: string | null;
  quant: string;
  index: 'DOWN' | 'UP' | 'STABLE';
  delta: string;
  value: string;
  sort: string;
}

interface DateCurrencyMap {
  [currencyCode: string]: CurrencyData;
}

interface CurrencyMap {
  [date: string]: DateCurrencyMap;
}

export type { CurrencyData, DateCurrencyMap, CurrencyMap };
