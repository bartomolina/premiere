import {
  type Profile,
  useActiveProfile,
  useActiveWallet,
} from "@lens-protocol/react-web";
import { Framework, IStream } from "@superfluid-finance/sdk-core";
import superTokenList from "@superfluid-finance/tokenlist";
import SuperfluidWidget from "@superfluid-finance/widget";
import { providers } from "ethers";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
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
import { getAvatar } from "@/lib/get-avatar";
import { wagmiNetwork } from "@/lib/wagmi-client";

const provider = new providers.AlchemyProvider(
  wagmiNetwork.id,
  ALCHEMY_API_KEY
);

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
  const [flowRate, setFlowRate] = useState<`${number}`>("2");
  const { data: wallet } = useActiveWallet();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const { data: activeProfile } = useActiveProfile();
  const { theme } = useTheme();

  const deleteStream = async () => {
    setIsLoading(true);

    const sf = await Framework.create({
      chainId: wagmiNetwork.id,
      provider,
    });

    if (window.ethereum) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await window.ethereum.enable();
      const provider = new providers.Web3Provider(
        window.ethereum as providers.ExternalProvider
      );

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const superSigner = sf.createSigner({ web3Provider: provider });
      const daix = await sf.loadSuperToken(SUPERFLUID_TOKEN);

      if (superSigner && daix) {
        try {
          const deleteFlowOperation = daix.deleteFlow({
            sender: await superSigner.getAddress(),
            receiver: tba,
          });

          await deleteFlowOperation.exec(superSigner);
          toast.success(
            "Unsubscribed. It may take a few minutes until it's reflected in the dashboard"
          );
        } catch (error) {
          toast.error("Error cancelling the subscription");
          console.error(error);
        }
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

  const subscribed = useMemo(() => {
    return subscriptions.some(
      (subscription) =>
        subscription.currentFlowRate != "0" &&
        subscription.sender.toLowerCase() === wallet?.address.toLowerCase()
    );
  }, [subscriptions, wallet?.address]);

  return (
    <>
      {wallet ? (
        <SuperfluidWidget
          productDetails={{
            name: `${profile.name} (${profile.handle})`,
            description: "Lens subscriptions",
            imageURI: getAvatar(profile),
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
                  amountEther: flowRate.length > 0 ? flowRate : "0",
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
                  theme === "light" ? LIGHT_THEME_PRIMARY : DARK_THEME_PRIMARY,
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
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center gap-2">
                <label htmlFor="flowRate" className="hidden">
                  Flow rate
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  size={3}
                  value={flowRate}
                  onChange={(_event) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (!Number.isNaN(_event.target.value)) {
                      setFlowRate(_event.target.value as `${number}`);
                    }
                  }}
                  id="flowRate"
                  className="input-bordered input-primary input input-sm focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-primary"
                />{" "}
                {SUPERFLUID_TOKEN} / mo.
              </div>
              <div>
                <button
                  disabled={profile.id === activeProfile?.id}
                  onClick={() => sfModal(openModal)}
                  className="btn-primary btn-sm btn w-full normal-case"
                >
                  {subscribed ? "Update" : "Subscribe"}
                </button>
              </div>
            </div>
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

      {subscribed && (
        <button
          disabled={isLoading}
          onClick={deleteStream}
          className="btn-error btn-sm btn w-full normal-case"
        >
          Unsubscribe
        </button>
      )}
    </>
  );
}
