"use client";

import {
  type ProfileId,
  useProfile,
  useActiveProfile,
} from "@lens-protocol/react-web";
import { getAccount } from "@tokenbound/sdk-ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useProvider } from "wagmi";

import { LENS_PROFILES_ADDRESS, ZERO_ADDRESS } from "@/lib/constants";
import { Assets } from "@/ui/assets";
import { CreateTba } from "@/ui/create-tba";
import { ProfileDetails } from "@/ui/profile-details";
import { TbaDetails } from "@/ui/tba-details";
import { CreatePost } from "@/ui/create-post";
import { Publications } from "@/ui/publications";

export default function Page({ params }: { params: { id: ProfileId } }) {
  const [tba, setTba] = useState<`0x${string}`>(ZERO_ADDRESS);
  const [tbaDeployed, setTbaDeployed] = useState(true);
  const { data: profile, loading: profileLoading } = useProfile({
    profileId: params.id,
  });
  const { data: activeProfile } = useActiveProfile();
  const provider = useProvider();

  const tokenId = useMemo(() => {
    return profile?.id ? Number.parseInt(profile.id, 16).toString() : undefined;
  }, [profile]);

  const fetchTBAAddress = useCallback(() => {
    if (provider && tokenId) {
      getAccount(LENS_PROFILES_ADDRESS, tokenId, provider)
        .then((address) => {
          setTba(address);
          return provider.getCode(address);
        })
        .then((code) => {
          if (code === "0x") {
            setTbaDeployed(false);
          } else {
            setTbaDeployed(true);
          }
        });
    }
  }, [provider, tokenId]);

  useEffect(() => {
    fetchTBAAddress();
  }, [tokenId, fetchTBAAddress]);

  const accountCreated = () => {
    fetchTBAAddress();
  };

  if (profileLoading || !profile) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  return (
    <div className="grid gap-7 lg:grid-cols-5">
      <ProfileDetails profile={profile} />
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
        {activeProfile && activeProfile.id === profile.id && (
          <CreatePost publisher={activeProfile} />
        )}
        <Publications profileId={profile.id} />
        <div className="mt-5">
          {/* {tba !== ZERO_ADDRESS && <Assets tba={tba} profile={profile} />} */}
        </div>
      </div>
      <div></div>
    </div>
  );
}
