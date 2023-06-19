import {
  type ProfileId,
  useActiveProfile,
  useActiveProfileSwitch,
  useProfilesOwnedByMe,
} from "@lens-protocol/react-web";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { getPictureURL } from "@/lib/get-picture-url";

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
                <div className="w-5 h-5 relative">
                  <Image
                    src={getPictureURL(profile)}
                    alt={profile.handle}
                    fill
                    sizes="(max-width: 20px) 100vw"
                    className="object-cover rounded-full"
                  />
                </div>
                {profile.handle}
              </a>
            </li>
          ))}
    </>
  );
}
