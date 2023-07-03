import { Network } from "alchemy-sdk";
import { polygon, polygonMumbai } from "viem/chains";

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
export const LENS_HUB_ADDRESS =
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
export const ALCHEMY_NETWORK =
  LENS_NETWORK === "mainnet" ? Network.MATIC_MAINNET : Network.MATIC_MUMBAI;
export const ALCHEMY_API_KEY =
  (LENS_NETWORK === "mainnet"
    ? process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_KEY
    : process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI_KEY) ?? "demo";
export const SUPERFLUID_TOKEN = LENS_NETWORK === "mainnet" ? "DAIx" : "fDAIx";
export const SUPERFLUID_TOKEN_ADDRESS =
  LENS_NETWORK === "mainnet"
    ? "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2"
    : "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f";
export const SUPERFLUID_STREAM_URL =
  LENS_NETWORK === "mainnet"
    ? "https://console.superfluid.finance/matic/streams/"
    : "https://console.superfluid.finance/mumbai/streams/";
export const CHAIN = LENS_NETWORK === "mainnet" ? "polygon" : "mumbai";
export const MOSAIC_LIT_ACC_CONTRACT =
  LENS_NETWORK === "mainnet"
    ? ""
    : "0xE4666A494238E6e397962ac749368629139ff363";
export const APP_ID = "mosaic";
export const LIGHT_THEME_PRIMARY = "#529b03";
export const LIGHT_THEME_SECONDARY = "#e9e92f";
export const DARK_THEME_PRIMARY = "#ff7ac6";
export const DARK_THEME_SECONDARY = "#bf95f9";
export const WALLET_NETWORK =
  LENS_NETWORK === "mainnet" ? polygon : polygonMumbai;
