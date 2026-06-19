# Workshop2 — локальная верификация без Xcode и git

Runtime и тесты не требуют Apple git/Xcode.

## 1. Node + Postgres

```bash
source ~/.nvm/nvm.sh && nvm use 22
cd /Users/petr/Projects/_ai-share/synth-1-full
export WORKSHOP2_DATABASE_URL=postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2
docker compose -f docker-compose.workshop2.yml up -d
npm run db:apply:workshop2-migrations
```

Если MinIO на `:9000` занят — для sample-shop E2E достаточно Postgres на `:5433`.

## 2. Unit (полный green-gate)

```bash
node scripts/workshop2-unit-green.mjs
```

Короткий срез (не полный gate): `npm run test:workshop2:unit`.

## 3. Sample-shop E2E

```bash
bash scripts/ci-workshop2-sample-shop-e2e.sh
```

Или вручную: поднять `dev:e2e`, затем `npm run test:e2e:sample-shop:external`.

## 4. Экспорт без коммита

См. `docs/workshop2-green-export.md` и `/tmp/workshop2-green-export-20260529.tar.gz`.
