import { createAccount } from "@tokenbound/sdk-ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { LENS_HUB_ADDRESS } from "@/lib/constants";

export function CreateTba({
  tbaDeployed,
  tokenId,
  accountCreated,
}: {
  tbaDeployed: boolean;
  tokenId: string | undefined;
  accountCreated: () => void;
}) {
  const [creatingAccount, setCreatingAccount] = useState(false);
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();

  const deployTBA = async () => {
    setCreatingAccount(true);
    if (tokenId) {
      if (isConnected) {
        await disconnectAsync();
      }
      let connector;
      try {
        ({ connector } = await connectAsync());
      } catch (error) {
        toast.error("Error connecting to wallet");
        console.error(error);
      }

      if (connector instanceof InjectedConnector) {
        const signer = await connector.getSigner();
        try {
          const tx = await createAccount(LENS_HUB_ADDRESS, tokenId, signer);
          await toast.promise(tx.wait(), {
            pending: "Creating account",
            success: "Account created",
            error: "Error creating account",
          });
          accountCreated();
        } catch (error) {
          toast.error("Error creating account");
          console.error(error);
        }
      }
    }
    setCreatingAccount(false);
  };

  return (
    <button
      disabled={tbaDeployed || !tokenId || creatingAccount}
      onClick={deployTBA}
      className="btn-primary btn-sm btn w-full normal-case"
    >
      {tbaDeployed ? "Already deployed" : "Deploy account"}
    </button>
  );
}
