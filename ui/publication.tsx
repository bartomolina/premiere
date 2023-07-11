import {
  appId,
  type MetadataOutput,
  type Post,
} from "@lens-protocol/react-web";
import {
  LensEnvironment,
  LensGatedSDK,
  type MetadataV2,
} from "@lens-protocol/sdk-gated";
import { Star } from "@phosphor-icons/react";
import { providers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import remarkGfm from "remark-gfm";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import {
  APP_ID,
  LENS_NETWORK,
  MIN_FLOWRATE,
  SUPERFLUID_TOKEN,
  ZERO_ADDRESS,
} from "@/lib/constants";
import { imageKit, sanitizeDStorageUrl } from "@/lib/get-avatar";

export function Publication({
  publication,
  tba,
}: {
  publication: Post;
  tba: `0x${string}`;
}) {
  const [metadata, setMetadata] = useState<MetadataOutput | MetadataV2>(
    publication.metadata
  );
  const [unlocked, setUnlocked] = useState(false);
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    const decryptPublication = async () => {
      if (isConnected) {
        await disconnectAsync();
      }
      try {
        await connectAsync();
      } catch (error) {
        toast.error("Error connecting to wallet");
        console.error(error);
        return;
      }

      const provider = new providers.Web3Provider(
        window.ethereum as providers.ExternalProvider
      );

      const signer = provider.getSigner();

      const sdk = await LensGatedSDK.create({
        provider,
        signer,
        env:
          LENS_NETWORK === "mainnet"
            ? LensEnvironment.Polygon
            : LensEnvironment.Mumbai,
      });

      await sdk.connect({
        address: await signer.getAddress(),
        env:
          LENS_NETWORK === "mainnet"
            ? LensEnvironment.Polygon
            : LensEnvironment.Mumbai,
      });

      const { decrypted } = await sdk.gated.decryptMetadata(
        publication.metadata
      );

      if (decrypted) {
        setMetadata(decrypted);
        setUnlocked(true);
      }
    };

    if (
      publication?.isGated &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      publication.canDecrypt?.result &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      publication.appId === appId(APP_ID) &&
      tba != ZERO_ADDRESS
    ) {
      decryptPublication();
    }
  }, [publication, tba]);

  console.log(publication);

  return (
    <>
      {publication.isGated && !unlocked ? (
        <div className="relative h-16 text-sm">
          <div className="absolute h-full w-full rounded-lg border border-primary text-sm blur-sm"></div>
          <div className="absolute z-10 flex w-full justify-between gap-4 p-5">
            <div className="flex gap-2">
              🔒
              <span>{`${MIN_FLOWRATE} ${SUPERFLUID_TOKEN} / mo.`}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-primary text-sm">
          {unlocked && (
            <div className="flex w-full items-center justify-end gap-1 px-5 pt-3 text-xs font-semibold">
              <span>Premium</span>
              <Star
                width={15}
                height={15}
                weight="fill"
                className="text-warning "
              />
            </div>
          )}
          <div className="prose-sm prose m-5 break-words text-base-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {metadata.content}
            </ReactMarkdown>
            {metadata.media &&
              metadata.media[0] &&
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              metadata.media[0].original.mimeType.includes("image/") && (
                <div>
                  <Image
                    src={imageKit(
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      sanitizeDStorageUrl(metadata.media[0].original.url)
                    )}
                    width={150}
                    height={150}
                    alt="Post image"
                    className="mx-auto"
                  />
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );
}
