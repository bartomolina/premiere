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
  }, [publication, tba]);

  return (
    <div className="relative p-5 text-sm border-primary border rounded-lg">
      {publication.isGated && (
        <>
          {unlocked ? (
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
