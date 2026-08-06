import React from "react";
import {
  CardContainer,
  PlanCard,
  Top,
  PlanName,
  Badge,
  Price,
  Currency,
  Month,
  Description,
  FeatureList,
  Feature,
  EditButton,
} from "./PlanCards.styles";

import { FiCheckCircle } from "react-icons/fi";

const PlanCards = ({ plans }) => {
  return (
    <CardContainer>
      {plans.map((plan, index) => (
        <PlanCard
          key={index}
          orange={plan.plan === "Enterprise"}
        >
          <Top>
            <PlanName>{plan.plan}</PlanName>
            <Badge>{plan.tier}</Badge>
          </Top>

          <Price>
            <Currency>₹</Currency> {plan.price}
            <Month>/ Month</Month>
          </Price>

          <Description>
            Lorem Ipsum is simply dummy text of the printing and
            typesetting.
          </Description>

          <FeatureList>
            <Feature>
              <FiCheckCircle />
              {plan.employees} Employees
            </Feature>

            <Feature>
              <FiCheckCircle />
              Lorem Ipsum is simply dummy text
            </Feature>

            <Feature>
              <FiCheckCircle />
              Lorem Ipsum is simply dummy
            </Feature>

            <Feature>
              <FiCheckCircle />
              Lorem Ipsum is simply dummy text
            </Feature>
          </FeatureList>

          <EditButton>EDIT PLAN</EditButton>
        </PlanCard>
      ))}
    </CardContainer>
  );
};

export default PlanCards;