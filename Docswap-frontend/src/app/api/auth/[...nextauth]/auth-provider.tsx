'use client';

import { SessionProvider } from 'next-auth/react';
import React, { useEffect } from 'react';
import { setupInterceptors } from 'src/utils/interceptors/axios-interceptor';


export default function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}): React.ReactNode {
  useEffect(() => {
    setupInterceptors();
  }, []);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
