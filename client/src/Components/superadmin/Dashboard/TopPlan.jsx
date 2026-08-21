import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import {
  PlanContainer,
  PlanHeader,
  PlanTitle,
  MonthButton,
  ChartWrapper,
  PlanRow,
  PlanLabel,
  BarArea,
  PlanBar,
  PlanValue,
  TooltipBox,
  TooltipMonth,
  TooltipValue,
} from "./TopPlan.Styles";

const plans = [
  {
    name: "Enterprise",
    value: 2.05,
  },
  {
    name: "PRO",
    value: 1.45,
  },
  {
    name: "Custom",
    value: 2.5,
  },
  {
    name: "Basic",
    value: 0.55,
  },
];

const maxValue = 2.5;

const TopPlan = () => {
  return (
    <PlanContainer>
      <PlanHeader>
        <PlanTitle>Top Plan</PlanTitle>

        <MonthButton>
          <FaCalendarAlt />
          THIS MONTH
        </MonthButton>
      </PlanHeader>

      <ChartWrapper>
        {plans.map((plan) => (
          <PlanRow key={plan.name}>
            <PlanLabel>{plan.name}</PlanLabel>

            <BarArea>
              <PlanBar
                style={{
                  width: `${(plan.value / maxValue) * 100}%`,
                }}
              />
            </BarArea>
          </PlanRow>
        ))}

        <div className="axis-labels">
          <span>0</span>
          <span>SAR 1M</span>
          <span>SAR 1.5M</span>
          <span>SAR 2M</span>
          <span>SAR 2.5M</span>
        </div>

        <TooltipBox>
          <TooltipMonth>July</TooltipMonth>
          <TooltipValue>Custom · SAR 2.5M</TooltipValue>
        </TooltipBox>
      </ChartWrapper>
    </PlanContainer>
  );
};

export default TopPlan;