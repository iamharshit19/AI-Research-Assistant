import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UploadPaper from "./pages/UploadPaper";
import ScholarResearch from "./pages/ScholarResearch";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPaper />} />
          <Route path="/scholar" element={<ScholarResearch />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
