import { useSearchProfiles } from "@lens-protocol/react-web";
import Image from "next/image";
import Link from "next/link";

import { HANDLE_SUFFIX } from "@/lib/constants";
import { getAvatar } from "@/lib/get-avatar";

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
    <ul
      tabIndex={0}
      className="dropdown-content menu menu-sm mt-2 w-full max-w-xs rounded-lg border border-primary bg-base-100 p-0"
    >
      {profiles?.map((profile) => (
        <li key={profile.id}>
          <Link
            className="rounded-none p-3"
            href={`/profile/${profile.id}`}
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
                {profile.name ?? profile.handle.replace(HANDLE_SUFFIX, "")}
              </p>
              <p>{profile.handle}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
