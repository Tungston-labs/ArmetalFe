import React, { useMemo, useState } from "react";
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
import { planColumns, planData,planCards } from "./planData";
import StatsCards from "../../../Components/ StatsCards/StatsCards";
import PlanCards from "./PlanCards";
import ReusablePagination from "../../../Components/Pagination/ReusablePagination";
import PlanModal from "./modal/PlanModal";
function PlanAndPricing() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
const [view, setView] = useState("table");
const [plans, setPlans] = useState(planData);

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

const handleSavePlan = (formData) => {
  if (mode === "add") {
    const newPlan = {
      id: Date.now(),
      ...formData,
      priceText: `₹${formData.price}/-`,
      extra: formData.extraCharge,
      status: "Active",
    };

    setPlans((prev) => [...prev, newPlan]);
  } else {
    setPlans((prev) =>
      prev.map((item) =>
        item.id === selectedPlan.id
          ? {
              ...item,
              ...formData,
              priceText: `₹${formData.price}/-`,
              extra: formData.extraCharge,
            }
          : item
      )
    );
  }

  setIsModalOpen(false);
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
      totalPages={Math.ceil(planData.length / rowsPerPage)}
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
