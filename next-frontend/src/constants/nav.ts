export interface IndicatorSubItem {
  title: string;
  href: string;
}

export const INDICATOR_SUB_ITEMS: IndicatorSubItem[] = [
  { title: 'Economy',         href: '/indicators/economy' },
  { title: 'Labor & Income',  href: '/indicators/labor-income' },
  { title: 'Prices & Trade',  href: '/indicators/prices-trade' },
  { title: 'Public Finance',  href: '/indicators/public-finance' },
  { title: 'Social Indicators', href: '/indicators/social' },
];

export interface NavItem {
  title: string;
  href?: string;            // undefined → has dropdown
}

export const NAV_ITEMS: NavItem[] = [
  { title: 'Dashboard', href: '/' },
  { title: 'Indicators' },      // dropdown
  { title: 'Reports',   href: '/reports' },
]; 