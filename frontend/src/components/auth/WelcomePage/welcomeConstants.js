import { Calendar, Users, MessageCircle, Sparkles } from "lucide-react";

// Interest options with icons and descriptions
export const interests = [
  {
    id: "events",
    title: "Participating in events",
    description: "Join local meetups, workshops, and social gatherings",
    icon: Calendar,
    color: "from-purple-500 to-purple-600",
    hoverColor: "from-purple-600 to-purple-700",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
  },
  {
    id: "meeting",
    title: "Meeting new people",
    description: "Connect with like-minded individuals in your area",
    icon: Users,
    color: "from-indigo-500 to-indigo-600",
    hoverColor: "from-indigo-600 to-indigo-700",
    bgColor: "bg-indigo-50",
    textColor: "text-indigo-700",
  },
  {
    id: "chatting",
    title: "Chatting with people",
    description: "Start conversations and build meaningful relationships",
    icon: MessageCircle,
    color: "from-pink-500 to-pink-600",
    hoverColor: "from-pink-600 to-pink-700",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
  },
  {
    id: "exploring",
    title: "Exploring new experiences",
    description: "Discover activities and hobbies you've never tried",
    icon: Sparkles,
    color: "from-emerald-500 to-emerald-600",
    hoverColor: "from-emerald-600 to-emerald-700",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
];

// Simulate checking if username is taken (replace with real API call)
export const checkUsernameAvailability = async (usernameToCheck) => {
  const takenUsernames = ["admin"];

  return new Promise((resolve) => {
    setTimeout(() => {
      const isTaken = takenUsernames.includes(usernameToCheck.toLowerCase());
      resolve(isTaken);
    }, 800);
  });
};