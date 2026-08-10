import {
  BiMessageSquareDetail,
} from "react-icons/bi";

export const planColumns = [
  {
    header: "Plan Name",
    accessor: "plan",
  },
  {
    header: "Tier",
    accessor: "tier",
  },
  {
    header: "Employee Limit",
    accessor: "employeeLimit",
  },
  {
    header: "Price / Month",
    accessor: "priceText",
  },
  {
    header: "Extra Employee Charge",
    accessor: "extra",
  },
  {
    header: "Features",
    accessor: "features",
  },
  {
    header: "Status",
    accessor: "status",
  },
];

export const mapPlanData = (plans) => {
  return plans.map((item) => ({
    id: item.id,
    plan: item.name,
    tier: item.plan_type,
    employeeLimit: item.employee_limit,
    price: item.base_price,
    priceText: `₹${item.base_price}`,
    extra: `₹${item.extra_employee_price}`,
    features: `${item.feature_count} Features`,
    status: item.status,
    raw: item,
  }));
};

export const planCards = [
  {
    title: "Total Plans",
    count: "0",
    icon: <BiMessageSquareDetail />,
    backgroundColor: "#E8EDFF",
    iconColor: "#4F6EF7",
  },
  {
    title: "Monthly Revenue",
    count: "0.00/-",
    icon: <BiMessageSquareDetail />,
    backgroundColor: "#FFF2E1",
    iconColor: "#F59E0B",
  },
  {
    title: "Lowest Plan",
    count: "0.00/-",
    icon: <BiMessageSquareDetail />,
    backgroundColor: "#E7F8EC",
    iconColor: "#22C55E",
  },
  {
    title: "Highest Plan",
    count: "0.00/-",
    icon: <BiMessageSquareDetail />,
    backgroundColor: "#FFE8E8",
    iconColor: "#EF4444",
  },
];