import { Alchemy, type OwnedNft, type OwnedNftsResponse } from "alchemy-sdk";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { ALCHEMY_API_KEY, ALCHEMY_NETWORK, OPENSEA_URL } from "@/lib/constants";

import { MinterNFT } from "./minter-nft";

const config = {
  apiKey: ALCHEMY_API_KEY,
  network: ALCHEMY_NETWORK,
};
const alchemy = new Alchemy(config);

export function AssetsNfts({ tba }: { tba: `0x${string}` }) {
  const [nfts, setNFTs] = useState<OwnedNft[]>([]);

  const fetchNFTs = useCallback(() => {
    if (tba) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      alchemy.nft.getNftsForOwner(tba).then((result: OwnedNftsResponse) => {
        setNFTs(result.ownedNfts);
      });
    }
  }, [tba]);

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  return (
    <div className="text-center">
      {nfts.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-5">
          {nfts
            .filter((nft) => nft.media[0]?.thumbnail || nft.media[0]?.gateway)
            .map((nft) => (
              <div key={`${nft.contract?.address}${nft.tokenId}`}>
                <a
                  href={`${OPENSEA_URL}${nft.contract?.address}/${nft.tokenId}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <div className="relative h-40 w-40">
                    <Image
                      alt={nft.title ?? nft.tokenId}
                      src={nft.media[0]?.thumbnail || nft.media[0]?.gateway}
                      fill
                      sizes="160px"
                      className="object-contain"
                    />
                  </div>
                </a>
              </div>
            ))}
        </div>
      ) : (
        <div className="p-10 text-center font-semibold">Nothing to show</div>
      )}
      <MinterNFT tba={tba} fetchNFTs={fetchNFTs} />
    </div>
  );
}
