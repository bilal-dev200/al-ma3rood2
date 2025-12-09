"use client";
import React from "react";
import Link from "next/link";
import { useTranslation } from 'react-i18next';

/**
 * Breadcrumbs component
 * @param {Array<{label: string, href?: string}>} items
 * Usage: <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Marketplace', href: '/marketplace' }, { label: 'Category' }]} />
 */
function Breadcrumbs({
  items = [],
  styles = { nav: "flex items-center text-sm text-gray-600" },
}) {
   const { t } = useTranslation();
  if (!items.length) return null;
  return (
    <nav
      className={styles.nav}
      aria-label="Breadcrumb"
    >
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center">
          {item.href && idx !== items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-gray-200 transition-colors"
            >
              {t(item.label)}
            </Link>
          ) : (
            <span className="font-medium">{t(item.label)}</span>
          )}
          {idx < items.length - 1 && <span className="mx-2">|</span>}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
