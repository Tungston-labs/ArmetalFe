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
import { useLocation, useNavigate } from "react-router-dom";
import PendingIcon from "../../assets/pending.svg";
import LeaveIcon from "../../assets/leave.svg";
import TimeIcon from "../../assets/time.svg";
import { FaEdit } from "react-icons/fa";
import { fetchEmployeeDash } from "../../Redux/authSlice";
import { useParams } from "react-router-dom";

const LeftContent = () => {
  const { employeeId } = useParams();
  console.log("Employee ID from route:", employeeId);
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
      console.log("first in last out", fetchEmployeeDash(employeeId));
    }
  }, [employeeId, dispatch]);

  if (loadingEmployeeDash) {
   
  }
  if (employeeDashError) return <p>Error: {employeeDashError}</p>;
  return (
    <>
      <Container>
        <TopSection>
          <LeftColumn>
            <ProfileCardWrapper>
      <ImageWrapper>
        <img
          src={`${BASE_URL}${employeeDashData?.bank_details?.employee?.profile_pic}`}
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
          Name:{" "}
          <strong>{employeeDashData?.bank_details?.employee?.name || "-"}</strong>
        </p>

        <p>
          Position:{" "}
          <strong>{employeeDashData?.bank_details?.employee?.designation || "-"}</strong>
        </p>
 
        <p>
          Joined on:{" "}
          <strong>
            {employeeDashData?.bank_details?.employee?.joining_date
              ? new Date(employeeDashData.bank_details.employee.joining_date).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "long", year: "numeric" }
                )
              : "-"}
          </strong>
        </p>
      </Details>
    </ProfileCardWrapper>
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
      <TitleRow>
        <img src={TimeIcon} alt="clock icon" />
        <span>Time Tracking</span>
      </TitleRow>

      <Row>
        <span>Monthly Days:</span>
        <strong>{employeeDashData?.attendance_summary?.monthly_days}</strong>
      </Row>

      <Row>
        <span>Weekly Working Hour:</span>
        <strong>
          {employeeDashData?.attendance_summary?.weekly_working_hours}
        </strong>
      </Row>

      <hr />

      <Row>
        <span>Total Working Hour:</span>
        <strong>
          {employeeDashData?.attendance_summary?.monthly_working_hours}
        </strong>
      </Row>
    </TimeTrackingCard>

          </RightColumn>
        </TopSection>
      </Container>
    </>
  );
};

export default LeftContent;
