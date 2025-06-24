// src/pages/Agents.tsx
import { useEffect, useState } from "react";
import { fetchAgents, Agent } from "@/components/lib/api";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents()
      .then(data => setAgents(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "agent_id", label: "Agent ID" },
    { key: "ip", label: "IP Address" },
    { key: "os", label: "OS" },
    { key: "status", label: "Status" },
    { key: "last_seen", label: "Last Seen" }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agents</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable data={agents} columns={columns} showActions={true}/>
      )}
    </div>
  );
}
