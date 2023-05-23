export type NavItem = {
  name: string;
  slug: string;
  description?: string;
};

export const navigation: { name: string; items: NavItem[] }[] = [
  {
    name: 'General',
    items: [
      {
        name: 'Get Items',
        slug: 'items',
      },
    ],
  },
];
