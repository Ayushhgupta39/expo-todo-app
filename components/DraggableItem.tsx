import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, {
  LinearTransition,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { formatDate } from "@/utils/helpers";
import Feather from "@expo/vector-icons/Feather";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface DraggableItemProps {
  item: Task;
  index: number;
  totalTasks: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  index,
  totalTasks,
  onToggle,
  onDelete,
  onReorder,
}) => {
  const translateY = useSharedValue(0);
  const isMoving = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isMoving.value = true;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
      const newIndex = Math.max(
        0,
        Math.min(Math.round(index + event.translationY / 60), totalTasks - 1)
      );
      if (newIndex !== index) {
        runOnJS(onReorder)(index, newIndex);
      }
    })
    .onEnd(() => {
      translateY.value = withSpring(0);
      isMoving.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: isMoving.value ? 1 : 0,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        entering={SlideInRight}
        exiting={SlideOutLeft}
        layout={LinearTransition.springify()}
        style={animatedStyle}
        className="flex-row items-center p-4 bg-white mb-2 rounded-lg"
      >
        <TouchableOpacity onPress={() => onToggle(item.id)} className="flex-1">
          <Text
            className={`text-xl font-rethink-medium ${
              item.completed ? "line-through text-gray-400" : "text-black"
            }`}
          >
            {item.text}
          </Text>

          <Text className="text-sm text-gray-500 mt-1 font-rethink">
            {formatDate(item.createdAt)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(item.id)}
          className="ml-4 bg-red-500 p-3 rounded-full flex-row items-center gap-1"
        >
          <Feather name="trash" size={14} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </GestureDetector>
  );
};

export default React.memo(DraggableItem);
