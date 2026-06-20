import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Workshop from "@/pages/Workshop";
import TeacherDashboard from "@/pages/TeacherDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Workshop />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Routes>
    </Router>
  );
}
