import React from "react";
import {
  Wrapper,
  Card,
  IconWrapper,
  Content,
  Count,
  Title,
} from "./StatsCards.styles";

const StatsCards = ({ cards = [] }) => {
  return (
    <Wrapper>
      {cards.map((card, index) => (
        <Card key={index} onClick={card.onClick}>
          <IconWrapper
            bg={card.backgroundColor}
            color={card.iconColor}
          >
            {card.icon}
          </IconWrapper>

          <Content>
            <Count>{card.count}</Count>
            <Title>{card.title}</Title>
          </Content>
        </Card>
      ))}
    </Wrapper>
  );
};

export default StatsCards;