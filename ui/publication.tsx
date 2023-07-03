import {
  appId,
  type MetadataOutput,
  type Post,
} from "@lens-protocol/react-web";
import { type MetadataV2 } from "@lens-protocol/sdk-gated";
import { Star } from "@phosphor-icons/react";
import { ethers } from "ethers";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import omitDeep from "omit-deep";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { APP_ID, SUPERFLUID_TOKEN, ZERO_ADDRESS } from "@/lib/constants";
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
  const [unlockConditions, setUnlockConditions] = useState({
    minFlowRate: "",
    maxTimestamp: "",
  });

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
          let monthlyFlowRate = Number(ethers.utils.formatEther(minFlowRate));
          monthlyFlowRate = monthlyFlowRate * 60 * 60 * 24 * (365 / 12);

          setUnlockConditions({
            minFlowRate: monthlyFlowRate.toFixed(2),
            maxTimestamp,
          });
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
          <div className="absolute z-10 flex w-full justify-between gap-4 p-5">
            <div className="flex gap-4">
              <div>🔒</div>
              {unlockConditions.maxTimestamp && (
                <div>{`🕑 Since ${new Date(
                  Number.parseInt(unlockConditions.maxTimestamp) * 1000
                ).toUTCString()}`}</div>
              )}
            </div>
            {unlockConditions.minFlowRate && (
              <div>
                {`🤑 ${unlockConditions.minFlowRate} ${SUPERFLUID_TOKEN} / mo.`}
              </div>
            )}
          </div>
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
          <div className="prose-sm prose m-5 break-words text-base-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {metadata.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
}
