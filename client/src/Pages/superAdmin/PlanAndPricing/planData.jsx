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
    sortable: false,
    render: (row) => {
      if (!row.features?.length) {
        return "No features";
      }

      return row.features
        .map((feature) => feature.name)
        .join(", ");
    },
  },
  {
    header: "Status",
    accessor: "status",
  },
];

export const mapPlanData = (plans = []) => {
  return plans.map((plan) => ({
    // Original API fields
    id: plan.id,
    name: plan.name,
    plan_type: plan.plan_type,
    description: plan.description,
    base_price: plan.base_price,
    employee_limit: plan.employee_limit,
    extra_employee_price: plan.extra_employee_price,
    is_active: plan.is_active,
    status: plan.status,
    feature_count: plan.feature_count,
    features: plan.features || [],
    created_at: plan.created_at,
    updated_at: plan.updated_at,

    // Table fields
    plan: plan.name,
    tier: plan.plan_type,
    employeeLimit: plan.employee_limit,
    priceText: `₹${plan.base_price}/-`,
    extra: `₹${plan.extra_employee_price}/-`,

    // Card fields
    price: plan.base_price,
    featureList: plan.features || [],

    // Keep original API object for edit
    raw: plan,
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