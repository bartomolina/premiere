import { gql } from "@apollo/client";
import {
  type Post,
  type ProfileId,
  useApolloClient,
} from "@lens-protocol/react-web";
import { useEffect, useState } from "react";

import { getPublicationsQuery } from "@/lib/api";
import { ZERO_ADDRESS } from "@/lib/constants";
import { prepareSig } from "@/lib/lit";

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

  useEffect(() => {
    const fetchPublications = async () => {
      const response = await query({
        query: gql(getPublicationsQuery),
        fetchPolicy: "no-cache",
        variables: {
          profileId,
        },
      });
      setPublications(response.data.publications.items);
    };

    if (profileId && tba != ZERO_ADDRESS) {
      fetchPublications();
    }
  }, [profileId, tba, query]);

  useEffect(() => {
    prepareSig().then(() => setSigReady(true));
  }, []);

  return (
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
  );
}
