import { useActiveWallet } from "@lens-protocol/react-web";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { SUPERFLUID_TOKEN } from "@/lib/constants";
import { wagmiClient, wagmiNetwork } from "@/lib/wagmi-client";

export function CreateStream({ tba }: { tba: `0x${string}` }) {
  const [isLoading, setIsLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("5");
  const { data: wallet } = useActiveWallet();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();

  const createStream = async () => {
    setIsLoading(true);
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

      const sf = await Framework.create({
        chainId: wagmiNetwork.id,
        provider: wagmiClient.provider,
      });

      const superSigner = sf.createSigner({ signer });
      const daix = await sf.loadSuperToken(SUPERFLUID_TOKEN);

      try {
        const createFlowOperation = daix.createFlow({
          sender: await superSigner.getAddress(),
          receiver: tba,
          flowRate: ethers.utils
            .parseEther(
              (Number.parseInt(flowRate) / (60 * 60 * 24 * 30))
                .toFixed(18)
                .toString()
            )
            .toString(),
        });

        await createFlowOperation.exec(superSigner);
        toast.success(
          "Stream created. It may take a few minutes until it's reflected in the dashboard"
        );
      } catch (error) {
        toast.error(
          "Error creating stream: Ensure that you have enough Superfluid DAIx and that you don't have a stream already open with this profile"
        );
        console.error(error);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <a
        className="flex items-center gap-1 text-gray-500 hover:underline"
        href={
          "https://codesandbox.io/s/daix-faucet-tr228g?file=/src/GetTokens.js"
        }
        target="_blank"
        rel="noreferrer noopener"
      >
        DAIx Faucet
        <ArrowSquareOut />
      </a>
      <input
        type="text"
        placeholder="Flow rate"
        value={flowRate}
        onChange={(event_) => setFlowRate(event_.target.value)}
        className="input-bordered input-primary input input-sm w-11 focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
      />
      DAI / month
      <button
        disabled={!wallet || isLoading}
        onClick={createStream}
        className="btn-primary btn-sm btn normal-case"
      >
        {wallet ? "New stream" : "Connect account"}
      </button>
    </>
  );
}
