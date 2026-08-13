'use client';

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AdminPageHeaderData = {
  breadcrumb?: string;
  title: string;
  subtitle?: string;
};

type AdminChromeContextValue = {
  pageHeader: AdminPageHeaderData | null;
  setPageHeader: (header: AdminPageHeaderData | null) => void;
};

const AdminChromeContext = createContext<AdminChromeContextValue | null>(null);

export function AdminChromeProvider({ children }: { children: ReactNode }) {
  const [pageHeader, setPageHeader] = useState<AdminPageHeaderData | null>(null);
  const value = useMemo(
    () => ({ pageHeader, setPageHeader }),
    [pageHeader],
  );

  return (
    <AdminChromeContext.Provider value={value}>
      {children}
    </AdminChromeContext.Provider>
  );
}

export function useAdminChrome() {
  const ctx = useContext(AdminChromeContext);
  if (!ctx) {
    throw new Error('useAdminChrome must be used within AdminChromeProvider');
  }
  return ctx;
}

export function AdminPageHeader({
  breadcrumb,
  title,
  subtitle,
}: {
  breadcrumb?: string;
  title: string;
  subtitle?: string;
}) {
  const { setPageHeader } = useAdminChrome();

  useLayoutEffect(() => {
    setPageHeader({ breadcrumb, title, subtitle });
    return () => setPageHeader(null);
  }, [breadcrumb, title, subtitle, setPageHeader]);

  return null;
}
