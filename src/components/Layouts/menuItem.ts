import { MenuItemType } from '@paljs/ui/types';

const items: MenuItemType[] = [
  {
    title: '홈',
    group: true,
  },
  {
    title: '회원',
    icon: { name: 'person-outline' },
    children: [
      {
        title: '회원',
        link: { href: '/users' },
      },
    ],
  },
];

export default items;
