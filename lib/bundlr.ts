import { WebBundlr } from "@bundlr-network/client";
import { getWalletClient } from "wagmi/actions";

import { LENS_NETWORK } from "./constants";

const TOP_UP = "200000000000000000"; // 0.2 MATIC
const MIN_FUNDS = 0.05;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const upload = async (data: any) => {
  let url = "";
  const client = await getWalletClient();
  // create a WebBundlr object
  const bundlrNode =
    LENS_NETWORK === "mainnet"
      ? "https://node2.bundlr.network"
      : "https://devnet.bundlr.network";
  const bundlr = new WebBundlr(bundlrNode, "matic", client);

  await bundlr.ready();

  const address = await client?.getAddresses();
  if (address) {
    const balance = await bundlr.getBalance(address[0]);

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
  return url;
};
