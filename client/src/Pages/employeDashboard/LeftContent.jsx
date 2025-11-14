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
  Details,
  ImageWrapper,
  ProfileCardWrapper,
  TitleRow,
  Row,
} from "./LeftContent.Styles";
import InCompanyIcon from "../../assets/clock.svg";
import SalaryIcon from "../../assets/salary.svg";
import PendingIcon from "../../assets/pending.svg";
import LeaveIcon from "../../assets/leave.svg";
import TimeIcon from "../../assets/time.svg";
import { FaEdit } from "react-icons/fa";
import { fetchEmployeeDash } from "../../Redux/authSlice";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const LeftContent = () => {
  const { employeeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const { employeeDashData, loadingEmployeeDash, employeeDashError } =
    useSelector((state) => state.auth);

  const BASE_URL = "http://178.248.112.16:8001";

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeDash(employeeId));
    }
  }, [employeeId, dispatch]);

  if (loadingEmployeeDash) return <p>Loading...</p>;
  if (employeeDashError) return <p>Error: {employeeDashError}</p>;

  const employee = employeeDashData || {};

  return (
    <Container>
      <TopSection>
        {/* ---------------- Left Column ---------------- */}
        <LeftColumn>
          <ProfileCardWrapper>
            <ImageWrapper>
              <img
                src={
                  employee.profile_pic
                    ? `${BASE_URL}${employee.profile_pic}`
                    : "https://via.placeholder.com/120"
                }
                alt="profile"
              />
              <FaEdit
                className="edit-icon"
                onClick={() =>
                  navigate(`/ViewBasic/${employeeId}`, {
                    state: { from: "fulldashboard", employeeId },
                  })
                }
              />
            </ImageWrapper>

            <Details>
              <p>
                Name: <strong>{employee.name || "-"}</strong>
              </p>

              <p>
                Position: <strong>{employee.designation || "-"}</strong>
              </p>

              <p>
  Email:{" "}
  <strong>
    {employee.email ? employee.email : "-"}
  </strong>
</p>
            </Details>
          </ProfileCardWrapper>
        </LeftColumn>

        {/* ---------------- Right Column ---------------- */}
        <RightColumn>
          <InfoGrid>
            <InfoCard>
              <h3>{employee.joining_date || 0}</h3>
              <p>{employee.company_days || 0} Days</p>
              <button>
                <SvgImage src={InCompanyIcon} alt="icon" />
                 Joined on
              </button>
            </InfoCard>

            <InfoCard>
              <h3>
                {employee.bank_details?.basic_salary
                  ? `${employee.bank_details.basic_salary}`
                  : "-"}
              </h3>
              <p>Salary</p>
              <button>
                <SvgImage src={SalaryIcon} alt="icon" />
                Salary
              </button>
            </InfoCard>

            <InfoCard>
              <h3>{employee.leave_summary?.pending_leave || 0}</h3>
              <p>Pending Leave</p>
              <button>
                <SvgImage src={PendingIcon} alt="icon" />
                Pending Leave
              </button>
            </InfoCard>

            <InfoCard>
              <h3>{employee.leave_summary?.leave_taken || 0}</h3>
              <p>Leaves Taken</p>
              <button>
                <SvgImage src={LeaveIcon} alt="icon" />
                Leave
              </button>
            </InfoCard>
          </InfoGrid>

          {/* -------- Time Tracking Card -------- */}
          <TimeTrackingCard>
            <TitleRow>
              <img src={TimeIcon} alt="clock icon" />
              <span>Time Tracking</span>
            </TitleRow>

            <Row>
              <span>Monthly Days:</span>
              <strong>{employee.attendance_summary?.monthly_days || 0}</strong>
            </Row>

            <Row>
              <span>Weekly Working Hour:</span>
              <strong>
                {employee.attendance_summary?.weekly_working_hours || "00:00"}
              </strong>
            </Row>

            <hr />

            <Row>
              <span>Total Working Hour:</span>
              <strong>
                {employee.attendance_summary?.monthly_working_hours || "00:00"}
              </strong>
            </Row>
          </TimeTrackingCard>
        </RightColumn>
      </TopSection>
    </Container>
  );
};

export default LeftContent;
