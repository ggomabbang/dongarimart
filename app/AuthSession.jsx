'use client';
import { SessionProvider, getSession } from "next-auth/react";

export default function AuthSession({ children }) {
  const refresh = 10 * 60;
  return (
  <SessionProvider
    refetchInterval={refresh}
    refetchOnWindowFocus={true}
  >
    {children}
  </SessionProvider>
  )
}