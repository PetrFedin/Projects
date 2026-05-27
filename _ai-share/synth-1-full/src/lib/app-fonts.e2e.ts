/**
 * E2E stub — без next/font/google (нет сетевых запросов при cold compile).
 * Активируется через E2E=true + webpack alias в next.config.ts.
 */
export const bodyFont = {
  className: 'font-sans antialiased',
  variable: '--font-body',
};

export const codeFont = {
  variable: '--font-code',
};

export const logoFont = {
  variable: '--font-logo',
};

export const fontVariables = `${bodyFont.variable} ${codeFont.variable} ${logoFont.variable}`;
export const bodyClassName = bodyFont.className;
