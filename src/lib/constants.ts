import { Genre } from './types';

export const NAV_ITEMS = [
  { href: '/', label: 'トップ' },
  { href: '/genres', label: 'ジャンル' },
  { href: '/search', label: '検索' }
];

export const GENRES: Genre[] = ['fantasy', 'mystery', 'romance', 'sci-fi', 'horror', 'essay', 'other'];
