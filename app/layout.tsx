import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.min.css";

import { Inter } from "next/font/google";

import { Client } from "./client";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "m0saic",
  description: "m0saic",
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
          <Client dashboard={false}>
            <div className="py-5">{children}</div>
          </Client>
        </Providers>
      </body>
    </html>
  );
}
