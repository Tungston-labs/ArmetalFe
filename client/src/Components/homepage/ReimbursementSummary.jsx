import React from "react";
import {
  MainWrapper,
  LeftChart,
  RightCards,
  CardGrid,
  CardBox,
  Title,
  Count,
  Subtext
} from "./ReimbursementSummary.Styles";

import ReimbursementLineChart from "./ReimbursementLineChart"; 

const ReimbursementSummary = () => {
  return (
    <MainWrapper>
      <LeftChart>
        <ReimbursementLineChart />
      </LeftChart>
      <RightCards>
     <CardGrid>

  <CardBox style={{borderTopColor:"#3352BA"}} >
    <Title>Total Requests</Title>
    <Count>120</Count>
    <Subtext>Overall Request raised</Subtext>
  </CardBox>

  <CardBox  style={{borderTopColor:"#f59e0b"}}>
    <Title>Pending</Title>
    <Count>45</Count>
    <Subtext>Waiting for approval</Subtext>
  </CardBox>

  <CardBox style={{borderTopColor:"#10b981"}}>
    <Title>Verified</Title>
    <Count>60</Count>
    <Subtext>Verified by Accounts</Subtext>
  </CardBox>

  <CardBox style={{borderTopColor:"#ef4444"}} >
    <Title>Rejected</Title>
    <Count>15</Count>
    <Subtext>Rejected due to mismatch</Subtext>
  </CardBox>

</CardGrid>

      </RightCards>

    </MainWrapper>
  );
};

export default ReimbursementSummary;
