"use client";

import { useActiveProfile, useActiveWallet } from "@lens-protocol/react-web";

export default function Home() {
  const { data: profile } = useActiveProfile();
  const { data: wallet } = useActiveWallet();

  return <div>Content</div>;
}
