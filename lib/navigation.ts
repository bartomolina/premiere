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
        name: 'First Item',
        slug: 'one',
        description: 'First Item description',
      },
      {
        name: 'Second Item',
        slug: 'two',
        description: 'Second Item description',
      },
    ],
  },
];
