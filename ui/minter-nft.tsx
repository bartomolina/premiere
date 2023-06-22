import { useActiveWallet } from "@lens-protocol/react-web";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { MOSAIC_NFT_MINTER_ADDRESS, NFT_ITEMS } from "@/lib/constants";
import { wagmiNetwork } from "@/lib/wagmi-client";

const generateRandomTokenId = (items: number = NFT_ITEMS): number => {
  return Math.floor(Math.random() * (items - 1 - 1 + 1) + 1);
};
const randomTokenId = generateRandomTokenId();

export function MinterNFT({
  tba,
  fetchNFTs,
}: {
  tba: `0x${string}`;
  fetchNFTs: () => void;
}) {
  const [tokenId, setTokenId] = useState(randomTokenId);
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: MOSAIC_NFT_MINTER_ADDRESS,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "string",
            name: "uri",
            type: "string",
          },
        ],
        name: "safeMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "safeMint",
    args: [tba, `https://www.miladymaker.net/milady/json/${tokenId}`],
    chainId: wagmiNetwork.id,
  });
  const { data, error, isError, write } = useContractWrite(config);
  const [isLoading, setIsLoading] = useState(false);
  const { data: wallet } = useActiveWallet();

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      toast
        .promise(data.wait(2), {
          pending: "Minting",
          success: "Minted",
          error: "Error minting",
        })
        .then(() => fetchNFTs())
        .catch((error) => {
          toast.error("Error minting");
          console.error(error);
        })
        .finally(() => {
          setTokenId(generateRandomTokenId());
          setIsLoading(false);
        });
    }
  }, [data, fetchNFTs]);

  useEffect(() => {
    if ((isPrepareError || isError) && (prepareError || error)) {
      toast.error((prepareError || error)?.message);
      console.error(error);
    }
  }, [isPrepareError, isError, prepareError, error]);

  return (
    <button
      disabled={!write || isLoading || !wallet}
      onClick={() => write?.()}
      className="btn-primary btn-sm btn normal-case"
    >
      {wallet ? "Mint a Milady" : "Connect account"}
    </button>
  );
}
