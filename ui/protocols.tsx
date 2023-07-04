import Image from "next/image";
import { useTheme } from "next-themes";

export function Protocols() {
  const { theme } = useTheme();
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div>
        <div className="relative h-24 w-full">
          <a
            href="https://www.lens.xyz/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Image
              src={"/lens-logo.svg"}
              alt="Lens protocol"
              fill
              sizes="100vw"
              style={{ objectFit: "scale-down" }}
            />
          </a>
        </div>
        <div>
          <h2 className="my-5 text-center text-xl font-semibold">
            Lens Protocol
          </h2>
        </div>
        <p className="text-center">
          Bring your social graph over to Premiere. All your existing followers
          can now subscribe to your premium content!
        </p>
      </div>
      <div>
        <div className="relative h-24">
          <a
            href="https://www.superfluid.finance/"
            target="_blank"
            rel="noreferrer noopener"
          >
            {theme === "light" ? (
              <Image
                key={"light"}
                src={"/superfluid-logo.png"}
                alt="Superfluid protocol"
                fill
                sizes="100vw"
                style={{ objectFit: "scale-down" }}
              />
            ) : (
              <Image
                key={"dark"}
                src={"/superfluid-logo-dark.png"}
                alt="Superfluid protocol"
                fill
                sizes="100vw"
                style={{ objectFit: "scale-down" }}
              />
            )}
          </a>
        </div>
        <div>
          <h2 className="my-5 text-center text-xl font-semibold">
            Superfluid Protocol
          </h2>
        </div>
        <p className="text-center">
          With Superfluid, setting up recurring payments has never been easier.
          You&apos;ll get the money from your subscribers streamed by the
          second. Enjoy the power of real-time finance and the composability of
          Web3
        </p>
      </div>
      <div>
        <div className="relative h-24 w-full">
          <a
            href="https://tokenbound.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            {theme === "light" ? (
              <Image
                key={"light"}
                src={"/tb-mark.svg"}
                alt="Superfluid protocol"
                fill
                sizes="100vw"
              />
            ) : (
              <Image
                key={"dark"}
                src={"/tb-mark-dark.svg"}
                alt="Superfluid protocol"
                fill
                sizes="100vw"
              />
            )}
          </a>
        </div>
        <div>
          <h2 className="my-5 text-center text-xl font-semibold">Tokenbound</h2>
        </div>
        <p className="text-center">
          ERC-6551 Non-fungible Token Bound is a registry that links every NFT
          to a smart contract account. Making it possible for any token to own
          assets. Your subscriptions will be tied to your TBA, so when you
          migrate your Lens profile you&apos;ll take all your subscribers with
          you
        </p>
      </div>
      <div>
        <div className="relative h-24 w-full">
          <a
            href="https://litprotocol.com/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Image
              src={"/lit-logo.png"}
              alt="Lit protocol"
              fill
              sizes="100vw"
              style={{ objectFit: "scale-down" }}
            />
          </a>
        </div>
        <div>
          <h2 className="my-5 text-center text-xl font-semibold">
            LIT Protocol
          </h2>
        </div>
        <p className="text-center">
          All the publications posted through Premiere are encrypted and only
          accessible by your subscribers
        </p>
      </div>
    </div>
  );
}
