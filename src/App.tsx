// src/App.tsx
import Layout from "@/components/layout/Layout";
import { Routes, Route, Navigate } from "react-router-dom";
import AgentsPage from "@/components/pages/Agents";

function App() {
  return (
    <Layout>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
