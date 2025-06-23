import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-4">
        <h2 className="text-xl font-bold mb-4 text-center">AgentOps</h2>
        <nav>
          <ul className="space-y-2 text-gray-700 dark:text-gray-100">
            <li><a href="/" className="block px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Dashboard</a></li>
            <li><a href="/agents" className="block px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Agents</a></li>
            <li><a href="/tasks" className="block px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Tasks</a></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4 overflow-y-auto">{children}</main>
    </div>
  )
}
