import { type Profile, useActiveProfile } from "@lens-protocol/react-web";
import { TokenboundClient } from "@tokenbound/sdk";
import { InjectedConnector, waitForTransaction } from "@wagmi/core";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { createWalletClient, custom, encodeFunctionData, http } from "viem";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  type WindowProvider,
} from "wagmi";

import {
  LENS_HUB_ADDRESS,
  SUPERFLUID_TOKEN,
  SUPERFLUID_TOKEN_ADDRESS,
  WALLET_NETWORK,
} from "@/lib/constants";

const transferAbi = {
  inputs: [
    { name: "recipient", type: "address" },
    { name: "amount", type: "uint256" },
  ],
  name: "transfer",
  outputs: [{ name: "", type: "bool" }],
  stateMutability: "nonpayable",
  type: "function",
};

export function CreateTba({
  tbaDeployed,
  tba,
  profile,
  tokenId,
  accountCreated,
}: {
  tbaDeployed: boolean;
  tba: `0x${string}`;
  profile: Profile;
  tokenId: string | undefined;
  accountCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [balanceTransferred, setBalanceTransferred] = useState(false);
  const { data: balance } = useBalance({
    address: tba,
    token: SUPERFLUID_TOKEN_ADDRESS,
  });
  const { data: activeProfile } = useActiveProfile();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();

  const ensureConnection = useCallback(async () => {
    if (isConnected) {
      await disconnectAsync();
    }
    try {
      const connection = await connectAsync();

      const walletClient = createWalletClient({
        chain: WALLET_NETWORK,
        account: connection?.account,
        transport: window.ethereum
          ? custom(window.ethereum as WindowProvider)
          : http(),
      });

      return {
        walletClient,
        tokenboundClient: new TokenboundClient({
          walletClient,
          chainId: walletClient.chain.id,
        }),
      };
    } catch (error) {
      toast.error("Error connecting to wallet");
      console.error(error);
    }
    return {};
  }, []);

  const deployTBA = async () => {
    setLoading(true);
    if (tokenId) {
      const { tokenboundClient } = await ensureConnection();
      if (tokenboundClient) {
        try {
          const hash = await tokenboundClient.createAccount({
            tokenContract: LENS_HUB_ADDRESS,
            tokenId,
          });

          await toast.promise(waitForTransaction({ hash }), {
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
    setLoading(false);
  };

  const withdrawBalance = async () => {
    setLoading(true);
    if (balance) {
      const { walletClient, tokenboundClient } = await ensureConnection();
      if (walletClient && tokenboundClient) {
        try {
          const calldata = encodeFunctionData({
            abi: [transferAbi],
            functionName: "transfer",
            args: [profile.ownedBy, ethers.utils.parseEther(balance.formatted)],
          });

          const preparedCall = await tokenboundClient.prepareExecuteCall({
            account: tba,
            to: SUPERFLUID_TOKEN_ADDRESS,
            value: BigInt(0),
            data: calldata,
          });

          const hash = await walletClient.sendTransaction(preparedCall);

          await toast.promise(waitForTransaction({ hash }), {
            pending: "Transferring balance",
            success: "Balance tranferred",
            error: "Error transferring balance",
          });
          setBalanceTransferred(true);
        } catch (error) {
          toast.error("Error transferring balance");
          console.error(error);
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      {tbaDeployed ? (
        <>
          {profile.id === activeProfile?.id && (
            <button
              disabled={balance?.value === BigInt(0) || balanceTransferred}
              onClick={withdrawBalance}
              className="btn-primary btn-sm btn w-full normal-case"
            >
              💰{" "}
              {balanceTransferred
                ? "0.00"
                : balance?.formatted &&
                  `${Number.parseFloat(balance?.formatted).toFixed(2)}`}{" "}
              ${SUPERFLUID_TOKEN}
            </button>
          )}
        </>
      ) : (
        <button
          disabled={tbaDeployed || !tokenId || loading}
          onClick={deployTBA}
          className="btn-primary btn-sm btn w-full normal-case"
        >
          Deploy account
        </button>
      )}
    </>
  );
}
