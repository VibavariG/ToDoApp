import { useContext } from "react"; 
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom"; 
import TaskList from "../components/TaskList"

function Dashboard() {
  const { token, loading } = useContext(AuthContext);
  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <TaskList />;
}

export default Dashboard;