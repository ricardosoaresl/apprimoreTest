interface Pessoa {
  cpfCnpj: string;
  codigo: string;
  nome: string;
}

interface Pagamento {
  nome: string;
  tipoPagamento: number;
  numeroParcelas: number;
}

interface Origem {
  origem: string;
  numero: string;
  infAdic: string;
}

interface Fatura {
  numeroFatura: string;
  historico: string;
  valorFatura: number;
  pagamentoParcial: boolean;
  pessoa: Pessoa;
  pagamento: Pagamento[] | null;
  origem: Origem[];
}

interface FaturaResponse {
  list: Fatura[];
  totalResults: number;
  totalPages: number;
  pageIndex: number;
  pageSize: number;
}
