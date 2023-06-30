import { IStream } from "@superfluid-finance/sdk-core";
import { Subscriber } from "./subscriber";

export function Subscribers({
  subscriptions,
  tba,
}: {
  tba: `0x${string}`;
  subscriptions: IStream[];
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Subscribers</div>
      {subscriptions
        .filter(
          (subscription) =>
            subscription.currentFlowRate != "0" &&
            subscription.receiver.toLowerCase() === tba.toLowerCase()
        )
        .map((subscription) => (
          <Subscriber key={subscription.id} subscription={subscription} />
        ))}
    </div>
  );
}
