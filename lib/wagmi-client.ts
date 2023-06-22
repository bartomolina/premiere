import { configureChains, createClient } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";

import { ALCHEMY_API_KEY, LENS_NETWORK } from "./constants";

export const wagmiNetwork =
  LENS_NETWORK === "mainnet" ? polygon : polygonMumbai;

const { provider, webSocketProvider } = configureChains(
  [wagmiNetwork],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY })]
);

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});
