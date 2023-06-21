import {
  development,
  type LensConfig,
  production,
} from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";

import { LENS_NETWORK } from "./constants";

export const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: LENS_NETWORK === "mainnet" ? production : development,
};
