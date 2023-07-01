import {
  appId,
  type MetadataOutput,
  type Post,
} from "@lens-protocol/react-web";
import { type MetadataV2 } from "@lens-protocol/sdk-gated";
import { Lock, Star } from "@phosphor-icons/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import omitDeep from "omit-deep";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { APP_ID, ZERO_ADDRESS } from "@/lib/constants";
import { decrypt } from "@/lib/lit";

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
          } catch {
            console.log("You don't have access to the publication");
          }
        }
      };
      if (
        publication?.isGated &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        publication.appId === appId(APP_ID) &&
        tba != ZERO_ADDRESS
      ) {
        decryptPublication();
      }
    }
  }, [publication, tba, sigReady]);

  return (
    <div className="  rounded-lg border border-primary text-sm">
      {publication.isGated && (
        <div className="flex w-full justify-end px-5 pt-3">
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
      <div className="prose-sm prose p-5">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {metadata.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
