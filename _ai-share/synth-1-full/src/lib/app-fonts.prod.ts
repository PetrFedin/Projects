import { Fira_Code, Fira_Sans, Playfair_Display } from 'next/font/google';

/** next/font требует литералы в `subsets`; выбор dev/prod — через два экземпляра. */
const firaSansLatin = Fira_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const firaSansLatinCyrillic = Fira_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-body',
});

export const bodyFont =
  process.env.NODE_ENV === 'development' ? firaSansLatin : firaSansLatinCyrillic;

export const codeFont = Fira_Code({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-code',
});

const playfairLatin = Playfair_Display({
  weight: ['600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-logo',
});

const playfairLatinCyrillic = Playfair_Display({
  weight: ['600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-logo',
});

export const logoFont =
  process.env.NODE_ENV === 'development' ? playfairLatin : playfairLatinCyrillic;

export const fontVariables = `${bodyFont.variable} ${codeFont.variable} ${logoFont.variable}`;
export const bodyClassName = bodyFont.className;
