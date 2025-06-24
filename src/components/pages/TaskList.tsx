import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { DataTable } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/button"

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const columns = [
    {
      key: "task_id",
      label: "Task ID",
      render: (value: string) => (
        <Link to={`/task-result/${value}`} className="text-blue-600 underline">
          {value}
        </Link>
      )
    },
    { key: "agent_id", label: "Agent ID" },
    { key: "os_type", label: "OS" },
    { key: "status", label: "Status" },
    {
      key: "command",
      label: "Command",
      render: (val: string) =>
        val.length > 50 ? val.slice(0, 50) + "..." : val
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <Link to={`/task-result/${row.task_id}`}>
          <Button size="sm" variant="outline">
            View
          </Button>
        </Link>
      )
    }
  ]

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("https://agentops-backend-production.up.railway.app/tasks")
        const data = await res.json()
        setTasks(data)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">All Tasks</h1>
        <div className="space-x-2">
          <Link to="/generate-task">
            <Button>Generate Task</Button>
          </Link>
          <Link to="/approve-command">
            <Button variant="outline">Approve</Button>
          </Link>
          <Link to="/assign-command">
            <Button variant="outline">Assign</Button>
          </Link>
        </div>
      </div>

      <DataTable
        data={tasks}
        columns={columns}
        loading={loading}
        showActions={false}
      />
    </div>
  )
}
