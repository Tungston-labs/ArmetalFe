import React, { useState } from "react";
import {
  Card,
  Header,
  Title,
  Hours,
  SubTitle,
  BarWrapper,
  BarContainer,
  Bar,
  Day,
  Tooltip
} from "./ProgressCard.styles";

const ProgressCard = () => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const workHours = ["1h", "3h", "2.5h", "2h", "1.5h", "5.22h", "1h"];
  const hoursData = [1, 3, 2.5, 2, 1.5, 5.22, 1]; 
  const [hoverIndex, setHoverIndex] = useState(null);

  const maxHours = Math.max(...hoursData); 
  const maxBarHeight = 100; 

  return (
    <Card>
      <Header>
        <div>
          <Title>Progress</Title>
          <Hours>6.1h</Hours>
          <SubTitle>Work Time this week</SubTitle>
        </div>
      </Header>

      <BarWrapper>
        {days.map((d, i) => {
          const height = (hoursData[i] / maxHours) * maxBarHeight + "px";
          return (
            <BarContainer
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {hoverIndex === i && <Tooltip>{workHours[i]}</Tooltip>}
              <Bar height={height} highlight={i === 5} />
              <Day>{d}</Day>
            </BarContainer>
          );
        })}
      </BarWrapper>
    </Card>
  );
};

export default ProgressCard;
