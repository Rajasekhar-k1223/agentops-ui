// src/lib/api.ts
export interface Agent {
  agent_id: string;
  os: string | null;
  ip: string | null;
  mac: string | null;
  hostname: string | null;
  vendor: string | null;
  username: string | null;
  status: string | null;
  last_seen: string | null;
}

export async function fetchAgents(): Promise<Agent[]> {
  const response = await fetch("https://agentops-backend-production.up.railway.app/agents");
  if (!response.ok) throw new Error("Failed to fetch agents");
  return await response.json();
}
