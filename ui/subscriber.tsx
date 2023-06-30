import { getAvatar } from "@/lib/get-avatar";
import { getProfileName } from "@/lib/get-profile-info";
import { useProfilesOwnedBy } from "@lens-protocol/react-web";
import { ethers } from "ethers";
import Image from "next/image";

export function Subscriber({ subscription }: { subscription: IStream }) {
  const { data: sender } = useProfilesOwnedBy({
    address: subscription.sender,
    limit: 1,
  });

  const flowRate =
    Number.parseFloat(ethers.utils.formatEther(subscription.currentFlowRate)) *
    60 *
    60 *
    24 *
    30;

  if (!sender || sender.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Image
        src={getAvatar(sender[0])}
        alt={sender[0].handle}
        width={40}
        height={40}
        priority
        className="rounded-lg object-cover"
      />
      <div>
        <p className="font-semibold">{getProfileName(sender[0])}</p>
        <p className="text-xs">{flowRate.toFixed(2)} DAI / mo.</p>
      </div>
    </div>
  );
}
