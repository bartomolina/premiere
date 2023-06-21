import {
  type ProfileId,
  useActiveProfile,
  useActiveProfileSwitch,
  useProfilesOwnedByMe,
} from "@lens-protocol/react-web";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { getAvatar } from "@/lib/get-avatar";

export function LensProfiles() {
  const { data: activeProfile } = useActiveProfile();
  const { data: profiles, error: fetchProfilesError } = useProfilesOwnedByMe();
  const { execute: switchActiveProfile } = useActiveProfileSwitch();

  useEffect(() => {
    fetchProfilesError && toast.error(fetchProfilesError.message);
  }, [fetchProfilesError]);

  const setActiveProfile = (profileId: ProfileId) => {
    switchActiveProfile(profileId);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <>
      {activeProfile &&
        profiles &&
        profiles
          .filter((profile) => profile.id != activeProfile.id)
          .map((profile) => (
            <li key={profile.id}>
              <a onClick={() => setActiveProfile(profile.id)}>
                <div className="relative h-5 w-5">
                  <Image
                    src={getAvatar(profile)}
                    alt={profile.handle}
                    fill
                    sizes="(max-width: 20px) 100vw"
                    className="rounded-full object-cover"
                  />
                </div>
                {profile.handle}
              </a>
            </li>
          ))}
    </>
  );
}
