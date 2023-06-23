import { type Profile, useProfilesOwnedBy } from "@lens-protocol/react-web";
import { ethers } from "ethers";
import Image from "next/image";

import { SUPERFLUID_STREAM_URL } from "@/lib/constants";
import { getAvatar } from "@/lib/get-avatar";
import { getProfileName } from "@/lib/get-profile-info";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Stream({ stream, profile }: { stream: any; profile: Profile }) {
  const { data: sender } = useProfilesOwnedBy({
    address: stream.sender,
    limit: 1,
  });

  const flowRate =
    Number.parseFloat(ethers.utils.formatEther(stream.currentFlowRate)) *
    60 *
    60 *
    24 *
    30;

  return (
    <div className="flex justify-center">
      <div className="text-center text-sm">
        <a
          className="flex items-center"
          href={`${SUPERFLUID_STREAM_URL}${stream.id}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <div className="w-56 rounded border px-10 py-3 shadow">
            {sender && sender.length > 0 ? (
              <div>
                <Image
                  src={getAvatar(sender[0])}
                  alt={sender[0].handle}
                  width={40}
                  height={40}
                  priority
                  className="mx-auto rounded-lg object-cover"
                />
                {getProfileName(sender[0])}
              </div>
            ) : (
              <>{stream.sender}</>
            )}
          </div>
          <div>
            <Image
              src={"/stream-loop.gif"}
              alt="Superfluid"
              width={92}
              height={48}
              priority
            />
          </div>
          <div className="w-56 rounded border px-10 py-3 shadow">
            <div>
              <Image
                src={getAvatar(profile)}
                alt={profile.handle}
                width={40}
                height={40}
                priority
                className="mx-auto rounded-lg object-cover"
              />
              {getProfileName(profile)}
            </div>
          </div>
        </a>
        <div className="mt-2 font-semibold">
          {flowRate.toFixed(2)} DAI / month
        </div>
      </div>
    </div>
  );
}
