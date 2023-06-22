import { AssetsNfts } from "./assets-nfts";
import { AssetsTokens } from "./assets-tokens";
import { Separator } from "./separator";

export function Assets({ tba }: { tba: `0x${string}` }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div>
        <Separator title="Streams" />
        <div className="p-5">
          <div className="p-10 text-center font-semibold">Nothing to show</div>
        </div>
      </div>
      <div>
        <Separator title="NFTs" />
        <div className="p-8">
          <AssetsNfts tba={tba} />
        </div>
      </div>
      <div>
        <Separator title="Tokens" />
        <div className="p-5">
          <AssetsTokens tba={tba} />
        </div>
      </div>
    </div>
  );
}
