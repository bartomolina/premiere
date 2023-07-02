import { WebBundlr } from "@bundlr-network/client";
import { providers } from "ethers";

import { LENS_NETWORK } from "./constants";

const TOP_UP = "200000000000000000"; // 0.2 MATIC
const MIN_FUNDS = 0.05;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const upload = async (data: any) => {
  let url = "";
  if (window.ethereum) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await window.ethereum.enable();
    console.log(window.ethereum);
    const provider = new providers.Web3Provider(
      window.ethereum as providers.ExternalProvider
    );
    const signer = provider.getSigner();
    console.log("Signer:", signer);

    // create a WebBundlr object
    const bundlrNode =
      LENS_NETWORK === "mainnet"
        ? "https://node2.bundlr.network"
        : "https://devnet.bundlr.network";
    const bundlr = new WebBundlr(bundlrNode, "matic", provider);

    await bundlr.ready();

    const address = await signer.getAddress();
    if (address) {
      const balance = await bundlr.getBalance(address);

      if (bundlr.utils.unitConverter(balance).toNumber() < MIN_FUNDS) {
        await bundlr.fund(TOP_UP);
      }

      const serialized = JSON.stringify(data);
      const tx = await bundlr.upload(serialized, {
        tags: [{ name: "Content-Type", value: "application/json" }],
      });

      url = `https://arweave.net/${tx.id}`;
      console.log(`Upload success content URI=${url}`);
    }
  }
  return url;
};
