import {
  appId,
  type MetadataOutput,
  type Post,
} from "@lens-protocol/react-web";
import { type MetadataV2 } from "@lens-protocol/sdk-gated";
import { useEffect, useState } from "react";
import { LensGatedSDK, LensEnvironment } from "@lens-protocol/sdk-gated";
import { wagmiClient } from "@/lib/wagmi-client";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { APP_ID, LENS_NETWORK, ZERO_ADDRESS } from "@/lib/constants";
import { toast } from "react-toastify";
import { Star, Lock } from "@phosphor-icons/react";
import { decrypt } from "@/lib/lit";
import omitDeep from "omit-deep";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Publication({
  publication,
  tba,
  sigReady,
}: {
  publication: Post;
  tba: `0x${string}`;
  sigReady: boolean;
}) {
  const [metadata, setMetadata] = useState<MetadataOutput | MetadataV2>(
    publication.metadata
  );
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (sigReady) {
      const decryptPublication = async () => {
        const encryptedContent =
          publication.metadata.encryptionParams?.encryptedFields?.content;
        const encryptedSymmetricKey =
          publication.metadata.encryptionParams?.providerSpecificParams
            ?.encryptionKey;
        if (encryptedContent && encryptedSymmetricKey) {
          try {
            const decryptedString = await decrypt(
              encryptedContent,
              encryptedSymmetricKey,
              tba,
              Number.parseInt(publication.profile.id, 16).toString()
            );

            const newMetadata = publication.metadata;
            omitDeep(newMetadata, "encryptionParams");
            newMetadata.content = decryptedString;
            setMetadata(newMetadata);
            setUnlocked(true);
          } catch (error) {
            console.log("You don't have access to the publication");
          }
        }
      };
      if (
        publication?.isGated &&
        publication.appId === appId(APP_ID) &&
        tba != ZERO_ADDRESS
      ) {
        decryptPublication();
      }
    }
  }, [publication, tba, sigReady]);

  return (
    <div className="  text-sm border-primary border rounded-lg">
      {publication.isGated && (
        <div className="flex w-full justify-end pt-3 px-5">
          {unlocked ? (
            <Star
              width={15}
              height={15}
              weight="fill"
              className="text-warning "
            />
          ) : (
            <Lock
              width={15}
              height={15}
              weight="fill"
              className="text-error "
            />
          )}
        </div>
      )}
      <div className="p-5 prose prose-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {metadata.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
