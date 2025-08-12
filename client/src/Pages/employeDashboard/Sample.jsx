import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Container,
  TopSection,
  LeftColumn,
  SvgImage,
  ProfileCard,
  RightColumn,
  InfoGrid,
  InfoCard,
  TimeTrackingCard,
  TaskSection,
  TaskTitle,
  TaskItem,
  TaskMeta,
  TaskText,
} from "./Sample.Styles";
import InCompanyIcon from "../../assets/clock.svg";
import SalaryIcon from "../../assets/salary.svg";
import PendingIcon from "../../assets/pending.svg";
import LeaveIcon from "../../assets/leave.svg";
import TimeIcon from "../../assets/time.svg";
import { FaEdit } from "react-icons/fa";
import { fetchEmployeeDash } from "../../Redux/authSlice";
import { useParams } from "react-router-dom";
// import Employeedashboard from "./Employeedashboard"
const Dashboard = () => {
  const { employeeId } = useParams();
  console.log("Employee ID from route:", employeeId);

  const dispatch = useDispatch();
  const { employeeDashData, loadingEmployeeDash, employeeDashError } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeDash(employeeId));
      console.log("first in last out", fetchEmployeeDash(employeeId));
    }
  }, [employeeId, dispatch]);

  if (loadingEmployeeDash) return <p>Loading...</p>;
  if (employeeDashError) return <p>Error: {employeeDashError}</p>;
  return (
    <>
      <Container>
        <TopSection>
          <LeftColumn>
            <ProfileCard>
              <div className="image-wrapper">
                <img
                  src="https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE="
                  alt="profile"
                />
                <FaEdit className="edit-icon" />
              </div>

              <div className="details">
                <p>
                  Name{" "}
                  <strong>
                    {employeeDashData?.bank_details?.employee?.name || "-"}
                  </strong>
                </p>
                <br />
                <p>
                  Position{" "}
                  <strong>
                    {employeeDashData?.bank_details?.employee?.designation ||
                      "-"}
                  </strong>
                </p>
                <br />
                <p>
                  Joined on{" "}
                  <strong>
                    {employeeDashData?.bank_details?.employee?.joining_date
                      ? new Date(
                          employeeDashData.bank_details.employee.joining_date
                        ).toLocaleDateString(
                          "en-GB", // DD/MM/YYYY format
                          { day: "numeric", month: "long", year: "numeric" }
                        )
                      : "-"}
                  </strong>
                </p>
              </div>
            </ProfileCard>
          </LeftColumn>

          <RightColumn>
            <InfoGrid>
              <InfoCard>
                <h3>{employeeDashData?.company_days}</h3>
                <p>Days</p>
                <button>
                  <SvgImage src={InCompanyIcon} alt="icon" />
                  In Company
                </button>
              </InfoCard>

              <InfoCard>
                <h3>{employeeDashData?.bank_details?.basic_salary}</h3>
                <p>Salary</p>
                <button>
                  <SvgImage src={SalaryIcon} alt="icon" />
                  Salary
                </button>
              </InfoCard>
              <InfoCard>
                <h3>{employeeDashData?.leave_summary?.pending_leave}</h3>
                <p>Pending leave</p>
                <button>
                  <SvgImage src={PendingIcon} alt="icon" />
                  Pending leave
                </button>
              </InfoCard>
              <InfoCard>
                <h3>{employeeDashData?.leave_summary?.leave_taken}</h3>
                <p>Leaves Taken</p>
                <button>
                  <SvgImage src={LeaveIcon} alt="icon" />
                  Leave
                </button>
              </InfoCard>
            </InfoGrid>

            <TimeTrackingCard>
              <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <img
                  src={TimeIcon}
                  alt="clock icon"
                  style={{
                    width: "18px",
                    height: "20px",
                    fontFamily: "Raleway",
                  }}
                />
                Time tracking
              </h4>

              <p
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "Satoshi",
                }}
              >
                Monthly days: <strong>28</strong>
              </p>

              <p style={{ display: "flex", justifyContent: "space-between" }}>
                Total working Hour: <strong>121</strong>
              </p>
              <hr></hr>
              <a href="/">Total working Hour</a>
            </TimeTrackingCard>
          </RightColumn>
        </TopSection>

        <TaskTitle>Daily Task List</TaskTitle>

        <TaskSection>
  {loadingEmployeeDash ? (
    <p>Loading tasks...</p>
  ) : employeeDashData?.daily_tasks?.length > 0 ? (
    employeeDashData.daily_tasks.map((task, idx) => (
      <TaskItem key={idx}>
        <TaskMeta>
          <span>{new Date(task.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
          <strong>
            {task.time_taken} hrs
          </strong>
        </TaskMeta>
        <TaskText>
          <h5>{task.project}</h5>
          <p>{task.task}</p>
        </TaskText>
        <a href="/">↗</a>
      </TaskItem>
    ))
  ) : (
    <p>No tasks found</p>
  )}
</TaskSection>
      </Container>
      {/* <Employeedashboard /> */}
    </>
  );
};

export default Dashboard;
