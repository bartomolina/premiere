import type { Item } from "@/app/api/items/item";

export function Card({ item }: { item: Item }) {
  return <div>{item.name}</div>;
}
