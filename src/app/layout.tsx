// src/components/RootLayout.tsx
import React from "react";
import "./globals.css"; // Ensure global styles are applied
import { Toaster } from "@/components/ui/toaster"; // Adjust the import path as necessary

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="font-body antialiased">
      {children}
      <Toaster />
    </main>
  );
};

export default RootLayout;
