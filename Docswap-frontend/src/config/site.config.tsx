import { Metadata } from 'next';
import logoImg from '@public/logo.svg';
import { LAYOUT_OPTIONS } from '@/config/enums';
import logoIconImg from '@public/logo-short.svg';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

export enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export const siteConfig = {
  title: 'DocSwap',
  description: `Marketplace for realtors to exchange documents`,
  logo: logoImg,
  icon: logoIconImg,
  mode: MODE.LIGHT,
  layout: LAYOUT_OPTIONS.HYDROGEN,
  // TODO: favicon
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ? `${title} - DocSwap` : siteConfig.title,
    description,
    openGraph: openGraph ?? {
      title: title ? `${title} Docswap` : title,
      description,
      url: 'https://docswap.ca',
      siteName: 'DocSwap',
      locale: 'en_US',
      type: 'website',
    },
  };
};
