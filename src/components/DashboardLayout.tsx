import { ReactNode } from 'react';
import ResetProfileButton from './ResetProfileButton';

interface Props {
  children?: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 shadow-md">
        <h1 className="font-semibold">Dashboard</h1>
        <ResetProfileButton />
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}