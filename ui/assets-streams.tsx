import { type Profile } from "@lens-protocol/react-web";
import { Framework, type IStream } from "@superfluid-finance/sdk-core";
import { useCallback, useEffect, useState } from "react";

import { wagmiClient, wagmiNetwork } from "@/lib/wagmi-client";

import { CreateStream } from "./create-stream";
import { Stream } from "./stream";

export function AssetsStreams({
  tba,
  profile,
}: {
  tba: `0x${string}`;
  profile: Profile;
}) {
  const [streams, setStreams] = useState<IStream[]>([]);

  const fetchStreams = useCallback(async () => {
    const sf = await Framework.create({
      chainId: wagmiNetwork.id,
      provider: wagmiClient.provider,
    });

    const pageResult = await sf.query.listStreams(
      { receiver: tba },
      { take: 100 },
      {
        orderBy: "createdAtBlockNumber",
        orderDirection: "desc",
      }
    );

    console.log(pageResult);

    if (pageResult && pageResult.data) {
      setStreams(pageResult.data);
    }
  }, [tba]);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams, tba]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end gap-4">
        <CreateStream tba={tba} />
      </div>
      {streams.some((stream) => stream.currentFlowRate !== "0") ? (
        <>
          {streams
            .filter((stream) => stream.currentFlowRate !== "0")
            .map((stream) => (
              <Stream key={stream.id} stream={stream} profile={profile} />
            ))}
        </>
      ) : (
        <div className="p-10 text-center font-semibold">Nothing to show</div>
      )}
    </div>
  );
}
