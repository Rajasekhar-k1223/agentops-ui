import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Agent {
  agent_id: string
  os: string
  ip: string
  mac: string
  hostname: string
  vendor: string
  username: string
  status: string
  last_seen: string
}

export default function AgentDetail() {
  const { agentId } = useParams()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://agentops-backend-production.up.railway.app/agent/${agentId}`)
      .then(res => res.json())
      .then(data => {
        setAgent(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [agentId])

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    )
  }

  if (!agent) return <p className="p-4 text-red-500">Agent not found.</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Agent Details</h1>
      <Card>
        <CardContent className="p-4 space-y-2">
          <p><strong>ID:</strong> {agent.agent_id}</p>
          <p><strong>Status:</strong> {agent.status}</p>
          <p><strong>IP:</strong> {agent.ip}</p>
          <p><strong>MAC:</strong> {agent.mac}</p>
          <p><strong>Hostname:</strong> {agent.hostname}</p>
          <p><strong>Vendor:</strong> {agent.vendor}</p>
          <p><strong>OS:</strong> {agent.os}</p>
          <p><strong>Username:</strong> {agent.username}</p>
          <p><strong>Last Seen:</strong> {new Date(agent.last_seen).toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
