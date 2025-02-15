import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DraggableItem from "./DraggableItem";
import AntDesign from "@expo/vector-icons/AntDesign";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function App() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks !== null) {
        const parsedTasks = JSON.parse(storedTasks);
        const sortedTasks = sortTasks(parsedTasks);
        setTasks(sortedTasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const sortTasks = (tasks: Task[]) => {
    return tasks.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });
  };

  const addTask = () => {
    if (task.trim().length > 0) {
      const newTask = {
        id: Date.now().toString(),
        text: task,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      const newTasks = [...tasks, newTask];
      const sortedTasks = sortTasks(newTasks);
      setTasks(sortedTasks);
      saveTasks(sortedTasks);
      setTask("");
    }
  };

  const toggleTask = (id: string) => {
    const newTasks = tasks.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    const sortedTasks = sortTasks(newTasks);
    setTasks(sortedTasks);
    saveTasks(sortedTasks);
  };

  const deleteTask = (id: string) => {
    const newTasks = tasks.filter((item) => item.id !== id);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    const sortedTasks = sortTasks(updatedTasks);
    setTasks(sortedTasks);
    saveTasks(sortedTasks);
  };

  return (
    <View className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 p-8 pt-12">
          <Text className="text-2xl mb-4 font-rethink-bold">Todo List</Text>
          <FlatList
            data={tasks}
            renderItem={({ item, index }) => (
              <DraggableItem
                item={item}
                index={index}
                totalTasks={tasks.length}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onReorder={handleReorder}
              />
            )}
            keyExtractor={(item) => item.id}
            className="flex-1"
          />
          <View className="flex-row mt-4">
            <TextInput
              value={task}
              onChangeText={setTask}
              placeholder="Add a new task"
              className="flex-1 bg-white p-4 rounded-lg mr-2 font-rethink-medium"
            />
            <TouchableOpacity
              onPress={addTask}
              className="bg-blue-500 p-4 flex-row justify-center items-center rounded-full"
            >
              <AntDesign name="plus" size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
