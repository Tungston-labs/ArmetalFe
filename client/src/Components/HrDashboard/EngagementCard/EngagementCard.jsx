import React, { useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { PiRocketLaunchLight } from "react-icons/pi";

import Card from "../Common/Card";
import CardHeader from "../Common/CardHeader";
import CalendarModal from "./modal/Calendermodal";

import {
  Container,
  EventCard,
  IconWrapper,
  Content,
  TitleRow,
  Title,
  Date,
  Subtitle,
  CalendarButton,
} from "./EngagementCard.styles";

const EngagementCard = ({ data }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <Card>
      <CardHeader
        title="Employee Engagement"
        control={
          <CalendarButton onClick={() => setIsCalendarOpen(true)}>
            <FiCalendar />
          </CalendarButton>
        }
      />

      <Container>
        {data.map((item, index) => (
          <EventCard key={index}>
            <IconWrapper>
              <PiRocketLaunchLight />
            </IconWrapper>

            <Content>
              <TitleRow>
                <Title>
                  {item.title} <span>🎉</span>
                </Title>

                <Date>{item.date}</Date>
              </TitleRow>

              <Subtitle>{item.subtitle}</Subtitle>
            </Content>
          </EventCard>
        ))}
      </Container>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setIsCalendarOpen(false);
        }}
      />
    </Card>
  );
};

export default EngagementCard;