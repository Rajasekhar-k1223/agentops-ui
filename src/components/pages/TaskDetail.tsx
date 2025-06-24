// src/pages/TaskDetail.tsx
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface Task {
  task_id: string
  agent_id: string
  os_type: string
  command: string
  status: string
  stdout?: string
  stderr?: string
  returncode?: number
  created_at?: string
  updated_at?: string
}

export default function TaskDetail() {
  const { taskId } = useParams()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/task-result/${taskId}`)
        const data = await res.json()
        console.log(data.task)
        setTask(data.task)
      } catch (err) {
        console.error("Error fetching task:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [taskId])

  if (loading) {
    return (
      <Card className="p-6 max-w-4xl mx-auto mt-6">
        <CardContent>
          <Skeleton className="h-6 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
        </CardContent>
      </Card>
    )
  }

  if (!task) {
    return (
      <div className="text-center mt-10 text-red-600">
        Task not found or failed to load.
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-semibold">Task ID: {task.task_id}</h2>
          <div>
            <strong>Agent ID:</strong> {task.agent_id}
          </div>
          <div>
            <strong>OS Type:</strong> {task.os_type}
          </div>
          <div>
            <strong>Status:</strong> {task.status}
          </div>
          <div>
            <strong>Command:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 whitespace-pre-wrap">{task.command}</pre>
          </div>
          <div>
            <strong>Stdout:</strong>
            <pre className="bg-green-50 p-2 rounded mt-1 whitespace-pre-wrap text-sm text-green-800">
              {task.stdout || "No output"}
            </pre>
          </div>
          <div>
            <strong>Stderr:</strong>
            <pre className="bg-red-50 p-2 rounded mt-1 whitespace-pre-wrap text-sm text-red-800">
              {task.stderr || "No errors"}
            </pre>
          </div>
          <div>
            <strong>Return Code:</strong> {task.returncode ?? "N/A"}
          </div>
          <div>
            <strong>Created At:</strong> {task.created_at ?? "N/A"}
          </div>
          <div>
            <strong>Updated At:</strong> {task.updated_at ?? "N/A"}
          </div>
          <Button variant="outline" onClick={() => history.back()}>
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
