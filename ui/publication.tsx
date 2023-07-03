import {
  appId,
  type MetadataOutput,
  type Post,
} from "@lens-protocol/react-web";
import { type MetadataV2 } from "@lens-protocol/sdk-gated";
import { Star } from "@phosphor-icons/react";
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

  console.log(publication);

  useEffect(() => {
    if (sigReady) {
      const decryptPublication = async () => {
        const encryptedContent =
          publication.metadata.encryptionParams?.encryptedFields?.content;
        const encryptedSymmetricKey =
          publication.metadata.encryptionParams?.providerSpecificParams
            ?.encryptionKey;
        const minFlowRate = publication.metadata.attributes.find(
          (attribute) => attribute.traitType === "minFlowRate"
        )?.value;
        const maxTimestamp = publication.metadata.attributes.find(
          (attribute) => attribute.traitType === "maxTimestamp"
        )?.value;
        if (
          encryptedContent &&
          encryptedSymmetricKey &&
          typeof minFlowRate === "string" &&
          typeof maxTimestamp === "string"
        ) {
          console.log("checking...");
          try {
            const decryptedString = await decrypt(
              encryptedContent,
              encryptedSymmetricKey,
              tba,
              Number.parseInt(publication.profile.id, 16).toString(),
              minFlowRate,
              maxTimestamp
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
    <>
      {publication.isGated && !unlocked ? (
        <div className="relative h-16 text-sm">
          <div className="absolute h-full w-full rounded-lg border border-primary text-sm blur-sm"></div>
          <div className="absolute z-10 p-5 ">🔒 Subscribers only</div>
        </div>
      ) : (
        <div className="rounded-lg border border-primary text-sm">
          {unlocked && (
            <div className="flex w-full justify-end px-5 pt-3">
              <Star
                width={15}
                height={15}
                weight="fill"
                className="text-warning "
              />
            </div>
          )}
          <div className="prose-sm prose m-5 overflow-hidden text-ellipsis">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {metadata.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
}
