import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.min.css";

import { providers } from "ethers";
import { Inter } from "next/font/google";
import { type WindowProvider } from "wagmi";

import { Client } from "./client";
import { Providers } from "./providers";

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider | WindowProvider;
  }
}

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Premiere",
  description: "Premiere",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Client>
            <div className="py-5">{children}</div>
          </Client>
        </Providers>
      </body>
    </html>
  );
}
