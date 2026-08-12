import { BiUser } from "react-icons/bi";
import { CiWallet } from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";

export const getDashboardStats = (data = {}) => [
  {
    id: 1,
    title: "Total Employees",
    value: data.total_employees ?? 0,
    icon: <BiUser />,
    iconBg: "#EEF2FF",
    iconColor: "#4F46E5",
    percentage: `+${data.employee_change_percentage ?? 0}%`,
    percentageColor: "#16A34A",
    description: "Compared to last month",
  },

  {
    id: 2,
    title: "Departments",
    value: data.total_departments ?? 0,
    icon: <FaRegBuilding />,
    iconBg: "#FFF7ED",
    iconColor: "#F97316",
    percentage: `+${data.new_departments ?? 0}`,
    percentageColor: "#F97316",
    description: "New departments",
  },

  {
    id: 3,
    title: "Total Project",
    value: data.total_projects ?? 0,
    icon: <FaRegBuilding />,
    iconBg: "#FFF7ED",
    iconColor: "#F97316",
    percentage: `+${data.new_projects ?? 0}`,
    percentageColor: "#F97316",
    description: "New projects",
  },

  {
    id: 4,
    title: "Leave Requests",
    value: data.pending_leave_requests ?? 0,
    icon: <AiOutlineFileText />,
    iconBg: "#FEF2F2",
    iconColor: "#EF4444",
    percentage: `${data.leave_change_percentage ?? 0}%`,
    percentageColor: "#EF4444",
    description: "Compared to yesterday",
  },

  {
    id: 5,
    title: "Monthly Payroll",
    value: `₹${data.monthly_payroll_amount ?? 0}`,
    icon: <CiWallet />,
    iconBg: "#ECFDF3",
    iconColor: "#10B981",
    percentage: `+${data.payroll_change_percentage ?? 0}%`,
    percentageColor: "#16A34A",
    description: "Compared to last month",
  },

  {
    id: 6,
    title: "Visa",
    value: data.expiry_count ?? 0,
    icon: <AiOutlineFileText />,
    iconBg: "#FEF2F2",
    iconColor: "#EF4444",
    percentage: `${data.expiry_change_percentage ?? 0}%`,
    percentageColor: "#EF4444",
    description: "Compared to yesterday",
  },
];


// ===============================
// Payroll Chart
// ===============================

export const payrollData = [
  {
    month: "Jan",
    salary: 260000,
    incentive: 55000,
    deduction: 50000,
  },
  {
    month: "Feb",
    salary: 190000,
    incentive: 80000,
    deduction: 50000,
  },
  {
    month: "Mar",
    salary: 230000,
    incentive: 65000,
    deduction: 35000,
  },
  {
    month: "Apr",
    salary: 180000,
    incentive: 90000,
    deduction: 45000,
  },
  {
    month: "May",
    salary: 150000,
    incentive: 40000,
    deduction: 100000,
  },
  {
    month: "Jun",
    salary: 190000,
    incentive: 120000,
    deduction: 50000,
  },
  {
    month: "Jul",
    salary: 220000,
    incentive: 130000,
    deduction: 50000,
  },
];


// ===============================
// Reimbursement
// ===============================

export const reimbursementData = [
  {
    name: "Approved",
    value: 110,
    amount: "SAR 14,65",
    color: "#4169E1",
  },
  {
    name: "Paid",
    value: 225,
    amount: "SAR 12,40",
    color: "#16A34A",
  },
  {
    name: "Pending",
    value: 95,
    amount: "SAR 9,25",
    color: "#FDBA2D",
  },
  {
    name: "Rejected",
    value: 48,
    amount: "SAR 4,80",
    color: "#FF2D0A",
  },
];

// ===============================
// Resource Allocation
// ===============================

export const resourceAllocationData = [
  {
    name: "Onsite",
    value: 0,
  },
  {
    name: "Variant",
    value: 3,
  },
  {
    name: "Bench",
    value: 0,
  },
];


// ===============================
// Attendance Trend
// ===============================

export const attendanceData = [
  {
    day: "Mon",
    present: 190,
    absent: 70,
    late: 55,
  },
  {
    day: "Tue",
    present: 195,
    absent: 75,
    late: 55,
  },
  {
    day: "Wed",
    present: 170,
    absent: 90,
    late: 55,
  },
  {
    day: "Thu",
    present: 160,
    absent: 90,
    late: 60,
  },
  {
    day: "Fri",
    present: 165,
    absent: 65,
    late: 75,
  },
  {
    day: "sat",
    present: 100,
    absent: 85,
    late: 50,
  },
  {
    day: "Sun",
    present: 120,
    absent: 80,
    late: 50,
  },
];


// ===============================
// GOSI
// ===============================

export const gosiData = {
  totalEmployee: 248,
  eligibleEmployee: 226,
  contribution: "$22,450",
  companyShare: "$14,200",
  employeeShare: "$8,250",
};


// ===============================
// Employee Engagement
// ===============================

export const engagementData = [
  {
    title: "Upcoming Holiday!",
    date: "20 Jul 2026",
    subtitle: "Second Saturday",
  },
  {
    title: "Upcoming Birthday!",
    date: "20 Jul 2026",
    subtitle: "Second Saturday",
  },
  {
    title: "Upcoming Anniversary!",
    date: "20 Jul 2026",
    subtitle: "Second Saturday",
  },
];