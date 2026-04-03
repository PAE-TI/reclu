'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { LanguageProvider, Language } from '@/contexts/language-context';

function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession() || {};
  const userLanguage = session?.user?.language as Language | undefined;
  
  return (
    <LanguageProvider initialLanguage={userLanguage}>
      {children}
    </LanguageProvider>
  );
}

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <LanguageWrapper>
        {children}
      </LanguageWrapper>
    </SessionProvider>
  );
}
