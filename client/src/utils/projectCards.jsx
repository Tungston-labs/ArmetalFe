import {
  PiBriefcase,
  PiCheckCircle,
  PiClock,
  PiWarningCircle,
} from "react-icons/pi";

export const projectCards = [
  {
    title: "Total Projects",
    count: 24,
    icon: <PiBriefcase />,
    iconColor: "#3858C8",
    backgroundColor: "#E8EDFF",
  },
  {
    title: "Completed",
    count: 12,
    icon: <PiCheckCircle />,
    iconColor: "#15AA60",
    backgroundColor: "#E3F7ED",
  },
  {
    title: "In Progress",
    count: 8,
    icon: <PiClock />,
    iconColor: "#FF8B2C",
    backgroundColor: "#FFF1E5",
  },
  {
    title: "Pending",
    count: 4,
    icon: <PiWarningCircle />,
    iconColor: "#E74C3C",
    backgroundColor: "#FFE9E7",
  },
];