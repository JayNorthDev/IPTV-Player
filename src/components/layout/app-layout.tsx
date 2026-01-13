'use client';

export function AppLayout({ children }: { children: React.ReactNode }) {
  // This component is now a simple wrapper. The complex sidebar logic is handled in page.tsx.
  return (
    <>
      {children}
    </>
  );
}
