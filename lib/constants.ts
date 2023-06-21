export const IPFS_GATEWAY = "https://gateway.ipfscdn.io/ipfs/";
export const ARWEAVE_GATEWAY = "https://arweave.net/";
export const AVATAR = "tr:w-300,h-300";
export const LENS_MEDIA_SNAPSHOT_URL =
  "https://ik.imagekit.io/lens/media-snapshot";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? "mainnet";
export const HANDLE_SUFFIX = LENS_NETWORK === "mainnet" ? ".lens" : ".test";
export const LENSTER_URL =
  LENS_NETWORK === "mainnet"
    ? "https://lenster.xyz/"
    : "https://testnet.lenster.xyz/";
export const LENS_PROFILES_ADDRESS =
  LENS_NETWORK === "mainnet"
    ? "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
    : "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";
export const OPENSEA_URL =
  LENS_NETWORK === "mainnet"
    ? "https://opensea.io/assets/matic/"
    : "https://testnets.opensea.io/assets/mumbai/";
export const POLYGONSCAN_URL =
  LENS_NETWORK === "mainnet"
    ? "https://polygonscan.com/"
    : "https://mumbai.polygonscan.com/";
