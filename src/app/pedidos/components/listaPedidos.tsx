'use client';

import React, { use, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

const ordersData = [
  {
    id: 1,
    number: 'ORD-001',
    description: 'Order 1 description',
    amount: 100.0,
  },
  {
    id: 2,
    number: 'ORD-002',
    description: 'Order 2 description',
    amount: 150.0,
  },
  {
    id: 3,
    number: 'ORD-003',
    description: 'Order 3 description',
    amount: 200.0,
  },
];

interface IListaPedidos {
  aplicationid: string;
  username: string;
}
export default function ListaPedidos({
  aplicationid,
  username,
}: IListaPedidos) {
  const [pedidos, setPedidos] = React.useState<FaturaResponse | null>(null);
  const [pedidosSelecionados, setPedidosSelecionados] = React.useState<
    string[]
  >([]);

  const [searchCpfCnpj, setSearchCpfCnpj] = React.useState<string>('');

  const handleSelectOrder = (orderId: string) => {
    if (pedidosSelecionados.includes(orderId)) {
      setPedidosSelecionados(
        pedidosSelecionados.filter((id) => id !== orderId),
      );
    } else {
      setPedidosSelecionados([...pedidosSelecionados, orderId]);
    }
  };

  const handlePayOrders = () => {
    // Logic to pay selected orders
    console.log('Selected Orders:', pedidosSelecionados);
    // Reset selected orders
    // setPedidosSelecionados([]);
  };

  const params = useMemo(() => {
    return {
      CpfCnpj: searchCpfCnpj,
    };
  }, [searchCpfCnpj]);

  useEffect(() => {
    async function getPedidos() {
      const url = new URL(
        'https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/financeiro/faturas',
      );

      if (searchCpfCnpj) {
        //TODO: backend is not working with query params, you can check on the swagger
        url.searchParams.append('CpfCnpj', searchCpfCnpj);
      }

      const requestOptions = {
        method: 'GET',
        headers: {
          aplicacaoid: aplicationid,
          username: username,
        },
      };

      const response = await fetch(url, requestOptions);
      const data = (await response.json()) as FaturaResponse;
      console.log({ data });
      setPedidos(data);
    }

    getPedidos();
  }, [searchCpfCnpj]);

  return (
    <div>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="filter-cnpj"
              label="CNPJ do Cliente"
              variant="outlined"
              onChange={(e) => {
                setSearchCpfCnpj(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="filter-name"
              label="Nome do Cliente"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="filter-code"
              label="Código do Pedido"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Selecionar</TableCell>
              <TableCell>Número do Pedido</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Valor do Pedido</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!pedidos ? (
              <></> //add loading
            ) : (
              <>
                {pedidos.list.map((pedido) => (
                  <TableRow key={pedido.numeroFatura}>
                    <TableCell>
                      <Checkbox
                        checked={pedidosSelecionados.includes(
                          pedido.numeroFatura,
                        )}
                        onChange={() => handleSelectOrder(pedido.numeroFatura)}
                      />
                    </TableCell>
                    <TableCell>{pedido.numeroFatura}</TableCell>
                    <TableCell>{pedido.pessoa.nome}</TableCell>
                    <TableCell>
                      {pedido.valorFatura.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePayOrders}
          disabled={pedidosSelecionados.length === 0}
        >
          Pagar Pedidos Selecionados
        </Button>
      </Box>
    </div>
  );
}
