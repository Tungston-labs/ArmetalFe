import React from "react";
import {
  SummaryWrapper,
  SummaryCard,
  SummaryLabel,
  SummaryValue,
} from "../../Pages/finance/FinancePage.Styles";

const FinanceSummary = ({ income = 0, expense = 0 }) => {
  const net = income - expense;

  const diffPercent =
    expense === 0 ? (income === 0 ? 0 : 100) : (net / expense) * 100;

  const formatAmount = (val) =>
    Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <SummaryWrapper>
      <SummaryCard>
        <SummaryLabel>Total Income</SummaryLabel>
        <SummaryValue>₹ {formatAmount(income)}</SummaryValue>
      </SummaryCard>

      <SummaryCard>
        <SummaryLabel>Total Expense</SummaryLabel>
        <SummaryValue>₹ {formatAmount(expense)}</SummaryValue>
      </SummaryCard>

      <SummaryCard>
        <SummaryLabel>Net Asset</SummaryLabel>
        <SummaryValue style={{ color: net >= 0 ? "#0b6623" : "#b91c1c" }}>
          ₹ {formatAmount(net)}
        </SummaryValue>
      </SummaryCard>

      <SummaryCard>
        <SummaryLabel>Cash Balance</SummaryLabel>
        <SummaryValue>
          {Number.isFinite(diffPercent)
            ? `${diffPercent.toFixed(2)}`
            : "0.00%"}
        </SummaryValue>
      </SummaryCard>
    </SummaryWrapper>
  );
};

export default FinanceSummary;
