import React from "react";
import {
  Container,
  LeftSection,
  Greeting,
  Title,
  Description,
  RightSection,
  Summary,
  SummaryTitle,
  ProgressRow,
  Dot,
  Label,
  ProgressBar,
  Progress,
  Count,
  Attendance,
} from "./WelcomeBanner.styles";
import { getGreeting } from "../../../utils/dateUtils";
const WelcomeBanner = () => {
  return (
    <Container>
      <LeftSection>
        <Greeting>{getGreeting()}</Greeting>

        <Title>Welcome back, Admin!</Title>

        <Description>
          Here's what's happening at your company today.
        </Description>
      </LeftSection>

      <RightSection>
        <Summary>
          <SummaryTitle>Today's Summary</SummaryTitle>

          <ProgressRow>
            <Label>
              <Dot color="#22c55e" />
              Check In
            </Label>

            <ProgressBar>
              <Progress width="93%" color="#22c55e" />
            </ProgressBar>

            <Count>230/248</Count>
          </ProgressRow>

          <ProgressRow>
            <Label>
              <Dot color="#f59e0b" />
              On Leave
            </Label>

            <ProgressBar>
              <Progress width="10%" color="#f59e0b" />
            </ProgressBar>

            <Count>24</Count>
          </ProgressRow>
        </Summary>

    
      </RightSection>
    </Container>
  );
};

export default WelcomeBanner;