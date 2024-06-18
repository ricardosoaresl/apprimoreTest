import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Form from './components/form';

export default async function TelaPagamento() {
  const session = await getServerSession();

  if (!session) {
    redirect('/');
  }

  return (
    <Form aplicationid={session?.user?.email} username={session?.user?.name} />
  );
}
