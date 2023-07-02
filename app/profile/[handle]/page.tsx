"use client";

import { useProfile } from "@lens-protocol/react-web";
import { Framework, IStream } from "@superfluid-finance/sdk-core";
import { TokenboundClient } from "@tokenbound/sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import {
  ALCHEMY_API_KEY,
  HANDLE_SUFFIX,
  LENS_HUB_ADDRESS,
  ZERO_ADDRESS,
} from "@/lib/constants";
import { wagmiNetwork } from "@/lib/wagmi-client";
import { ProfileDetails } from "@/ui/profile-details";
import { Publications } from "@/ui/publications";
import { Subscribers } from "@/ui/subscribers";
import { providers } from "ethers";
import { getWalletClient } from "wagmi/actions";

export default function Page({ params }: { params: { handle: string } }) {
  const [tba, setTba] = useState<`0x${string}`>(ZERO_ADDRESS);
  const [subscriptions, setSubscriptions] = useState<IStream[]>([]);
  const [tbaDeployed, setTbaDeployed] = useState(true);
  const { data: profile, loading: profileLoading } = useProfile({
    handle: `${params.handle}${HANDLE_SUFFIX}`,
  });
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const provider = useMemo(
    () => new providers.AlchemyProvider(wagmiNetwork.id, ALCHEMY_API_KEY),
    []
  );

  const tokenId = useMemo(() => {
    return profile?.id ? Number.parseInt(profile.id, 16).toString() : undefined;
  }, [profile]);

  const fetchStreams = useCallback(async () => {
    const sf = await Framework.create({
      chainId: wagmiNetwork.id,
      provider,
    });

    const pageResult = await sf.query.listStreams(
      { receiver: tba },
      { take: 100 },
      {
        orderBy: "createdAtBlockNumber",
        orderDirection: "desc",
      }
    );

    if (pageResult && pageResult.data) {
      setSubscriptions(pageResult.data);
    }
  }, [tba]);

  const fetchTBAAddress = useCallback(async () => {
    if (tokenId && provider) {
      const client = await getWalletClient();
      const tokenboundClient = new TokenboundClient({
        client,
        chainId: wagmiNetwork.id,
      });
      const address = tokenboundClient.getAccount({
        tokenContract: LENS_HUB_ADDRESS,
        tokenId,
      });
      setTba(address);
      const code = await provider.getCode(address);
      if (code === "0x") {
        setTbaDeployed(false);
      } else {
        setTbaDeployed(true);
      }
    }
  }, [tokenId, provider]);

  useEffect(() => {
    fetchTBAAddress();
    fetchStreams();
  }, [tokenId, fetchTBAAddress, fetchStreams, tba]);

  const accountCreated = () => {
    fetchTBAAddress();
  };

  if (profileLoading || !profile) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  return (
    <div className="space-y-3 md:grid md:grid-cols-5 md:gap-7 md:space-y-0">
      <ProfileDetails
        profile={profile}
        tba={tba}
        tbaDeployed={tbaDeployed}
        tokenId={tokenId}
        subscriptions={subscriptions}
        accountCreated={accountCreated}
      />
      <div className="md:col-span-3">
        <div className="md:space-y-5">
          <Publications profileId={profile.id} tba={tba} />
        </div>
      </div>
      <div className="">
        <Subscribers subscriptions={subscriptions} tba={tba} />
      </div>
    </div>
  );
}
