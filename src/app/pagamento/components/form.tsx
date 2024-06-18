'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';

interface IForm {
  aplicationid: string;
  username: string;
}

export default function form({ aplicationid, username }: IForm) {
  const [formaPagamento, setFormaPagamento] = useState<string>('Crédito');
  const [cartaoNumero, setCartaoNumero] = useState<string>('');
  const [cartaoValidade, setCartaoValidade] = useState<string>('');
  const [cartaoCvv, setCartaoCvv] = useState<string>('');
  const [pixChave, setPixChave] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pedidos, setPedidos] = useState<FaturaResponse['list'] | null>(null);
  const [valorTotalFaturas, setValorTotalFaturas] = useState<number>(0);

  const searchParams = useSearchParams();

  const pedidosSelecionados = decodeURIComponent(searchParams.toString())
    .split('&')
    .map((param) => param.split('=')[1])
    .map((valor) => valor);

  // const handlePayment = async () => {
  //   setIsLoading(true);
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     const response = await fetch('/financeiro/retorno', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         numeroFatura: pedido.numeroFatura,
  //         formaPagamento,
  //         detalhesPagamento:
  //           formaPagamento === 'PIX'
  //             ? { pixChave }
  //             : { cartaoNumero, cartaoValidade, cartaoCvv },
  //       }),
  //     });

  //     if (response.ok) {
  //     //   onPaymentSuccess();
  //     } else {
  //     //   onPaymentFailure('Erro ao processar o pagamento');
  //     }
  //   } catch (error) {
  //     // onPaymentFailure('Erro ao processar o pagamento');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    async function getPedidos() {
      const url = new URL(
        'https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/financeiro/faturas',
      );

      const requestOptions = {
        method: 'GET',
        headers: {
          aplicacaoid: aplicationid,
          username: username,
        },
      };

      const response = await fetch(url, requestOptions);
      const data = (await response.json()) as FaturaResponse;
      const filterPedidos = data.list.filter((i) =>
        pedidosSelecionados.includes(i.numeroFatura),
      );
      setPedidos(filterPedidos);
    }

    getPedidos();
  }, []);

  useEffect(() => {
    const valorTotalFaturas = pedidos?.reduce((acumulador, pedido) => {
      return acumulador + pedido.valorFatura;
    }, 0);

    setValorTotalFaturas(valorTotalFaturas ?? 0);
  }, [pedidos]);

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <h2>Detalhes do Pedido</h2>
          <p>Número do Pedido: 767589</p>
          <p>Itens: {pedidosSelecionados.join(', ')}</p>
          <p>
            Total a Pagar:{' '}
            {valorTotalFaturas > 0
              ? valorTotalFaturas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })
              : ''}
          </p>
        </Paper>
      </Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Forma de Pagamento</FormLabel>
          <RadioGroup
            row
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
          >
            <FormControlLabel
              value="Crédito"
              control={<Radio />}
              label="Crédito"
            />
            <FormControlLabel
              value="Débito"
              control={<Radio />}
              label="Débito"
            />
            <FormControlLabel value="PIX" control={<Radio />} label="PIX" />
          </RadioGroup>
        </FormControl>
        {formaPagamento !== 'PIX' ? (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Número do Cartão"
                  value={cartaoNumero}
                  onChange={(e) => setCartaoNumero(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Data de Validade"
                  value={cartaoValidade}
                  onChange={(e) => setCartaoValidade(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Código de Segurança"
                  value={cartaoCvv}
                  onChange={(e) => setCartaoCvv(e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Chave PIX"
              value={pixChave}
              onChange={(e) => setPixChave(e.target.value)}
            />
          </Box>
        )}
      </Paper>
      <Button
        variant="contained"
        color="primary"
        // onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Pagar'}
      </Button>
    </div>
  );
}
