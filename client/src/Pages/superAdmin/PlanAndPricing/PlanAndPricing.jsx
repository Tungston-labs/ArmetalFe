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
function PlanAndPricing() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
const [view, setView] = useState("table");
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return planData.slice(start, start + rowsPerPage);
  }, [currentPage]);


    const totalPages = Math.ceil(
        planData.length / rowsPerPage
    );


  return (
    <Container>
      <ReusableHeader
        title="Plans & Pricing"
        breadcrumbs={["Dashboard", "Plans & Pricing"]}
        buttonText="ADD PLAN"
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
    <PlanCards plans={planData} />
  )}
  <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
</TableCard>
    </Container>
  );
}

export default PlanAndPricing;
