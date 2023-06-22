import { type Profile } from "@lens-protocol/react-web";

import {
  ARWEAVE_GATEWAY,
  AVATAR,
  IPFS_GATEWAY,
  LENS_MEDIA_SNAPSHOT_URL,
  ZERO_ADDRESS,
} from "./constants";

const getStampFyiURL = (address: string): string => {
  const lowerCaseAddress = address.toLowerCase();
  return `https://cdn.stamp.fyi/avatar/eth:${lowerCaseAddress}?s=300`;
};

const sanitizeDStorageUrl = (hash?: string): string => {
  if (!hash) {
    return "";
  }

  let link = hash.replaceAll(/^Qm[1-9A-Za-z]{44}/gm, `${IPFS_GATEWAY}${hash}`);
  link = link.replace("https://ipfs.io/ipfs/", IPFS_GATEWAY);
  link = link.replace("ipfs://ipfs/", IPFS_GATEWAY);
  link = link.replace("ipfs://", IPFS_GATEWAY);
  link = link.replace("ar://", ARWEAVE_GATEWAY);

  return link;
};

const imageKit = (url: string, name?: string): string => {
  if (!url) {
    return "";
  }

  if (url.includes(LENS_MEDIA_SNAPSHOT_URL)) {
    const splitedUrl = url.split("/");
    const path = splitedUrl.at(-1);

    return name ? `${LENS_MEDIA_SNAPSHOT_URL}/${name}/${path}` : url;
  }

  return url;
};

export function getAvatar(profile: Profile, namedTransform = AVATAR): string {
  let avatarUrl = "";

  if (profile?.picture) {
    if ("original" in profile.picture) {
      avatarUrl = profile?.picture?.original?.url;
    } else if ("uri" in profile.picture) {
      avatarUrl = profile.picture.uri;
    }
  }

  if (!avatarUrl) {
    avatarUrl = getStampFyiURL(profile?.ownedBy ?? ZERO_ADDRESS);
  }

  return imageKit(sanitizeDStorageUrl(avatarUrl), namedTransform);
}
