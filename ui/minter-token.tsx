import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { MOSAIC_TOKEN_MINTER_ADDRESS } from "@/lib/constants";

export function MinterToken({
  tba,
  fetchBalances,
}: {
  tba: `0x${string}`;
  fetchBalances: () => void;
}) {
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: MOSAIC_TOKEN_MINTER_ADDRESS,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "mint",
    args: [tba, ethers.utils.parseEther("1000")],
  });
  const { data, error, isError, write } = useContractWrite(config);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      toast
        .promise(data.wait(2), {
          pending: "Minting",
          success: "Minted",
          error: "Error minting",
        })
        .then(() => fetchBalances())
        .catch((error) => {
          toast.error("Error minting");
          console.error(error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [data, fetchBalances]);

  useEffect(() => {
    if ((isPrepareError || isError) && (prepareError || error)) {
      toast.error((prepareError || error)?.message);
    }
  }, [isPrepareError, isError, prepareError, error]);

  return (
    <>
      <button
        disabled={!write || isLoading}
        onClick={() => write?.()}
        className="btn-primary btn-sm btn mt-5 normal-case"
      >
        MSK
      </button>
    </>
  );
}
