/** Detect iPhone / remote browser hitting dev:core planner APIs. */
export function isRemotePlannerClient(request: Request): boolean {
  const ua = request.headers.get('user-agent') ?? '';
  if (/iPhone|iPad|iPod|Android|Mobile/i.test(ua)) return true;
  const client = request.headers.get('x-syntha-planner-client')?.trim().toLowerCase();
  return client === 'remote' || client === 'mobile';
}

export function plannerAgentRuntimeMode(request: Request): 'local' | 'cloud' {
  const forced = process.env.PLANNER_AGENT_RUNTIME?.trim().toLowerCase();
  if (forced === 'cloud' || forced === 'local') return forced;
  if (isRemotePlannerClient(request) && process.env.PLANNER_AGENT_CLOUD_REPO_URL?.trim()) {
    return 'cloud';
  }
  return 'local';
}
