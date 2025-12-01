import React from 'react';
import {
  TasksProgressCard,
  CardHeader,
  CardTitle,
  Dropdown,
  ChartAndSummaryContainer,
  ChartContainer,
  YAxisLabel,
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
} from './WeeklyTaskGraph.Styles'; // Import styles from the separate file

// Dummy data for the chart and summary
const chartData = [
  { day: 'M', progress: 1.8 }, 
  { day: 'T', progress: 4.0 }, 
  { day: 'W', progress: 3.2 },
  { day: 'T', progress: 1.9 },
  { day: 'F', progress: 2.7 },
  { day: 'S', progress: 3.6 },
  { day: 'S', progress: 1.8 },
];

const summaryData = [
  { label: 'Time spent', value: '18h', percentage: '120%' },
];

const Y_AXIS_MAX = 5; 

const WeeklyTaskGraph = () => {
  return (
    <TasksProgressCard>
      <CardHeader>
        <CardTitle>Tasks Progress</CardTitle>
       <SummarySection>
          {summaryData.map((item) => (
            <SummaryItem key={item.label}>
              <SummaryLabel>{item.label}</SummaryLabel>
              <SummaryValueContainer>
                <SummaryValue>{item.value}</SummaryValue>
                <PercentageTag>{item.percentage}</PercentageTag>
              </SummaryValueContainer>
            </SummaryItem>
          ))}
        </SummarySection>
      </CardHeader>

      <ChartAndSummaryContainer>
        <ChartContainer>
          {/* Chart Bars */}
          {chartData.map((data) => {
            // Calculate bar fill percentage
            const fillPercentage = (data.progress / Y_AXIS_MAX) * 100;
            return (
              <ChartColumn key={data.day}>
                <BarWrapper>
                  <BarFill $percentage={fillPercentage} />
                </BarWrapper>
                <XAxisLabel>{data.day}</XAxisLabel>
              </ChartColumn>
            );
          })}
        </ChartContainer>
      </ChartAndSummaryContainer>
    </TasksProgressCard>
  );
};

export default WeeklyTaskGraph;