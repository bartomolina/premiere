import { type Profile } from "@lens-protocol/react-web";

import { HANDLE_SUFFIX } from "./constants";

export function getProfileName(profile: Profile): string {
  return profile.name ?? profile.handle.replace(HANDLE_SUFFIX, "");
}

export function getBaseProfileHandle(profile: Profile): string {
  return profile.handle.replace(HANDLE_SUFFIX, "");
}
