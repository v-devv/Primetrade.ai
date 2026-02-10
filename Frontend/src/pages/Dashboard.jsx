import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

const Dashboard = () => {
  const { logout } = useAuth();

  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  const fetchUserName = async () => {
    const { data } = await API.get("/user/profile");
    setUserName(data.name);
  };

  const fetchTasks = async () => {
    const { data } = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchUserName();
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title) return alert("Please enter a task title");

    await createTask({ title });
    setTitle("");
    fetchTasks();
  };

  const handleToggleStatus = async (task) => {
    await updateTask(task._id, {
      status: task.status === "pending" ? "completed" : "pending",
    });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
        logout();
    window.location.href = "/login";
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl text-purple-400 font-bold">Dashboard</h1>
          {userName && (
            <p className="text-m text-gray-600">
              Welcome,
              <span className="font-bold text-black">
                {" "}
                {userName.toUpperCase()}!
              </span>
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleCreateTask} className="mb-6">
        <div className="w-1/2 m-auto border-2 border-gray-300 rounded-lg flex items-center px-4 py-2">
          <input
            type="text"
            placeholder="New task..."
            className="w-full p-2 outline-none border-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button
            type="submit"
            className="bg-lime-500 text-white px-8 rounded-lg hover:bg-lime-600 cursor-pointer py-2"
          >
            Add
          </button>
        </div>
      </form>

      <div className="w-1/2 m-auto border-2 border-gray-300 rounded-lg flex items-center px-4 py-2">
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full p-2 outline-none border-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white w-2/3 m-auto mt-5 px-7 py-5 rounded-2xl shadow flex justify-between items-center"
            >
              <div>
                <p
                  className={`font-medium ${
                    task.status === "completed"
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-gray-400">{task.status}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className="text-sm cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
                >
                  Toggle
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-sm bg-red-500 hover:bg-red-800 cursor-pointer text-white px-5 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
