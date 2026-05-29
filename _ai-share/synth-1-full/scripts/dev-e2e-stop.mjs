#!/usr/bin/env node
/**
 * Wave 58 ops: освободить порт E2E dev (PLAYWRIGHT_E2E_PORT, default 3123).
 * macOS: lsof + kill -9. Без git clean / blanket reset.
 */
import { execSync } from 'node:child_process';

const port = String(process.env.PLAYWRIGHT_E2E_PORT ?? '3123').trim();

function killPortListeners() {
  try {
    const out = execSync(`lsof -ti :${port}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    if (!out) {
      console.log(`[dev-e2e-stop] port :${port} already free`);
      return 0;
    }
    let killed = 0;
    for (const raw of out.split(/\s+/)) {
      const pid = Number(raw);
      if (pid > 0) {
        try {
          process.kill(pid, 'SIGKILL');
          killed += 1;
        } catch {
          /* already gone */
        }
      }
    }
    console.log(`[dev-e2e-stop] killed ${killed} listener(s) on :${port}`);
    return killed;
  } catch {
    console.log(`[dev-e2e-stop] port :${port} already free (no lsof listeners)`);
    return 0;
  }
}

killPortListeners();
