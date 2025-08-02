import React from "react";
import {
  Container,
  TopSection,
  LeftColumn,SvgImage,
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
import InCompanyIcon from '../../assets/clock.svg';
import SalaryIcon from '../../assets/salary.svg';
import PendingIcon from '../../assets/pending.svg';
import LeaveIcon from '../../assets/leave.svg';
import TimeIcon from "../../assets/time.svg"; 
// import Employeedashboard from "./Employeedashboard"
const Dashboard = () => {
  return (
    <>
    <Container>
      <TopSection>
        <LeftColumn>
          <ProfileCard>
            <img src="https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=" alt="profile" />
            <div className="details">
              <p>Name<strong>Dummy</strong></p><br></br>
              <p>Position<strong>UI/UX Designer</strong></p><br></br>
              <p>Joined on<strong>12 June 2025</strong></p>
            </div>
          </ProfileCard>
        </LeftColumn>

        <RightColumn>
          <InfoGrid>
           <InfoCard>
  <h3>254</h3>
  <p>Days</p>
  <button>
    <SvgImage src={InCompanyIcon} alt="icon" />
    In Company
  </button>
</InfoCard>

            <InfoCard>
              <h3>17,000</h3>
              <p>Salary</p>
              <button>
                  <SvgImage src={SalaryIcon} alt="icon" />
                Salary</button>
            </InfoCard>
            <InfoCard>
              <h3>5</h3>
              <p>Pending leave</p>
              <button>
                   <SvgImage src={PendingIcon} alt="icon" />
                Pending leave</button>
            </InfoCard>
            <InfoCard>
              <h3>12</h3>
              <p>Leaves Taken</p>
              <button>
                 <SvgImage src={LeaveIcon} alt="icon" />
                Leave</button>
            </InfoCard>
          </InfoGrid>

          <TimeTrackingCard>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
  <img src={TimeIcon} alt="clock icon" style={{ width: '18px', height: '20px', fontFamily:'Raleway', }} />
  Time tracking
</h4>
            
  <p style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Satoshi', }}>
    Monthly days: <strong>28</strong>
  </p>

  <p style={{ display: 'flex', justifyContent: 'space-between' }}>
    Total working Hour: <strong>121</strong>
  </p>
            <hr></hr>
            <a href="/">Total working Hour</a>
          </TimeTrackingCard>
        </RightColumn>
      </TopSection>

        <TaskTitle>Daily Task List</TaskTitle>

      <TaskSection>
        {[1, 2, 3, 4, 5,6,7,8,9,10].map((_, idx) => (
          <TaskItem key={idx}>
            <TaskMeta>
              <span>21 Jan</span>
              <strong>01:30</strong>
            </TaskMeta>
            <TaskText>
              <h5>UI UX designer</h5>
              <p>Lorem ipsum dolor sit amet consectetur. Sit pulvinar placerat dolor sit...</p>
            </TaskText>
            <a href="/">↗</a>
          </TaskItem>
        ))}
      </TaskSection>
    </Container>
    {/* <Employeedashboard /> */}
    </>
  );
};

export default Dashboard;
