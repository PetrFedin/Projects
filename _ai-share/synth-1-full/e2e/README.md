# E2E: smoke и a11y

- **smoke.spec.ts** — проверка, что ключевые страницы открываются (HTTP < 500) и отображают контент; проверка клиентского меню.
- **a11y.spec.ts** — базовая доступность: наличие `h1`, доступные имена у кнопок/ссылок, `aria-current` в навигации.

## Запуск

```bash
npm run test:e2e
```

Playwright сам поднимет `npm run dev` и откроет `http://localhost:3000`. В CI можно задать `CI=1`.

## Расширение a11y (axe)

Для проверки по правилам WCAG (контраст, метки форм, ARIA) можно добавить [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright):

```bash
npm i -D @axe-core/playwright
```

В тесте:

```ts
import { AxeBuilder } from '@axe-core/playwright';

const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
expect(results.violations).toEqual([]);
```
