import {
  type Profile,
  useActiveProfile,
  useActiveWallet,
} from "@lens-protocol/react-web";
import { Framework, IStream } from "@superfluid-finance/sdk-core";
import { ethers, providers } from "ethers";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import {
  ALCHEMY_API_KEY,
  SUPERFLUID_TOKEN,
  SUPERFLUID_TOKEN_ADDRESS,
} from "@/lib/constants";
import { wagmiNetwork } from "@/lib/wagmi-client";

import SuperfluidWidget from "@superfluid-finance/widget";
import superTokenList from "@superfluid-finance/tokenlist";
import { getWalletClient } from "wagmi/actions";

const flowRate = "2";

export function SubscriptionActions({
  tba,
  profile,
  subscriptions,
}: {
  tba: `0x${string}`;
  profile: Profile;
  subscriptions: IStream[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: wallet } = useActiveWallet();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const { data: activeProfile } = useActiveProfile();

  const getSFContext = async () => {
    const client = await getWalletClient();

    const sf = await Framework.create({
      chainId: wagmiNetwork.id,
      provider: new providers.AlchemyProvider(wagmiNetwork.id, ALCHEMY_API_KEY),
    });

    const superSigner = sf.createSigner({ client });
    const daix = await sf.loadSuperToken(SUPERFLUID_TOKEN);

    return { superSigner, daix };
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

  const walletManager = useMemo(
    () => ({
      open: () => {
        console.log();
        alert("ello");
      },
      isOpen: false,
    }),
    []
  );

  return (
    <>
      {subscriptions.some(
        (subscription) =>
          subscription.currentFlowRate != "0" &&
          subscription.sender.toLowerCase() === wallet?.address.toLowerCase()
      ) && false ? (
        <button
          disabled={isLoading}
          onClick={deleteStream}
          className="btn-error btn-sm btn w-full normal-case"
        >
          Unsubscribe
        </button>
      ) : (
        <>
          {wallet || true ? (
            <SuperfluidWidget
              productDetails={{
                name: "m0saic",
                description: "Lens subscriptions",
                imageURI: "",
              }}
              paymentDetails={{
                paymentOptions: [
                  {
                    receiverAddress: tba,
                    superToken: {
                      address: SUPERFLUID_TOKEN_ADDRESS,
                    },
                    chainId: 80001,
                    flowRate: {
                      amountEther: "0", //flowRate,
                      period: "month",
                    },
                  },
                ],
              }}
              tokenList={superTokenList}
              type="drawer"
              walletManager={walletManager}
            >
              {({ openModal }) => (
                <button
                  // disabled={!wallet || profile.id === activeProfile?.id}
                  className="btn-primary btn-sm btn w-full normal-case"
                  onClick={() => openModal()}
                >
                  Subscribe
                </button>
              )}
            </SuperfluidWidget>
          ) : (
            <button
              disabled={true}
              className="btn-primary btn-sm btn w-full normal-case"
            >
              Connect to subscribe
            </button>
          )}
        </>
      )}
    </>
  );
}
