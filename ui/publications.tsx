import { gql } from "@apollo/client";
import {
  type Post,
  type ProfileId,
  useActiveProfile,
  useActiveWallet,
  useApolloClient,
} from "@lens-protocol/react-web";
import { useCallback, useEffect, useState } from "react";

import { getPublicationsQuery } from "@/lib/api";
import { ZERO_ADDRESS } from "@/lib/constants";
import { prepareSig } from "@/lib/lit";

import { CreatePost } from "./create-post";
import { Publication } from "./publication";

export function Publications({
  profileId,
  tba,
}: {
  profileId: ProfileId;
  tba: `0x${string}`;
}) {
  const [publications, setPublications] = useState<Post[]>([]);
  const [sigReady, setSigReady] = useState(false);
  const { query } = useApolloClient();
  const { data: activeProfile } = useActiveProfile();
  const { data: wallet } = useActiveWallet();

  const fetchPublications = useCallback(async () => {
    const response = await query({
      query: gql(getPublicationsQuery),
      fetchPolicy: "no-cache",
      variables: {
        profileId,
      },
    });
    setPublications(response.data.publications.items);
  }, [query, profileId]);

  useEffect(() => {
    if (profileId && tba != ZERO_ADDRESS) {
      fetchPublications();
    }
  }, [profileId, tba, query, fetchPublications]);

  useEffect(() => {
    if (wallet) {
      prepareSig().then(() => setSigReady(true));
    }
  }, [wallet]);

  return (
    <>
      {activeProfile && activeProfile.id === profileId && (
        <CreatePost
          publisher={activeProfile}
          tba={tba}
          fetchPublications={fetchPublications}
        />
      )}
      <div className="space-y-5">
        {publications.length > 0 ? (
          publications?.map((publication) => (
            <Publication
              key={publication.id}
              publication={publication}
              tba={tba}
              sigReady={sigReady}
            />
          ))
        ) : (
          <div className="relative rounded-lg border border-primary p-5 text-sm">
            No posts yet 😔
          </div>
        )}
      </div>
    </>
  );
}
