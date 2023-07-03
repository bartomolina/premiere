import { IStream } from "@superfluid-finance/sdk-core";
import { useMemo } from "react";

import { Subscriber } from "./subscriber";

export function Subscribers({
  subscriptions,
  tba,
}: {
  tba: `0x${string}`;
  subscriptions: IStream[];
}) {
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(
      (subscription) =>
        subscription.currentFlowRate != "0" &&
        subscription.receiver.toLowerCase() === tba.toLowerCase()
    );
  }, [subscriptions, tba]);

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Subscribers</div>
      {filteredSubscriptions.length > 0 ? (
        filteredSubscriptions.map((subscription) => (
          <Subscriber key={subscription.id} subscription={subscription} />
        ))
      ) : (
        <div className="text-sm font-medium">No subscribers yet 😔</div>
      )}
    </div>
  );
}
