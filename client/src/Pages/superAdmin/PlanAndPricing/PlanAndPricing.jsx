import React, { useMemo, useState, useEffect } from "react";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import {
  Container,
  TableCard,
  TableHeader,
  Title,
  TitleUnderline,
} from "./PlanAndPricing.styles";
import { VscFiles } from "react-icons/vsc";
import {
  planColumns,
  planCards,
  mapPlanData,
} from "./planData";
import StatsCards from "../../../Components/ StatsCards/StatsCards";
import PlanCards from "./PlanCards";
import ReusablePagination from "../../../Components/Pagination/ReusablePagination";
import PlanModal from "./modal/PlanModal";
import {
  fetchSubscriptionPlans,
  fetchSubscriptionPlanSummary,
} from "../../../services/superAdminService";
function PlanAndPricing() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
const [view, setView] = useState("table");
const [plans, setPlans] = useState([]);
const [summary, setSummary] = useState({});
const [loading, setLoading] = useState(false);

  const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * rowsPerPage;
  return plans.slice(start, start + rowsPerPage);
}, [plans, currentPage]);
const [isModalOpen, setIsModalOpen] = useState(false);

const [selectedPlan, setSelectedPlan] = useState(null);
const [mode, setMode] = useState("add");

  const totalPages = Math.ceil(plans.length / rowsPerPage);
const handleAddPlan = () => {
  setMode("add");
  setSelectedPlan(null);
  setIsModalOpen(true);
};

const handleEditPlan = (plan) => {
  setMode("edit");
  setSelectedPlan(plan);
  setIsModalOpen(true);
};
useEffect(() => {
  loadPlans();
}, []);

const loadPlans = async () => {
  try {
    setLoading(true);

    const [planRes, summaryRes] = await Promise.all([
      fetchSubscriptionPlans(),
      fetchSubscriptionPlanSummary(),
    ]);

    setPlans(mapPlanData(planRes));

    setSummary(summaryRes);

    // Update stats cards
    // Update stats cards
planCards[0].count = summaryRes.total_plans;
planCards[1].count = "0.00/-"; // Monthly Revenue (for now)
planCards[2].count = `${Number(summaryRes.lowest_plan_amount).toFixed(2)}/-`;
planCards[3].count = `${Number(summaryRes.highest_plan_amount).toFixed(2)}/-`;
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
const handleSavePlan = async () => {
  try {
    setLoading(true);

    // Always reload from backend after add/edit
    const response = await fetchSubscriptionPlans();

    setPlans(mapPlanData(response));

    // Reset to first page after adding/updating
    setCurrentPage(1);

    setIsModalOpen(false);
    setSelectedPlan(null);
    setMode("add");

  } catch (error) {
    console.error("Failed to refresh plans:", error);
  } finally {
    setLoading(false);
  }
};
  return (
    <Container>
      <ReusableHeader
        title="Plans & Pricing"
        breadcrumbs={["Dashboard", "Plans & Pricing"]}
       buttonText="ADD PLAN"
onButtonClick={handleAddPlan}
      />
  <StatsCards cards={planCards} />

 <TableCard>
  <TableHeader>
    <div>
      <Title>
        Plans & Pricing
        <VscFiles
          style={{ cursor: "pointer" }}
          onClick={() =>
            setView(view === "table" ? "card" : "table")
          }
        />
      </Title>
      <TitleUnderline />
    </div>
  </TableHeader>

  {view === "table" ? (
    <ReusableTable
      columns={planColumns}
      data={paginatedData}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  ) : (
<PlanCards
  plans={plans}
  onEdit={handleEditPlan}
/>
  )}
  <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
</TableCard>
<PlanModal
  open={isModalOpen}
  mode={mode}
  initialData={selectedPlan}
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleSavePlan}
/>
    </Container>
  );
}

export default PlanAndPricing;
