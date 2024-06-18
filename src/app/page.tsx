'use client';
import React, { FormEvent, use, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import Link from '@mui/material/Link';

import theme from '@/styles/theme';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { MenuItem, Select } from '@mui/material';

interface IAplicacoes {
  id: string;
  erp: string;
  nomeReferencia: string;
  consultaPadrao: string;
  consultaPadraoLabel: string;
  consultaInicial: boolean;
  sincronizacaoBackground: boolean;
}

export default function Home() {
  const [aplicacoes, setAplicacoes] = useState<IAplicacoes[]>([]);
  const [aplicacao, setAplicacao] = useState<string>('');
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    signIn('credentials', {
      username: data.get('usuario') as string,
      password: data.get('password') as string,
      aplicacaoId: data.get('aplicacaoId') as string,
      callbackUrl: '/pedidos',
    });
  };

  useEffect(() => {
    if (aplicacoes.length > 0) return;

    async function getAplicacoes() {
      const response = await fetch(
        'https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/aplicacoes',
      );
      const data = (await response.json()) as IAplicacoes[];
      setAplicacoes(data);
    }

    getAplicacoes();
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Select
              style={{ width: '100%' }}
              labelId="aplicacao"
              id="aplicacaoId"
              value={aplicacao}
              label="Aplicacao"
              name="aplicacaoId"
              onChange={(event) => {
                setAplicacao(event.target.value);
              }}
            >
              {aplicacoes.map((aplicacao) => (
                <MenuItem key={aplicacao.id} value={aplicacao.id}>
                  {aplicacao.nomeReferencia}
                </MenuItem>
              ))}
            </Select>
            <TextField
              margin="normal"
              required
              fullWidth
              id="usuario"
              label="Usuario"
              name="usuario"
              autoFocus
              value="saurus"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value="123"
            />

            {error === 'CredentialsSignin' && (
              <Typography variant="body2" color="error">
                Usuario ou senha incorretos
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
