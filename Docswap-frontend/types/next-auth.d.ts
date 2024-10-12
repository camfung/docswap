import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    account: {
      account: {
        id_token: string;
      };

    };
    user: {
      id: string;
      newUser: boolean;
      FirstName: string;
      LastName: string;
    } & DefaultSession['user'];
  }
  export interface User extends DefaultUser {
    /** Define any user-specific variables here to make them available to other code inferences */
    newUser: boolean;
    FirstName: string;
    LastName: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
  }
}

declare module 'next-auth/'
