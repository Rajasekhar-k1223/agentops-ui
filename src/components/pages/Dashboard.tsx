import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts"
import {
  Cpu,
  CheckCircle,
  ShieldAlert,
  Bug,
  BrainCircuit,
  MessageCircleCode,
  Moon,
  Sun,Radar
} from "lucide-react"

const COLORS = ["#22c55e", "#ef4444", "#facc15", "#38bdf8"]

export default function Dashboard() {
  const [stats, setStats] = useState<any>({ agents: 0, tasks: 0, vulnerabilities: 0, malware: 0 })
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [recentTasks, setRecentTasks] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [malwareData, setMalwareData] = useState<any[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [genaiMessage, setGenaiMessage] = useState("")
  const [chatResponse, setChatResponse] = useState("🧠 Waiting for your query...")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentRes, taskRes, metricRes, statusRes, auditRes, vulnRes, malwareRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/agents"),
          fetch("http://127.0.0.1:8000/tasks"),
          fetch("http://127.0.0.1:8000/task-metrics"),
          fetch("http://127.0.0.1:8000/agent-status"),
          fetch("http://127.0.0.1:8000/audit-logs"),
          fetch("http://127.0.0.1:8000/vulnerabilities/agent-1"),
          fetch("http://127.0.0.1:8000/malware-report/agent-1")
        ])

        const agents = await agentRes.json()
        const tasks = await taskRes.json()
        const metrics = await metricRes.json()
        const status = await statusRes.json()
        const audit = await auditRes.json()
        const vulns = await vulnRes.json()
        const malware = await malwareRes.json()

        setStats({
          agents: Array.isArray(agents) ? agents.length : 0,
          tasks: Array.isArray(tasks) ? tasks.length : 0,
          vulnerabilities: Array.isArray(vulns) ? vulns.length : 0,
          malware: Array.isArray(malware) ? malware.length : 0
        })

        setMetrics(Array.isArray(metrics) ? metrics : [
          { date: "2024-06-01", count: 5 },
          { date: "2024-06-02", count: 8 },
          { date: "2024-06-03", count: 3 },
          { date: "2024-06-04", count: 10 }
        ])

        setStatusData([
          { name: "Online", value: status?.online || 3 },
          { name: "Offline", value: status?.offline || 2 }
        ])

        setRecentTasks(Array.isArray(tasks) && tasks.length > 0 ? tasks.slice(0, 5) : [
          { task_id: "t001", command: "sudo apt update" },
          { task_id: "t002", command: "df -h" },
          { task_id: "t003", command: "systemctl status nginx" }
        ])

        setLogs(Array.isArray(audit) && audit.length > 0 ? audit.slice(0, 5) : [
          "Agent agent-1 registered",
          "Task t001 assigned to agent-2",
          "Agent agent-2 reported heartbeat"
        ])

        setMalwareData(Array.isArray(malware) && malware.length > 0 ? malware : [
          { type: "Adware", count: 4 },
          { type: "Trojan", count: 2 },
          { type: "Spyware", count: 3 }
        ])
      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleGenAISubmit = async () => {
    setChatResponse("⏳ Thinking...")
    try {
      const res = await fetch("http://127.0.0.1:8000/genai-suggest-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: genaiMessage })
      })
      const result = await res.json()
      setChatResponse(`🤖 ${result.response || "No suggestion available."}`)
    } catch (err) {
      setChatResponse("❌ Failed to get response from GenAI.")
    }
  }
  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-slate-100 to-white"} space-y-6 p-6 w-full min-h-screen animate-fade-in`}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AgentOps Dashboard</h1>
       <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />} {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
          <Button variant="default" onClick={() => navigate("/network-scan")}>
            <Radar className="w-4 h-4 mr-2" /> Scan Network
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-100 shadow-md animate-fade-up">
          <CardContent className="p-4 flex items-center gap-3">
            <Cpu className="text-blue-600 w-6 h-6 animate-pulse" />
            <div>
              <p className="text-sm text-gray-600">Agents</p>
              <p className="text-xl font-bold text-blue-700">{stats.agents}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-100 shadow-md animate-fade-up delay-75">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600 w-6 h-6 animate-bounce" />
            <div>
              <p className="text-sm text-gray-600">Tasks</p>
              <p className="text-xl font-bold text-green-700">{stats.tasks}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-100 shadow-md animate-fade-up delay-100">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldAlert className="text-yellow-600 w-6 h-6 animate-spin-slow" />
            <div>
              <p className="text-sm text-gray-600">Vulnerabilities</p>
              <p className="text-xl font-bold text-yellow-700">{stats.vulnerabilities}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-100 shadow-md animate-fade-up delay-150">
          <CardContent className="p-4 flex items-center gap-3">
            <Bug className="text-red-600 w-6 h-6 animate-ping" />
            <div>
              <p className="text-sm text-gray-600">Malware</p>
              <p className="text-xl font-bold text-red-700">{stats.malware}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Task Trends</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Agent Status</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Recent Tasks</h2>
            <ul className="text-sm space-y-2">
              {loading ? (
                [...Array(5)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)
              ) : (
                recentTasks.map((task) => (
                  <li key={task.task_id} className="flex justify-between">
                    <span>{task.command?.slice(0, 40)}...</span>
                    <Link to={`/task-result/${task.task_id}`} className="text-blue-600 hover:underline">View</Link>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Audit Logs</h2>
            <ul className="text-sm space-y-1">
              {loading ? (
                [...Array(5)].map((_, i) => <Skeleton key={i} className="h-3 w-3/4" />)
              ) : (
                logs.map((log, i) => <li key={i}>• {log}</li>)
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold mb-2">Malware Report</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={malwareData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-md animate-fade-in-up">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <BrainCircuit className="text-purple-600 w-6 h-6 animate-pulse" />
            <h2 className="font-semibold text-lg">GenAI Insights</h2>
          </div>
          <p className="text-sm text-gray-600">
            "Based on recent patterns, agent-2 could benefit from a memory upgrade. Also, consider automating log rotation for agent-4."
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="default">Summarize</Button>
            <Button size="sm" variant="outline">Suggest Fix</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md animate-fade-in-up">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <MessageCircleCode className="text-indigo-600 w-6 h-6 animate-bounce" />
            <h2 className="font-semibold text-lg">GenAI Assistant</h2>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ask something like: Show tasks for agent-1..."
              className="w-full"
              value={genaiMessage}
              onChange={(e) => setGenaiMessage(e.target.value)}
            />
            <Button onClick={handleGenAISubmit}>Ask</Button>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-sm text-gray-700 dark:text-white">
            {chatResponse}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
// src/components/ui/Dashboard.tsx
// import { useEffect, useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Link } from "react-router-dom"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar
// } from "recharts"
// import {
//   Cpu,
//   CheckCircle,
//   ShieldAlert,
//   Bug,
//   BrainCircuit,
//   MessageCircleCode,
//   Moon,
//   Sun,
//   MonitorSmartphone,
//   Laptop2
// } from "lucide-react"

// const COLORS = ["#22c55e", "#ef4444", "#facc15", "#38bdf8"]

// export default function Dashboard() {
//   const [stats, setStats] = useState<any>({ agents: 0, tasks: 0, vulnerabilities: 0, malware: 0 })
//   const [loading, setLoading] = useState(true)
//   const [metrics, setMetrics] = useState<any[]>([])
//   const [statusData, setStatusData] = useState<any[]>([])
//   const [recentTasks, setRecentTasks] = useState<any[]>([])
//   const [logs, setLogs] = useState<any[]>([])
//   const [malwareData, setMalwareData] = useState<any[]>([])
//   const [darkMode, setDarkMode] = useState(false)
//   const [genaiMessage, setGenaiMessage] = useState("")
//   const [chatResponse, setChatResponse] = useState("🧠 Waiting for your query...")
//   const [registeredAgents, setRegisteredAgents] = useState<any[]>([])
//   const [unregisteredAgents, setUnregisteredAgents] = useState<any[]>([])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [agentRes, taskRes, metricRes, statusRes, auditRes, vulnRes, malwareRes] = await Promise.all([
//           fetch("http://127.0.0.1:8000/agents"),
//           fetch("http://127.0.0.1:8000/tasks"),
//           fetch("http://127.0.0.1:8000/task-metrics"),
//           fetch("http://127.0.0.1:8000/agent-status"),
//           fetch("http://127.0.0.1:8000/audit-logs"),
//           fetch("http://127.0.0.1:8000/vulnerabilities/agent-1"),
//           fetch("http://127.0.0.1:8000/malware-report/agent-1")
//         ])

//         const agents = await agentRes.json()
//         const tasks = await taskRes.json()
//         const metrics = await metricRes.json()
//         const status = await statusRes.json()
//         const audit = await auditRes.json()
//         const vulns = await vulnRes.json()
//         const malware = await malwareRes.json()

//         setStats({
//           agents: Array.isArray(agents) ? agents.length : 0,
//           tasks: Array.isArray(tasks) ? tasks.length : 0,
//           vulnerabilities: Array.isArray(vulns) ? vulns.length : 0,
//           malware: Array.isArray(malware) ? malware.length : 0
//         })

//         setMetrics(Array.isArray(metrics) ? metrics : [
//           { date: "2024-06-01", count: 5 },
//           { date: "2024-06-02", count: 8 },
//           { date: "2024-06-03", count: 3 },
//           { date: "2024-06-04", count: 10 }
//         ])

//         setStatusData([
//           { name: "Online", value: status?.online || 3 },
//           { name: "Offline", value: status?.offline || 2 }
//         ])

//         setRecentTasks(Array.isArray(tasks) && tasks.length > 0 ? tasks.slice(0, 5) : [
//           { task_id: "t001", command: "sudo apt update" },
//           { task_id: "t002", command: "df -h" },
//           { task_id: "t003", command: "systemctl status nginx" }
//         ])

//         setLogs(Array.isArray(audit) && audit.length > 0 ? audit.slice(0, 5) : [
//           "Agent agent-1 registered",
//           "Task t001 assigned to agent-2",
//           "Agent agent-2 reported heartbeat"
//         ])

//         setMalwareData(Array.isArray(malware) && malware.length > 0 ? malware : [
//           { type: "Adware", count: 4 },
//           { type: "Trojan", count: 2 },
//           { type: "Spyware", count: 3 }
//         ])

//         setRegisteredAgents((agents || []).filter((a: any) => a.status === "registered"))
//         setUnregisteredAgents((agents || []).filter((a: any) => a.status === "unregistered"))

//       } catch (error) {
//         console.error("Error loading dashboard:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const handleGenAISubmit = async () => {
//     setChatResponse("⏳ Thinking...")
//     try {
//       const res = await fetch("http://127.0.0.1:8000/genai-suggest-command", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: genaiMessage })
//       })
//       const result = await res.json()
//       setChatResponse(`🤖 ${result.response || "No suggestion available."}`)
//     } catch (err) {
//       setChatResponse("❌ Failed to get response from GenAI.")
//     }
//   }

//   const renderAgentIcon = (os: string) => {
//     if (/win/i.test(os)) return <Laptop2 className="text-blue-500 w-4 h-4 inline-block mr-1" />
//     if (/mac/i.test(os)) return <MonitorSmartphone className="text-gray-500 w-4 h-4 inline-block mr-1" />
//     return <Cpu className="text-gray-400 w-4 h-4 inline-block mr-1" />
//   }

//   return (
//     <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-slate-100 to-white"} space-y-6 p-6 w-full min-h-screen animate-fade-in`}>
//       {/* All cards, charts, tasks, logs, GenAI, etc. */}

//       <Card className="shadow-md animate-fade-in-up">
//         <CardContent className="p-4">
//           <h2 className="font-semibold text-lg mb-3">Registered Agents</h2>
//           <ul className="text-sm space-y-1">
//             {registeredAgents.map((agent: any, i: number) => (
//               <li key={i}>
//                 {renderAgentIcon(agent.os)} {agent.name || `Agent-${i + 1}`} ({agent.os})
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       <Card className="shadow-md animate-fade-in-up">
//         <CardContent className="p-4">
//           <h2 className="font-semibold text-lg mb-3">Unregistered Agents</h2>
//           <ul className="text-sm space-y-1">
//             {unregisteredAgents.map((agent: any, i: number) => (
//               <li key={i}>
//                 {renderAgentIcon(agent.os)} {agent.name || `Agent-${i + 1}`} ({agent.os})
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


// src/components/ui/Dashboard.tsx
// import { useEffect, useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Link } from "react-router-dom"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar
// } from "recharts"
// import {
//   Cpu,
//   CheckCircle,
//   ShieldAlert,
//   Bug,
//   BrainCircuit,
//   MessageCircleCode,
//   Moon,
//   Sun,
//   MonitorSmartphone,
//   Laptop2
// } from "lucide-react"

// const COLORS = ["#22c55e", "#ef4444", "#facc15", "#38bdf8"]

// export default function Dashboard() {
//   const [stats, setStats] = useState<any>({ agents: 0, tasks: 0, vulnerabilities: 0, malware: 0 })
//   const [loading, setLoading] = useState(true)
//   const [metrics, setMetrics] = useState<any[]>([])
//   const [statusData, setStatusData] = useState<any[]>([])
//   const [recentTasks, setRecentTasks] = useState<any[]>([])
//   const [logs, setLogs] = useState<any[]>([])
//   const [malwareData, setMalwareData] = useState<any[]>([])
//   const [darkMode, setDarkMode] = useState(false)
//   const [genaiMessage, setGenaiMessage] = useState("")
//   const [chatResponse, setChatResponse] = useState("🧠 Waiting for your query...")
//   const [registeredAgents, setRegisteredAgents] = useState<any[]>([])
//   const [unregisteredAgents, setUnregisteredAgents] = useState<any[]>([])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [agentRes, taskRes, metricRes, statusRes, auditRes, vulnRes, malwareRes] = await Promise.all([
//           fetch("http://127.0.0.1:8000/agents"),
//           fetch("http://127.0.0.1:8000/tasks"),
//           fetch("http://127.0.0.1:8000/task-metrics"),
//           fetch("http://127.0.0.1:8000/agent-status"),
//           fetch("http://127.0.0.1:8000/audit-logs"),
//           fetch("http://127.0.0.1:8000/vulnerabilities/agent-1"),
//           fetch("http://127.0.0.1:8000/malware-report/agent-1")
//         ])

//         const agents = await agentRes.json()
//         const tasks = await taskRes.json()
//         const metrics = await metricRes.json()
//         const status = await statusRes.json()
//         const audit = await auditRes.json()
//         const vulns = await vulnRes.json()
//         const malware = await malwareRes.json()

//         setStats({
//           agents: Array.isArray(agents) ? agents.length : 0,
//           tasks: Array.isArray(tasks) ? tasks.length : 0,
//           vulnerabilities: Array.isArray(vulns) ? vulns.length : 0,
//           malware: Array.isArray(malware) ? malware.length : 0
//         })

//         setMetrics(Array.isArray(metrics) ? metrics : [
//           { date: "2024-06-01", count: 5 },
//           { date: "2024-06-02", count: 8 },
//           { date: "2024-06-03", count: 3 },
//           { date: "2024-06-04", count: 10 }
//         ])

//         setStatusData([
//           { name: "Online", value: status?.online || 3 },
//           { name: "Offline", value: status?.offline || 2 }
//         ])

//         setRecentTasks(Array.isArray(tasks) && tasks.length > 0 ? tasks.slice(0, 5) : [
//           { task_id: "t001", command: "sudo apt update" },
//           { task_id: "t002", command: "df -h" },
//           { task_id: "t003", command: "systemctl status nginx" }
//         ])

//         setLogs(Array.isArray(audit) && audit.length > 0 ? audit.slice(0, 5) : [
//           "Agent agent-1 registered",
//           "Task t001 assigned to agent-2",
//           "Agent agent-2 reported heartbeat"
//         ])

//         setMalwareData(Array.isArray(malware) && malware.length > 0 ? malware : [
//           { type: "Adware", count: 4 },
//           { type: "Trojan", count: 2 },
//           { type: "Spyware", count: 3 },
//           { type: "Ransomware", count: 1 },
//           { type: "Worm", count: 2 }
//         ])

//         setRegisteredAgents((agents || []).filter((a: any) => a.status === "registered"))
//         setUnregisteredAgents((agents || []).filter((a: any) => a.status === "unregistered"))

//       } catch (error) {
//         console.error("Error loading dashboard:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const handleGenAISubmit = async () => {
//     setChatResponse("⏳ Thinking...")
//     try {
//       const res = await fetch("http://127.0.0.1:8000/genai-suggest-command", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: genaiMessage })
//       })
//       const result = await res.json()
//       setChatResponse(`🤖 ${result.response || "No suggestion available."}`)
//     } catch (err) {
//       setChatResponse("❌ Failed to get response from GenAI.")
//     }
//   }

//   const renderAgentIcon = (os: string) => {
//     if (/win/i.test(os)) return <Laptop2 className="text-blue-500 w-4 h-4 inline-block mr-1" />
//     if (/mac/i.test(os)) return <MonitorSmartphone className="text-gray-500 w-4 h-4 inline-block mr-1" />
//     return <Cpu className="text-gray-400 w-4 h-4 inline-block mr-1" />
//   }

//   return (
//     <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-slate-100 to-white"} space-y-6 p-6 w-full min-h-screen animate-fade-in`}>
//       {/* Cards, charts, logs, GenAI... */}

//       <Card className="shadow-md animate-fade-in-up">
//         <CardContent className="p-4">
//           <h2 className="font-semibold text-lg mb-3">Malware Report</h2>
//           <ResponsiveContainer width="100%" height={250}>
//             <BarChart data={malwareData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="type" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#ef4444" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       {/* Registered Agents */}
//       <Card className="shadow-md animate-fade-in-up">
//         <CardContent className="p-4">
//           <h2 className="font-semibold text-lg mb-3">Registered Agents</h2>
//           <ul className="text-sm space-y-1">
//             {registeredAgents.map((agent: any, i: number) => (
//               <li key={i}>
//                 {renderAgentIcon(agent.os)} {agent.name || `Agent-${i + 1}`} ({agent.os})
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Unregistered Agents */}
//       <Card className="shadow-md animate-fade-in-up">
//         <CardContent className="p-4">
//           <h2 className="font-semibold text-lg mb-3">Unregistered Agents</h2>
//           <ul className="text-sm space-y-1">
//             {unregisteredAgents.map((agent: any, i: number) => (
//               <li key={i}>
//                 {renderAgentIcon(agent.os)} {agent.name || `Agent-${i + 1}`} ({agent.os})
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
