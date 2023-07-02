import { polygon, polygonMumbai } from "@wagmi/core/chains";
import { configureChains, createConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { alchemyProvider } from "wagmi/providers/alchemy";

import { ALCHEMY_API_KEY, LENS_NETWORK } from "./constants";

export const wagmiNetwork =
  LENS_NETWORK === "mainnet" ? polygon : polygonMumbai;

export const { publicClient, webSocketPublicClient } = configureChains(
  [wagmiNetwork],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY })]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [new InjectedConnector()],
});
