import React, { useEffect, useMemo, useState } from "react";
import {
  PageWrapper,
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
  ButtonAct,
  ButtonContainer,
  DayLabel,
  DayDate,
  DayMonth,
  Header,
  LeftSection,
  BackButton,
  TitleSection,
  IconWrapper,
  TextGroup,
  Title,
  Subtitle,
} from "./FieldInfo.Styles";

import FieldShiftIcon from "../../assets/projecticon.svg";
import TimeTable from "./TimeTable";
// import Navbar from "../../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFieldInfo } from "../../Redux/fieldShiftSlice";
import Modal from "../../Components/ModalShift";
import CalendarModal from "../../Components/CalendarModal";
import { PiUserCirclePlusThin } from "react-icons/pi";
import Loader from "../../Components/Loader";
import EmployeeTitle from "../../Components/EmployeeTitle";
import { getAccessToken } from "../../hooks/useAccessToken";
import { LuArrowLeft } from "react-icons/lu";
import ActivityLogModal from "../../Components/ModalShift";

const FieldInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

    const todayDate = new Date(); // today for comparison
  const todayISO = todayDate.toISOString().split("T")[0];
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [selectedDay, setSelectedDay] = useState(() => {
    const weekdayIndex = todayDate.getDay() === 0 ? 6 : todayDate.getDay() - 1;
    return weekdayIndex;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { fieldInfo, isLoading } = useSelector((state) => state.projects);
      const accessToken = getAccessToken();
  
  useEffect(() => {
    if (id && selectedDate) {
      dispatch(getFieldInfo({ employeeId: id, date: selectedDate }));
    }
  }, [id, selectedDate, dispatch]);

  // Sync selectedDay with selectedDate
  useEffect(() => {
    const dt = new Date(selectedDate);
    const weekdayIndex = dt.getDay() === 0 ? 6 : dt.getDay() - 1;
    setSelectedDay(weekdayIndex);
  }, [selectedDate]);

  const profile = fieldInfo?.employee;
  const sessions = fieldInfo?.sessions || [];

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
useEffect(() => {
    if (id && selectedDate) {
      dispatch(getFieldInfo({ employeeId: id, date: selectedDate }));
    }
  }, [id, selectedDate, dispatch]);

const [hourlyLocationData, setHourlyLocationData] = useState([]);
useEffect(() => {
  if (!id || !selectedDate) return;

  let intervalId;

  const fetchEmployeeLocations = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

      const response = await fetch(
        `http://178.248.112.16:8001/api/background-location/${id}/?date=${formattedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch");

      const json = await response.json();
      setHourlyLocationData(json?.results || []);
    } catch (err) {
      console.error("Error fetching location for date:", err);
    }
  };

  // Fetch immediately once
  fetchEmployeeLocations();

  intervalId = setInterval(fetchEmployeeLocations, 150000);

  return () => clearInterval(intervalId); // cleanup
}, [id, selectedDate]);



  // Generate week days starting from Monday
  const getWeekDays = (baseDate) => {
    const start = new Date(baseDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday start
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

  const days = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  if (isLoading) return <Loader />;

  if (!fieldInfo)
    return <p style={{ textAlign: "center" }}>No field info found.</p>;

  // Helper: disable future dates
  const isFutureDate = (dateISO) => new Date(dateISO) > todayDate;

  // Arrow handlers with future date restriction
  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev.toISOString().split("T")[0]);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    if (!isFutureDate(next.toISOString().split("T")[0])) {
      setSelectedDate(next.toISOString().split("T")[0]);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <PageWrapper>
        {/* Header */}
         <EmployeeTitle
          iconSrc={FieldShiftIcon}
          title="Project"
          subtitle="Manage all Project within the organization"
          showDropdown={false}
          showTabs={false}
          showSearch={false}
          rightElement={
            <>
        <Header>
  <LeftSection>
    <BackButton onClick={() => navigate("/project-department/id")}>
      <LuArrowLeft />
    </BackButton>

    <TitleSection>
      <IconWrapper>
        <img src={FieldShiftIcon} alt="FieldShift" />
      </IconWrapper>
      <TextGroup>
        <Title>Project</Title>
        <Subtitle>Manage all departments within the organization.</Subtitle>
      </TextGroup>
    </TitleSection>
  </LeftSection>

  <ButtonContainer>
    <ButtonAct onClick={() => setIsModalOpen(true)}>
      Activity Log
    </ButtonAct>
  </ButtonContainer>

 {isModalOpen && (
  <ActivityLogModal
    date={selectedDate}
    hourlyLocationData={hourlyLocationData} 
    liveLocationData={[]} 
    onClose={() => setIsModalOpen(false)}
    onDateChange={(newDate) => {
      setSelectedDate(newDate);
      dispatch(getFieldInfo({ employeeId: id, date: newDate }));
    }}
  />
)}

</Header>

          
            </>
          }
        />

        <ContainerGrid>
          {/* Profile Section */}
          <ProfileRow>
            <Avatar>
              {profile?.profile_pic ? (
                <img
                  src={
                    profile.profile_pic.startsWith("http")
                      ? profile.profile_pic
                      : `${import.meta.env.VITE_BASE_URL}${profile.profile_pic}`
                  }
                  alt="avatar"
                />
              ) : (
                <PiUserCirclePlusThin className="default-icon" />
              )}
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
                <strong>{fieldInfo?.monthly_hours_formatted || "00:00"} </strong>
              </SmallRow>
              <SmallRow>
                <span>Total Monthly Working Hours</span>
                <strong>{fieldInfo?.total_working_hours || "00:00"} </strong>
              </SmallRow>
              <SmallRow>
                <span>Weekly Working Hours</span>
                <strong>{fieldInfo?.weekly_hours_formatted || "00:00"} </strong>
              </SmallRow>
            </SummaryCol>

            <DateNav>
              <DateContainer>
                 <IconBtn onClick={handlePrevDay}>{"<"}</IconBtn>
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
                    onClick={() => setIsCalendarOpen(false)}
                  >
                    <div onClick={(e) => e.stopPropagation()}>
                      <CalendarModal
                        onClose={() => setIsCalendarOpen(false)}
                        selectedDate={selectedDate}
                        setSelectedDate={(date) => {
                          if (!isFutureDate(date)) setSelectedDate(date);
                        }}
                      />
                    </div>
                  </div>
                )}

                <DayNumber>{new Date(selectedDate).getDate()}</DayNumber>
                <MonthDay>
                  <div>
                    {new Date(selectedDate).toLocaleString("default", {
                      month: "long",
                    })}
                  </div>
                  <div>
                    {new Date(selectedDate).toLocaleDateString("default", {
                      weekday: "long",
                    })}
                  </div>
                </MonthDay>
              </DateContainer>

              <NavButtons>
               
                <IconBtn onClick={handleNextDay}>{">"}</IconBtn>
              </NavButtons>
            </DateNav>
          </SummaryRow>

          {/* Week Days */}
          <DayTabs>
            {days.map((d, i) => (
              <DayTab
                key={i}
                active={i === selectedDay}
                onClick={() => {
                  if (!isFutureDate(d.fullDate)) {
                    setSelectedDay(i);
                    setSelectedDate(d.fullDate);
                  }
                }}
                aria-pressed={i === selectedDay}
              >
                <DayLabel>{d.label}</DayLabel>
                <DayDate>{d.date}</DayDate>
                <DayMonth>{d.month}</DayMonth>
              </DayTab>
            ))}
          </DayTabs>

          {/* TimeTable */}
          <TimeTable data={formattedSessions} />
        </ContainerGrid>
      </PageWrapper>
    </>
  );
};

export default FieldInfo;
