"use client";

import { type ProfileId, useProfile } from "@lens-protocol/react-web";

export default function Page({ params }: { params: { id: ProfileId } }) {
  const { data: profile, loading: profileLoading } = useProfile({
    profileId: params.id,
  });

  if (profileLoading || !profile) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  return (
    <div>
      <div>{profile.handle}</div>
    </div>
  );
}
