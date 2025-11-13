"use client";

import { Droplets, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/login');
  };

  return (
    <header className="px-4 sm:px-6 lg:px-8 py-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Droplets className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight font-headline">
          AquaControl IoT
        </h1>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </header>
  );
}
