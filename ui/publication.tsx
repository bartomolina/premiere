import { type MetadataOutput, type Post } from "@lens-protocol/react-web";
import { type MetadataV2 } from "@lens-protocol/sdk-gated";
import { useEffect, useState } from "react";
import { LensGatedSDK, LensEnvironment } from "@lens-protocol/sdk-gated";
import { wagmiClient } from "@/lib/wagmi-client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { LENS_NETWORK } from "@/lib/constants";
import { toast } from "react-toastify";
import { Star, Lock } from "@phosphor-icons/react";

export function Publication({ publication }: { publication: Post }) {
  const [metadata, setMetadata] = useState<MetadataOutput | MetadataV2>(
    publication.metadata
  );
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    const decryptPublication = async () => {
      let connector;
      if (isConnected) {
        await disconnectAsync();
      }
      try {
        ({ connector } = await connectAsync());
      } catch (error) {
        toast.error("Error connecting to wallet");
        console.error(error);
      }

      if (connector instanceof InjectedConnector) {
        const signer = await connector.getSigner();

        const sdk = await LensGatedSDK.create({
          provider: wagmiClient.provider,
          signer,
          env:
            LENS_NETWORK === "mainnet"
              ? LensEnvironment.Polygon
              : LensEnvironment.Mumbai,
        });

        await sdk.connect({
          address: await signer.getAddress(), // your signer's wallet address
          env: LensEnvironment.Mumbai,
        });

        const { error, decrypted } = await sdk.gated.decryptMetadata(
          publication.metadata
        );

        if (decrypted) {
          setMetadata(decrypted);
        }

        toast.error(error?.message);
      }
    };
    if (publication?.isGated && publication.canDecrypt?.result) {
      decryptPublication();
    }
  }, [publication]);

  return (
    <div className="relative p-5 text-sm border-primary border rounded-lg">
      {publication.isGated && (
        <>
          {publication.canDecrypt?.result ? (
            <Star
              width={32}
              weight="fill"
              className="text-warning absolute top-2 right-2"
            />
          ) : (
            <Lock
              width={32}
              weight="fill"
              className="text-error absolute top-2 right-2"
            />
          )}
        </>
      )}
      {metadata.content}
    </div>
  );
}
