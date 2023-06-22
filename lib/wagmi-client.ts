import { configureChains, createClient } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";

import { ALCHEMY_API_KEY } from "./constants";
const { provider, webSocketProvider } = configureChains(
  [polygon, polygonMumbai],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY })]
);

export const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});
