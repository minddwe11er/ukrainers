'use client';

import { createContext, useContext } from 'react';

type Messages = Record<string, any>;

const MessagesContext = createContext<Messages>({});
const LocaleContext = createContext<string>('uk');

export function LayoutProvider({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: Messages;
  locale: string;
}) {
  return (
    <MessagesContext.Provider value={messages}>
      <LocaleContext.Provider value={locale}>
        {children}
      </LocaleContext.Provider>
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  return useContext(MessagesContext);
}

export function useLocale() {
  return useContext(LocaleContext);
}
