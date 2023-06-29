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

export function Publications({ profileId }: { profileId: ProfileId }) {
  const [publications, setPublications] = useState<Post[]>([]);
  const { query } = useApolloClient();
  const { data: activeWallet } = useActiveWallet();

  useEffect(() => {
    const fetchPublications = async () => {
      const response = await query({
        query: gql(getPublicationsQuery),
        variables: {
          profileId,
          observer: activeWallet?.address,
        },
      });
      setPublications(response.data.publications.items);
    };

    if (profileId) {
      fetchPublications();
    }
  }, [profileId]);

  return (
    <div className="space-y-5">
      {publications?.map((publication) => (
        <Publication key={publication.id} publication={publication} />
      ))}
    </div>
  );
}
