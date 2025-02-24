"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "../../lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { Input } from "../../Components/ui/input";
import { Button } from "../../Components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "../../Components/ui/select";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "../../Components/ui/table";
import { Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  timestamp: string;
  status: "Not Started" | "Ongoing" | "Completed";
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [page, setPage] = useState(1);
  const tasksPerPage = 6;

  useEffect(() => {
    if (!user) {
      router.push("/");
    } else {
      fetchTasks(false);
    }
  }, [user, router]);

  if (!user)
    return <p className="text-center text-lg font-semibold">Loading...</p>;

  // Fetch tasks with proper pagination
  const fetchTasks = async (nextPage = false) => {
    setLoading(true);

    let q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(tasksPerPage)
    );

    if (nextPage && lastDoc) {
      q = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        startAfter(lastDoc),
        limit(tasksPerPage)
      );
    }

    const querySnapshot = await getDocs(q);
    const tasksData: Task[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];

    setTasks(tasksData);
    setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
    setLoading(false);
  };

  // Add a new task and refresh first page
  const addTask = async () => {
    if (newTask.trim() === "") return;
    const timestamp = new Date().toISOString();

    await addDoc(collection(db, "tasks"), {
      text: newTask,
      timestamp,
      status: "Not Started",
      userId: user.uid,
    });

    setNewTask("");

    // 🔥 Reload first page
    setPage(1);
    fetchTasks(false);
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks(false); // Reload current page after deletion
  };

  // Update task status
  const updateTaskStatus = async (
    id: string,
    newStatus: "Ongoing" | "Completed"
  ) => {
    await updateDoc(doc(db, "tasks", id), { status: newStatus });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
        <Button onClick={logout} variant="default">
          Logout
        </Button>
      </div>

      {/* Main Container */}
      <div className="border border-gray-300 rounded-lg p-8 w-full max-w-5xl bg-white shadow-md flex flex-col min-h-[600px]">
        {/* Task Input */}
        <div className="w-full max-w-4xl flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="w-full"
          />
          <Button onClick={addTask} variant="default">
            Add Task
          </Button>
        </div>

        {/* Task List Table */}
        <div className="flex flex-col flex-grow mt-6">
          <Table className="flex-grow border-separate border-spacing-y-3">
            <TableBody className="space-y-2 ">
              {tasks.map((task) => {
                let bgColor =
                  task.status === "Ongoing"
                    ? "bg-yellow-200"
                    : task.status === "Completed"
                    ? "bg-green-200 line-through"
                    : "bg-gray-200";

                return (
                  <TableRow
                    key={task.id}
                    className={` ${bgColor} hover:${bgColor} rounded-xl shadow-sm`}
                  >
                    <TableCell className="py-3 px-4">{task.text}</TableCell>

                    {/* Task Controls */}
                    <TableCell className="py-3 px-4 flex justify-end gap-4 items-center ">
                      <span className="text-gray-600">
                        {new Date(task.timestamp).toLocaleString()}
                      </span>

                      {/* Status Dropdown */}
                      <Select
                        defaultValue={task.status}
                        onValueChange={(value) =>
                          updateTaskStatus(
                            task.id,
                            value as "Ongoing" | "Completed"
                          )
                        }
                      >
                        <SelectTrigger className="w-32">
                          {task.status}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">
                            Not Started
                          </SelectItem>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Delete Icon */}
                      <Trash2
                        className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => deleteTask(task.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination - Always at Bottom */}
          <div className="flex justify-center items-center mt-auto pt-4 space-x-4">
            <Button
              className="border-transparent hover:border-gray-400"
              variant="outline"
              onClick={() => {
                if (page > 1) {
                  setPage(page - 1);
                  fetchTasks(false);
                }
              }}
              disabled={page === 1}
            >
              Previous
            </Button>

            <div className="flex items-center bg-gray-200 px-4 py-1 rounded-md">
              <span className="text-gray-700 font-semibold">{page}</span>
            </div>

            <Button
              className="border-transparent hover:border-gray-400"
              variant="outline"
              onClick={() => {
                if (lastDoc) {
                  setPage(page + 1);
                  fetchTasks(true);
                }
              }}
              disabled={!lastDoc}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
