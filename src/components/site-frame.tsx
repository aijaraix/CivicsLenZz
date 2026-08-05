import React from 'react';

import { useLocation } from 'react-router-dom';
const usePathname = () => useLocation().pathname;
import { MobileTabs, SiteFooter, SiteHeader } from './site-chrome';

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProductSurface = ['/search', '/officials', '/dashboard', '/monitor', '/alerts', '/watchlist', '/petitions', '/promises', '/contact-official', '/activity', '/reports', '/settings', '/sign-in', '/sign-up'].some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const hasMobileTabs = isProductSurface && !['/sign-in', '/sign-up'].some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (isProductSurface) return <>{children}{hasMobileTabs ? <MobileTabs pathname={pathname} /> : null}</>;
  return <><SiteHeader />{children}<SiteFooter /></>;
}
