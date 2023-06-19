import { GetItems } from "@/app/api/items/get-items";
import { Card } from "@/ui/card";

export default async function Page() {
  const items = await GetItems();
  return (
    <div>
      {items.map((item) => (
        <Card key={item.name} item={item} />
      ))}
    </div>
  );
}
