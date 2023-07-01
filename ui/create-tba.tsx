import { useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import {
  LENS_HUB_ADDRESS,
  SUPERFLUID_TOKEN,
  SUPERFLUID_TOKEN_ADDRESS,
} from "@/lib/constants";
import { TokenboundClient } from "@tokenbound/sdk";
import { wagmiNetwork } from "@/lib/wagmi-client";
import { Interface } from "ethers/lib/utils.js";
import { ethers } from "ethers";
import { Profile, useActiveProfile } from "@lens-protocol/react-web";

const iface = new Interface([
  "function transfer(address recipient, uint256 amount)",
]);

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
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const { data: balance } = useBalance({
    address: tba,
    token: SUPERFLUID_TOKEN_ADDRESS,
  });
  const { data: activeProfile } = useActiveProfile();

  const getSigner = async () => {
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
      return await connector.getSigner();
    }
    return undefined;
  };

  const deployTBA = async () => {
    setLoading(true);
    if (tokenId) {
      const signer = await getSigner();
      if (signer) {
        try {
          const tokenboundClient = new TokenboundClient({
            signer,
            chainId: wagmiNetwork.id,
          });
          const tx = await tokenboundClient.createAccount({
            tokenContract: LENS_HUB_ADDRESS,
            tokenId,
          });
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
    setLoading(false);
  };

  const withdrawBalance = async () => {
    setLoading(true);
    if (tokenId) {
      const signer = await getSigner();
      if (signer && balance) {
        try {
          const tokenboundClient = new TokenboundClient({
            signer,
            chainId: wagmiNetwork.id,
          });
          const calldata = iface.encodeFunctionData("transfer", [
            profile.ownedBy,
            ethers.utils.parseEther(balance.formatted),
          ]);
          const preparedCall = await tokenboundClient.prepareExecuteCall({
            account: tba,
            to: SUPERFLUID_TOKEN_ADDRESS,
            value: BigInt(0),
            data: calldata,
          });
          const tx = await signer.sendTransaction(preparedCall);
          await toast.promise(tx.wait(), {
            pending: "Transferring balance",
            success: "Balance tranferred",
            error: "Error transferring balance",
          });
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
              onClick={withdrawBalance}
              className="btn-primary btn-sm btn w-full normal-case"
            >
              {balance?.formatted &&
                `Withdraw ${Number.parseFloat(balance?.formatted).toFixed(
                  2
                )} ${SUPERFLUID_TOKEN}`}
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
