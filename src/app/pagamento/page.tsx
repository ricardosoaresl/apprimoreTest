'use client';

import React, { useState } from 'react';
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

interface IDetalhesPedido {
  numeroFatura: string;
  itens: string[];
  valorFatura: number;
}

interface ITelaPagamentoProps {
  pedido: IDetalhesPedido;
  onPaymentSuccess: () => void;
  onPaymentFailure: (error: string) => void;
}

export default function TelaPagamento({
  pedido,
  onPaymentSuccess,
  onPaymentFailure,
}: ITelaPagamentoProps) {
  const [formaPagamento, setFormaPagamento] = useState<string>('Crédito');
  const [cartaoNumero, setCartaoNumero] = useState<string>('');
  const [cartaoValidade, setCartaoValidade] = useState<string>('');
  const [cartaoCvv, setCartaoCvv] = useState<string>('');
  const [pixChave, setPixChave] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Mock payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Send payment details to the API
      const response = await fetch('/financeiro/retorno', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numeroFatura: pedido.numeroFatura,
          formaPagamento,
          detalhesPagamento:
            formaPagamento === 'PIX'
              ? { pixChave }
              : { cartaoNumero, cartaoValidade, cartaoCvv },
        }),
      });

      if (response.ok) {
        onPaymentSuccess();
      } else {
        onPaymentFailure('Erro ao processar o pagamento');
      }
    } catch (error) {
      onPaymentFailure('Erro ao processar o pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <h2>Detalhes do Pedido</h2>
        <p>Número do Pedido: {123232}</p>
        {/* <p>Itens: {pedido.itens.join(', ')}</p> */}
        <p>Itens: </p>
        <p>
          Total a Pagar:{' '}
          {/* {pedido.valorFatura.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })} */}
        </p>
      </Paper>
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
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Pagar'}
      </Button>
    </Box>
  );
}
