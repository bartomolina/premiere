import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.min.css";

import { Inter } from "next/font/google";

import { ProfileSearch } from "@/ui/profile-search";

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
            <ProfileSearch />
            <div className="py-10">{children}</div>
          </Client>
        </Providers>
      </body>
    </html>
  );
}
