"use client";

import { useActiveProfile, useProfile } from "@lens-protocol/react-web";
import { Framework, IStream } from "@superfluid-finance/sdk-core";
import { TokenboundClient } from "@tokenbound/sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useConnect, useDisconnect, useProvider } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { HANDLE_SUFFIX, LENS_HUB_ADDRESS, ZERO_ADDRESS } from "@/lib/constants";
import { wagmiClient, wagmiNetwork } from "@/lib/wagmi-client";
import { CreatePost } from "@/ui/create-post";
import { ProfileDetails } from "@/ui/profile-details";
import { Publications } from "@/ui/publications";
import { Subscribers } from "@/ui/subscribers";

export default function Page({ params }: { params: { handle: string } }) {
  const [tba, setTba] = useState<`0x${string}`>(ZERO_ADDRESS);
  const [subscriptions, setSubscriptions] = useState<IStream[]>([]);
  const [tbaDeployed, setTbaDeployed] = useState(true);
  const { data: profile, loading: profileLoading } = useProfile({
    handle: `${params.handle}${HANDLE_SUFFIX}`,
  });
  const { data: activeProfile } = useActiveProfile();
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const provider = useProvider();

  const tokenId = useMemo(() => {
    return profile?.id ? Number.parseInt(profile.id, 16).toString() : undefined;
  }, [profile]);

  const getSigner = useCallback(async () => {
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
    return;
  }, [connectAsync, disconnectAsync, isConnected]);

  const fetchStreams = useCallback(async () => {
    const sf = await Framework.create({
      chainId: wagmiNetwork.id,
      provider: wagmiClient.provider,
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
    if (tokenId && provider && getSigner) {
      const signer = await getSigner();
      if (signer) {
        const tokenboundClient = new TokenboundClient({
          signer,
          chainId: wagmiNetwork.id,
        });
        const address = await tokenboundClient.getAccount({
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
    }
  }, [tokenId, getSigner, provider]);

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
    <div className="grid gap-7 lg:grid-cols-5">
      <ProfileDetails
        profile={profile}
        tba={tba}
        tbaDeployed={tbaDeployed}
        tokenId={tokenId}
        subscriptions={subscriptions}
        accountCreated={accountCreated}
      />
      <div className="col-span-3">
        {/* <div className="flex">
          {tba && (
            <TbaDetails profile={profile} tba={tba} tbaDeployed={tbaDeployed} />
          )}
          <div className="flex w-full justify-end">
            <CreateTba
              disabled={tbaDeployed}
              tokenId={tokenId}
              accountCreated={accountCreated}
            />
          </div>
        </div> */}
        <div className="space-y-5">
          {activeProfile && activeProfile.id === profile.id && (
            <CreatePost publisher={activeProfile} tba={tba} />
          )}
          <Publications profileId={profile.id} tba={tba} />
        </div>
        <div className="mt-5">
          {/* {tba !== ZERO_ADDRESS && <Assets tba={tba} profile={profile} />} */}
        </div>
      </div>
      <div>
        <Subscribers subscriptions={subscriptions} tba={tba} />
      </div>
    </div>
  );
}
