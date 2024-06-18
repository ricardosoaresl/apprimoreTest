import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import ListaPedidos from './components/listaPedidos';

export default async function Pedidos() {
  const session = await getServerSession();

  if (!session) {
    redirect('/');
  }

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom color="primary.main">
          Pedidos Pendentes {session?.user?.name}
        </Typography>
        <ListaPedidos
          aplicationid={session?.user?.email}
          username={session?.user?.name}
        />
      </Box>
    </Container>
  );
}
