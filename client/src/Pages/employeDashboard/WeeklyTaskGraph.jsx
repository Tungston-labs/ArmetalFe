import React from "react";
import {
  TasksProgressCard,
  CardHeader,
  CardTitle,
  ChartAndSummaryContainer,
  ChartContainer,
  ChartColumn,
  BarWrapper,
  BarFill,
  XAxisLabel,
  SummarySection,
  SummaryItem,
  SummaryLabel,
  SummaryValueContainer,
  SummaryValue,
  PercentageTag,
} from "./WeeklyTaskGraph.Styles";

const WeeklyTaskGraph = ({ weeklyData }) => {
  const Y_AXIS_MAX = 10;

  return (
    <TasksProgressCard>
      <CardHeader>
        <CardTitle>Tasks Progress</CardTitle>

        <SummarySection>
          <SummaryItem>
            <SummaryLabel>Weekly Task Hours</SummaryLabel>
            <SummaryValueContainer>
              <SummaryValue>
                {weeklyData.reduce((sum, d) => sum + d.tasksCompleted, 0)}
              </SummaryValue>
            </SummaryValueContainer>
          </SummaryItem>
        </SummarySection>
      </CardHeader>

      <ChartAndSummaryContainer>
        <ChartContainer>
          {weeklyData.map((d, i) => {
            const fillPercent = (d.tasksCompleted / Y_AXIS_MAX) * 100;
            return (
              <ChartColumn key={i}>
                <BarWrapper>
                  <BarFill $percentage={fillPercent} />
                </BarWrapper>
                <XAxisLabel>{d.day.slice(0, 1)}</XAxisLabel>
              </ChartColumn>
            );
          })}
        </ChartContainer>
      </ChartAndSummaryContainer>
    </TasksProgressCard>
  );
};

export default WeeklyTaskGraph;
