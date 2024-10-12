import { type NextAuthOptions } from 'next-auth';
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import isEqual from 'lodash/isEqual';
import { pagesOptions } from './pages-options';

export const authOptions: NextAuthOptions = {
  pages: {
    ...pagesOptions,
  },
  debug: true,
  providers: [
    AzureADB2CProvider({
      tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
      clientId: process.env.AZURE_AD_B2C_CLIENT_ID || '',
      clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET || '',
      primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.emails[0],
          FirstName: profile.given_name,
          LastName: profile.family_name,
          // TODO: Find out how to retrieve the profile picture
          image: null,
          newUser: profile.newUser || false,
        }
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid
        const user = {
          email: 'admin@admin.com',
          password: 'admin',
        };

        if (
          isEqual(user, {
            email: credentials?.email,
            password: credentials?.password,
          })
        ) {
          return user as any;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600, // Session expires in 1 hour
  },
  events: {
    async signIn(message) {
      if (message.user.newUser === true) {
        console.log('creating new user in the database');
        console.log('message.user', message.user);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: message.user.name,
              externalUserID: message.user.id,
              authenticationType: 'Azure AD B2C',
              email: message.user.email,
              firstName: message.user.FirstName,
              lastName: message.user.LastName,
            }),
          });

          if (!response.ok) {
            console.log('response', response);
            throw new Error('Failed to create new user');
          }

          const result = await response.json();
          console.log('User created successfully:', result);
        } catch (error) {
          console.error('Error creating new user:', error);
        }
      }
    },
    async signOut(message) {
      console.log('signOut', message);
    },
    async createUser(message) {
      console.log('createUser', message);

    }
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        account: token
      };
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.id = account.id;
        token.account = account;
      }
      if (profile) {
        token.user = profile;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      const parsedUrl = new URL(url, baseUrl);
      if (parsedUrl.searchParams.has('callbackUrl')) {
        return `${baseUrl}${parsedUrl.searchParams.get('callbackUrl')}`;
      }
      if (parsedUrl.origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
};
