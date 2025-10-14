import React, { useEffect, useMemo, useState } from "react";
import {
  PageWrapper,
  Header,
  ProfileRow,
  Avatar,
  ProfileDetails,
  InputRow,
  InfoInput,
  SummaryRow,
  SummaryCol,
  DateNav,
  DayTabs,
  DayTab,
  ContainerGrid,
  SmallRow,
  DateContainer,
  DayNumber,
  MonthDay,
  NavButtons,
  IconBtn,
  CalendarIcon,
  BackButton,
  ButtonAct,
  ButtonContainer,
} from "./FieldInfo.Styles";
import { LuArrowLeft } from "react-icons/lu";
import FieldShiftIcon from "../../assets/shifttopper.svg";
import TimeTable from "./TimeTable";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  IconWrapper,
  Subtitle,
  TextGroup,
  Title,
  TitleSection,
} from "./FieldShift.Styles";
import Navbar from "../../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFieldInfo } from "../../Redux/fieldShiftSlice";
import Modal from "../../Components/ModalShift";
import CalendarModal from "../../Components/CalendarModal";

const FieldInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { fieldInfo, isLoading } = useSelector((state) => state.projects);

  useEffect(() => {
    if (id && selectedDate) {
      dispatch(getFieldInfo({ employeeId: id, date: selectedDate }));
    }
  }, [id, selectedDate, dispatch]);

  const profile = fieldInfo?.employee;
  const sessions = fieldInfo?.sessions || [];

  // Format session times
  const formattedSessions = useMemo(
    () =>
      sessions.map((s) => ({
        timeIn: new Date(s.time_in).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timeOut: s.time_out
          ? new Date(s.time_out).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Ongoing",
        location: s.punch_in_location || "No location info",
        note: s.note || "",
      })),
    [sessions]
  );

  const getWeekDays = (baseDate) => {
    const start = new Date(baseDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push({
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        month: d.toLocaleDateString("en-US", { month: "short" }),
        fullDate: d.toISOString().split("T")[0],
      });
    }
    return week;
  };

  const days = getWeekDays(selectedDate);

  if (isLoading)
    return <p style={{ textAlign: "center" }}>Loading attendance info...</p>;

  if (!fieldInfo)
    return <p style={{ textAlign: "center" }}>No field info found.</p>;

  return (
    <>
      <Navbar />
      <PageWrapper>
        {/* Header */}
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <LuArrowLeft />
          </BackButton>

          <TitleSection>
            <IconWrapper>
              <img src={FieldShiftIcon} alt="FieldShift" />
            </IconWrapper>
            <TextGroup>
              <Title>FieldShift</Title>
              <Subtitle>
                Manage all departments within the organization.
              </Subtitle>
            </TextGroup>
          </TitleSection>
          <ButtonContainer>
            <ButtonAct onClick={() => setIsModalOpen(true)}>
              Activity Log
            </ButtonAct>
          </ButtonContainer>

          {isModalOpen && (
            <Modal
              onClose={() => setIsModalOpen(false)}
              data={fieldInfo?.locations || []}
              date={selectedDate}
            />
          )}
        </Header>

        <ContainerGrid>
          <ProfileRow>
            <Avatar>
              <img
                src={
                  profile?.profile_pic
                    ? `${profile.profile_pic}`
                    : "https://i.pravatar.cc/150"
                }
                alt="avatar"
              />
            </Avatar>

            <ProfileDetails>
              <InputRow>
                <div className="left-column">
                  <InfoInput value={profile?.name || ""} readOnly />
                  <InfoInput value={profile?.employee_id || ""} readOnly />
                  <InfoInput value={profile?.email || ""} readOnly />
                </div>

                <div className="right-column">
                  <InfoInput value={profile?.designation || ""} readOnly />
                  <div className="dual-inputs">
                    <InfoInput
                      value={
                        profile?.joining_date
                          ? new Date(profile.joining_date).toLocaleDateString()
                          : ""
                      }
                      readOnly
                    />
                    <InfoInput value={profile?.gender || ""} readOnly />
                  </div>
                </div>
              </InputRow>
            </ProfileDetails>
          </ProfileRow>

          {/* Summary Section */}
          <SummaryRow>
            <SummaryCol>
              <SmallRow>
                <span>Monthly Working Hours</span>
                <strong>{fieldInfo?.monthly_hours_formatted || "00:00"}</strong>
              </SmallRow>
              <SmallRow>
                <span>Total Monthly Working Hours</span>
                <strong>{fieldInfo?.total_working_hours || "00:00"}</strong>
              </SmallRow>
              <SmallRow>
                <span>Weekly Working Hours</span>
                <strong>{fieldInfo?.weekly_hours_formatted || "00:00"}</strong>
              </SmallRow>
            </SummaryCol>

            <DateNav>
              <DateContainer>
                <CalendarIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsCalendarOpen(true)}
                />
                {isCalendarOpen && (
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      background: "rgba(0, 0, 0, 0.4)",
                      backdropFilter: "blur(5px)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 999,
                    }}
                  >
                    <CalendarModal
                      onClose={() => setIsCalendarOpen(false)}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                  </div>
                )}

                <DayNumber>
                  {fieldInfo?.date
                    ? new Date(fieldInfo.date).getDate()
                    : new Date(selectedDate).getDate()}
                </DayNumber>
                <MonthDay>
                  <div>
                    {fieldInfo?.date
                      ? new Date(fieldInfo.date).toLocaleString("default", {
                          month: "long",
                        })
                      : new Date(selectedDate).toLocaleString("default", {
                          month: "long",
                        })}
                  </div>
                  <div>
                    {fieldInfo?.date
                      ? new Date(fieldInfo.date).toLocaleDateString("default", {
                          weekday: "long",
                        })
                      : new Date(selectedDate).toLocaleDateString("default", {
                          weekday: "long",
                        })}
                  </div>
                </MonthDay>
              </DateContainer>

              <NavButtons>
                <IconBtn
                  onClick={() => {
                    const prev = new Date(selectedDate);
                    prev.setDate(prev.getDate() - 1);
                    setSelectedDate(prev.toISOString().split("T")[0]);
                  }}
                >
                  {"<"}
                </IconBtn>

                <IconBtn
                  onClick={() => {
                    const next = new Date(selectedDate);
                    next.setDate(next.getDate() + 1);
                    setSelectedDate(next.toISOString().split("T")[0]);
                  }}
                >
                  {">"}
                </IconBtn>
              </NavButtons>
            </DateNav>
          </SummaryRow>

          <DayTabs>
            {days.map((d, i) => (
              <DayTab
                key={i}
                active={i === selectedDay}
                onClick={() => {
                  setSelectedDay(i);
                  setSelectedDate(days[i].fullDate);
                }}
                aria-pressed={i === selectedDay}
              >
                <div style={{ fontWeight: 700 }}>{d.label}</div>
                <div style={{ fontSize: 12 }}>{d.date}</div>
                <div style={{ fontSize: 12 }}>{d.month}</div>
              </DayTab>
            ))}
          </DayTabs>

          <TimeTable data={formattedSessions} />
        </ContainerGrid>
      </PageWrapper>
    </>
  );
};

export default FieldInfo;
