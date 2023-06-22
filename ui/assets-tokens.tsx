import { Alchemy, type TokenMetadataResponse } from "alchemy-sdk";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";

import { ALCHEMY_API_KEY, ALCHEMY_NETWORK } from "@/lib/constants";

import { MinterToken } from "./minter-token";

const config = {
  apiKey: ALCHEMY_API_KEY,
  network: ALCHEMY_NETWORK,
};
const alchemy = new Alchemy(config);

type Balance = TokenMetadataResponse & { address: string; balance: string };

export function AssetsTokens({ tba }: { tba: `0x${string}` }) {
  const [tokens, setTokens] = useState<Balance[]>([]);

  const fetchBalances = useCallback(async () => {
    const balances = await alchemy.core.getTokenBalances(tba);
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== "0";
    });

    const tokenBalances = [];

    for (const token of nonZeroBalances) {
      if (token.tokenBalance) {
        const metadata = await alchemy.core.getTokenMetadata(
          token.contractAddress
        );

        const balance = ethers.utils.formatUnits(token.tokenBalance, 18);

        tokenBalances.push({
          ...metadata,
          address: token.contractAddress,
          balance,
        });
      }
    }

    setTokens(tokenBalances);
  }, [tba]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances, tba]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end">
        <MinterToken tba={tba} fetchBalances={fetchBalances} />
      </div>
      {tokens.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.address}>
                  <td>{token.symbol}</td>
                  <td>{token.name}</td>
                  <td>{token.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-10 text-center font-semibold">Nothing to show</div>
      )}
    </div>
  );
}
