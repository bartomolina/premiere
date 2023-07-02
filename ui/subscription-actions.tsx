import {
  type Profile,
  useActiveProfile,
  useActiveWallet,
} from "@lens-protocol/react-web";
import { Framework, IStream } from "@superfluid-finance/sdk-core";
import superTokenList from "@superfluid-finance/tokenlist";
import SuperfluidWidget from "@superfluid-finance/widget";
import { getWalletClient } from "@wagmi/core";
import { providers } from "ethers";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import {
  ALCHEMY_API_KEY,
  DARK_THEME_PRIMARY,
  DARK_THEME_SECONDARY,
  LIGHT_THEME_PRIMARY,
  LIGHT_THEME_SECONDARY,
  SUPERFLUID_TOKEN,
  SUPERFLUID_TOKEN_ADDRESS,
} from "@/lib/constants";
import { wagmiNetwork } from "@/lib/wagmi-client";

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
  const { theme } = useTheme();

  const getSFContext = async () => {
    const client = await getWalletClient();

    const sf = await Framework.create({
      chainId: wagmiNetwork.id,
      provider: new providers.AlchemyProvider(wagmiNetwork.id, ALCHEMY_API_KEY),
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const superSigner = sf.createSigner({ client });
    const daix = await sf.loadSuperToken(SUPERFLUID_TOKEN);

    return { superSigner, daix };
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

  const sfModal = async (openModal: () => void) => {
    if (isConnected) {
      await disconnectAsync();
    }
    try {
      await connectAsync();
    } catch (error) {
      toast.error("Error connecting to wallet");
      console.error(error);
    }

    openModal();
  };

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
                imageURI: "https://testnet.m0saic.xyz/logo_small.png",
              }}
              paymentDetails={{
                paymentOptions: [
                  {
                    receiverAddress: tba,
                    superToken: {
                      address: SUPERFLUID_TOKEN_ADDRESS,
                    },
                    chainId: wagmiNetwork.id,
                    flowRate: {
                      amountEther: flowRate,
                      period: "month",
                    },
                  },
                ],
              }}
              tokenList={superTokenList}
              type="drawer"
              theme={{
                palette: {
                  mode: theme === "light" ? "light" : "dark",
                  primary: {
                    main:
                      theme === "light"
                        ? LIGHT_THEME_PRIMARY
                        : DARK_THEME_PRIMARY,
                  },
                  secondary: {
                    main:
                      theme === "light"
                        ? LIGHT_THEME_SECONDARY
                        : DARK_THEME_SECONDARY,
                  },
                },
              }}
              walletManager={{
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                open: () => {},
                isOpen: false,
              }}
            >
              {({ openModal }) => (
                <button
                  disabled={!wallet || profile.id === activeProfile?.id}
                  className="btn-primary btn-sm btn w-full normal-case"
                  onClick={() => sfModal(openModal)}
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
