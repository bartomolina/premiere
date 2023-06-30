import {
  Post,
  ProfileId,
  useActiveWallet,
  useApolloClient,
} from "@lens-protocol/react-web";
import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { getPublicationsQuery } from "@/lib/api";
import { Publication } from "./publication";
import { ZERO_ADDRESS } from "@/lib/constants";

export function Publications({
  profileId,
  tba,
}: {
  profileId: ProfileId;
  tba: `0x${string}`;
}) {
  const [publications, setPublications] = useState<Post[]>([]);
  const { query } = useApolloClient();
  const { data: activeWallet } = useActiveWallet();

  useEffect(() => {
    const fetchPublications = async () => {
      const response = await query({
        query: gql(getPublicationsQuery),
        fetchPolicy: "no-cache",
        variables: {
          profileId,
          observer: activeWallet?.address,
        },
      });
      setPublications(response.data.publications.items);
    };

    if (profileId && tba != ZERO_ADDRESS) {
      fetchPublications();
    }
  }, [profileId, tba]);

  return (
    <div className="space-y-5">
      {publications?.map((publication) => (
        <Publication key={publication.id} publication={publication} tba={tba} />
      ))}
    </div>
  );
}
