import { WebBundlr } from "@bundlr-network/client";
import { fetchSigner } from "wagmi/actions";
import { LENS_NETWORK } from "./constants";

const TOP_UP = "200000000000000000"; // 0.2 MATIC
const MIN_FUNDS = 0.05;

export const upload = async (data: any) => {
  const signer = await fetchSigner();
  const provider = signer?.provider;
  // use method injection to add the missing function
  provider.getSigner = () => signer;

  // create a WebBundlr object
  const bundlrNode =
    LENS_NETWORK === "mainnet"
      ? "https://node2.bundlr.network"
      : "https://devnet.bundlr.network";
  const bundlr = new WebBundlr(bundlrNode, "matic", signer?.provider);

  await bundlr.ready();

  const address = await signer?.getAddress();
  let url = "";
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
  return url;
};
