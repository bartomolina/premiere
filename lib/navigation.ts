export type NavItem = {
  name: string;
  slug: string;
  description?: string;
};

export const navigation: { name: string; items: NavItem[] }[] = [
  {
    name: "General",
    items: [
      {
        name: "Get Items",
        slug: "items",
      },
      {
        name: "Submenu 2",
        slug: "",
      },
      {
        name: "Submenu 3",
        slug: "",
      },
    ],
  },
  {
    name: "Section 2",
    items: [
      {
        name: "Submenu 1",
        slug: "",
      },
    ],
  },
];
