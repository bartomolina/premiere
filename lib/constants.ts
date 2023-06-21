export const IPFS_GATEWAY = "https://gateway.ipfscdn.io/ipfs/";
export const ARWEAVE_GATEWAY = "https://arweave.net/";
export const AVATAR = "tr:w-300,h-300";
export const LENS_MEDIA_SNAPSHOT_URL =
  "https://ik.imagekit.io/lens/media-snapshot";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? "mainnet";
export const HANDLE_SUFFIX = LENS_NETWORK === "mainnet" ? ".lens" : ".test";
