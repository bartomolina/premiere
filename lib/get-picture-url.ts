import { type MediaSet, type ProfileOwnedByMe } from "@lens-protocol/react-web";

export const getPictureURL = (profile: ProfileOwnedByMe) => {
  let picture = "/avatar.png";
  const profilePicture = profile.picture as MediaSet;
  if (profilePicture.original && profilePicture.original.url) {
    if (profilePicture.original.url.startsWith("ipfs://")) {
      const result = profilePicture.original.url.slice(
        7,
        profilePicture.original.url.length
      );
      picture = `https://lens.infura-ipfs.io/ipfs/${result}`;
    } else {
      picture = profilePicture.original.url;
    }
  }

  return picture;
};
