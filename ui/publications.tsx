import { ProfileId, usePublications } from "@lens-protocol/react-web";

export function Publications({ profileId }: { profileId: ProfileId }) {
  const { data: publications } = usePublications({ profileId });

  return (
    <div>
      {publications?.map((publication) => (
        <div>publication</div>
      ))}
      <div>Enter</div>
    </div>
  );
}
