import { useSearchProfiles } from "@lens-protocol/react-web";
import Image from "next/image";
import Link from "next/link";

import { getAvatar } from "@/lib/get-avatar";
import { getBaseProfileHandle, getProfileName } from "@/lib/get-profile-info";

export function ProfileSearchSuggestions({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data: profiles, loading: profilesLoading } = useSearchProfiles({
    query,
  });

  if (!query || profilesLoading) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  const closeDropdown = () => {
    setQuery("");
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <>
      {!!profiles?.length && (
        <ul
          tabIndex={0}
          className="dropdown-content menu menu-sm z-20 mt-2 min-w-[211.5px] rounded-lg border border-primary bg-base-100 p-0"
        >
          {profiles?.map((profile) => (
            <li key={profile.id}>
              <Link
                className="rounded-none p-3"
                href={`/profile/${getBaseProfileHandle(profile)}`}
                onClick={closeDropdown}
              >
                <div className="relative h-8 w-8">
                  <Image
                    src={getAvatar(profile)}
                    alt={profile.handle}
                    fill
                    sizes="(max-width: 32px) 100vw"
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    {getProfileName(profile)}
                  </p>
                  <p>{profile.handle}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
