import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { Client } from "./client";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "App",
  description: "App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⬛️</text></svg>"
        ></link>
      </head>
      <body className={inter.className}>
        <Providers>
          <Client dashboard={false}>{children}</Client>
        </Providers>
      </body>
    </html>
  );
}
