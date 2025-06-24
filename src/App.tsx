// src/App.tsx
import Layout from "@/components/layout/Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import AgentsPage from "@/components/pages/Agents";
import AgentDetail from "@/components/pages/AgentDetail"
import TaskList from "@/components/pages/TaskList"
import TaskDetail from "@/components/pages/TaskDetail"
import Dashboard from "./components/pages/Dashboard";

function App() {
  return (
    <Layout>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="*" element={<Dashboard />} />
        <Route path="/agent/:agentId" element={<AgentDetail />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/task-result/:taskId" element={<TaskDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
