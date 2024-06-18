import NextAuth, { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'usuario', type: 'text', placeholder: 'saurus' },
        password: { label: 'senha', type: 'password' },
        aplicacaoId: { label: 'aplicacao', type: 'select' },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        const params = {
          aplicacaoId: credentials.aplicacaoId.trim(),
          usuario: credentials.username.trim(),
          senha: credentials.password.trim(),
        };
        const requestOptions = {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json-patch+json',
          },
          body: JSON.stringify(params),
        };

        const response = await fetch(
          'https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/auth/',
          requestOptions,
        );

        if (response.ok) {
          const data = await response.json();

          return {
            id: '1',
            name: data.credenciais[0].username,
            email: data.credenciais[0].aplicacaoid, //TODO: need to be returned on the jwt
            image: '',
          };
        }

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
