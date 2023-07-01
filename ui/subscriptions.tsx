import {
  Profile,
  useActiveProfile,
  useActiveWallet,
} from "@lens-protocol/react-web";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { Framework, IStream } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { SUPERFLUID_TOKEN } from "@/lib/constants";
import { wagmiClient, wagmiNetwork } from "@/lib/wagmi-client";

const daiMonth = "2";

export function Subscriptions({
  tba,
  profile,
  subscriptions,
}: {
  tba: `0x${string}`;
  profile: Profile;
  subscriptions: IStream[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [flowRate, setFlowRate] = useState(daiMonth);
  const { data: wallet } = useActiveWallet();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const { data: activeProfile } = useActiveProfile();

  const getSFContext = async () => {
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

      return { superSigner, daix };
    }
    return undefined;
  };

  const createStream = async () => {
    setIsLoading(true);
    const sfContext = await getSFContext();
    if (sfContext) {
      const { superSigner, daix } = sfContext;
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
          "Error creating stream: Make sure that you have enough Superfluid DAIx and that you don't have a stream already open with this profile"
        );
        console.error(error);
      }
    }
  };

  const deleteStream = async () => {
    setIsLoading(true);
    const sfContext = await getSFContext();
    if (sfContext) {
      const { superSigner, daix } = sfContext;
      try {
        const deleteFlowOperation = daix.deleteFlow({
          sender: await superSigner.getAddress(),
          receiver: tba,
        });

        await deleteFlowOperation.exec(superSigner);
        toast.success(
          "Stream deleted. It may take a few minutes until it's reflected in the dashboard"
        );
      } catch (error) {
        toast.error("Error deleting stream");
        console.error(error);
      }
    }
  };

  return (
    <>
      {subscriptions.filter(
        (subscription) =>
          subscription.currentFlowRate != "0" &&
          subscription.sender.toLowerCase() === wallet?.address.toLowerCase()
      ).length > 0 ? (
        <button
          disabled={isLoading}
          onClick={deleteStream}
          className="btn-error btn-sm btn normal-case w-full"
        >
          Unsubscribe
        </button>
      ) : (
        <button
          disabled={!wallet || isLoading || profile.id === activeProfile?.id}
          onClick={createStream}
          className="btn-primary btn-sm btn normal-case w-full"
        >
          {wallet ? `🌟 ${daiMonth} DAI / month` : "Connect to subscribe"}
        </button>
      )}
    </>
  );
}
