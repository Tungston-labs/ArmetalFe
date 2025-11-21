import styled, { css } from 'styled-components';

const colors = {
primaryDark: '#172554',   
  primary: '#3352BA',     
  secondary: '#3352BA',     
  background: '#EAEFF4',   
  panelBg: '#FFFFFF',       
  text: '#212121',
  lightText: '#757575',
  borderColor: '#E0E0E0',
  shadowLight: 'rgba(0, 0, 0, 0.08)',
  shadowMedium: 'rgba(0, 0, 0, 0.2)',
  activeBg: '#E8EBF5',      
  hoverBg: '#F5F5F5',
  selectedEmployee: '#f5f7fa', 
  warningBg: '#FFF3E0',
  warningText: '#FF9800',
  infoText: '#3352BA',
};


const CustomScrollbar = css`
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bdbdbd;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #9e9e9e;
  }
`;
export const StyledNoSelectionMessage = styled.div`
  /* Base Style for No Task / No Employee selected */
  padding: 40px 20px;
  border-radius: 10px;
  margin-top: 20px;
  text-align: center;
  font-size: 1.2em;
  font-weight: 600;
  
  p {
    margin: 10px 0 0;
    font-style: italic;
    font-size: 0.9em;

  }

  /* 2. Style for No Employee Selected (Info State) */
  ${(props) =>
    props.$type === 'info' &&
    css`
      background-color: ${colors.infoBg};
      // border: 2px solid ${colors.primary};▼
      color: #172554;
      box-shadow: 0 4px 10px rgba(7, 29, 90, 0.2);
    `}

  /* 3. Style for No Tasks Found (Warning State) */
  ${(props) =>
    props.$type === 'warning' &&
    css`
      background-color: ${colors.warningBg};
      border: 2px solid ${colors.warningText};
      color: ${colors.warningText};
      box-shadow: 0 4px 10px rgba(255, 152, 0, 0.2);
    `}
`;

export const ViewContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background-color: ${colors.background};
`;

export const DepartmentPanel = styled.div`
  width: 320px;
  min-width: 320px;
  background-color: ${colors.panelBg};
  padding: 30px 20px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 15px ${colors.shadowMedium};
  border-right: 3px solid ${colors.primary}; 
  overflow-y: auto;
  z-index: 5;
  ${CustomScrollbar}

 img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
  /* Slide effect */
  ${(props) =>
    !props.$isOpen &&
    css`
      transform: translateX(-100%);
      width: 0;
      min-width: 0;
      padding: 0;
      opacity: 0;
    `}
`;

export const Title = styled.button`
  display: flex;               /* Enables gap */
  align-items: center;         /* Vertically centers icon + text */
  gap: 12px;                   /* SPACE between image and text */

  margin-top: 0;
  padding-bottom: 15px;

  color: #3352BA;
  font-size: 1.5em;
  font-weight: 700;
  letter-spacing: 0.5px;

  background: white;
  border: none;
  cursor: default;             /* Prevents button click look */
`;
export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  margin: 15px 0 20px 0;

  border: 2px solid ${colors.borderColor};
  border-radius: 10px;

  font-size: 0.95rem;
  outline: none;

  transition: 0.2s ease;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(51, 82, 186, 0.15);
  }
`;

export const ToggleArrow = styled.button`
  position: absolute;
  left: ${(props) => (props.$isOpen ? '320px' : '0')}; 
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  
  width: 35px; /* Larger hit area */
  height: 80px;
  background-color:#172554 ;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 2em;
  line-height: 80px;
  text-align: center;
  border-radius: 0 10px 10px 0;
  transition: left 0.3s ease-out, background-color 0.2s;
  box-shadow: 2px 0 10px ${colors.shadowMedium};

  &:hover {
    background-color: ${colors.primary}; /* Darker primary on hover */
    box-shadow: 2px 0 15px ${colors.shadowMedium};
  }
`;

export const MainContent = styled.div`
  flex-grow: 1; 
  display: flex;
  padding: 30px;
  min-width: 0; 
  gap:20px;
`;


export const CardItem = styled.div`
  padding: 20px; 
  margin-bottom: 15px;
  border-radius: 12px; /* Smoother corners */
  background-color: ${colors.panelBg};
  box-shadow: 0 4px 10px ${colors.shadowLight}; 
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent; /* Subtle border for definition */

  /* Department Name Text */
  > strong { 
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2em;
    color: #3352BA;
  }

  &:hover {
    background-color: ${colors.hoverBg};
    box-shadow: 0 6px 15px ${colors.shadowLight};
  }

  /* Active/Open State */
  ${(props) =>
    props.$isActive &&
    css`
      border: 1px solid ${colors.primary};
      background-color: ${colors.activeBg};
      box-shadow: 0 8px 20px ${colors.shadowMedium};
      padding-bottom: 10px; 
    `}
`;

export const EmployeeContainer = styled.div`
  /* Removed min-width/flex, now controlled by Wrapper */
  background-color: ${colors.panelBg}; 
  border-radius: 12px;
  overflow-y: auto;
  
  h4 {
    border-bottom: 1px solid ${colors.borderColor};
    padding-bottom: 10px;
    margin-top: 0;
    color: ${colors.primary};
  }
`;
export const EmployeeListWrapper = styled.div`
  /* This controls the sliding and width of the Employee List area */
  min-width: 0;
  width: ${(props) => (props.$visible ? '300px' : '0')}; /* Set specific width when visible */
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: width 0.4s ease, opacity 0.3s ease;
  overflow: hidden;
  padding: 0;
  
  > ${EmployeeContainer} {
    /* Ensure the inner container respects the wrapper's sliding width */
    width: 300px; 
    padding: ${(props) => (props.$visible ? '30px' : '0')};
    height: 100%;
    box-shadow: 0 6px 20px ${colors.shadowMedium};
    margin: 0; /* Remove redundant margin/padding */
  }
`;

export const EmployeeListItem = styled.div`
  padding: 12px 15px; 
  border-radius: 8px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500; 
  color: ${colors.text};
  
  &:hover {
    background-color: ${colors.selectedEmployee}80; /* Lighter hover shade */
  }

  /* Active/Selected Employee State */
  background-color: ${(props) => (props.$isActive ? colors.selectedEmployee : 'transparent')};
  font-weight: ${(props) => (props.$isActive ? '700' : '500')};
  color: ${(props) => (props.$isActive ? colors.text : colors.lightText)};
  border: ${(props) => (props.$isActive ? `2px solid ${colors.secondary}` : 'none')};
  transform: ${(props) => (props.$isActive ? 'translateX(5px)' : 'none')}; /* Subtle shift */
`;

export const TaskPanelContainer = styled.div`
  flex: 1;
  min-width: 450px;
  padding: 30px;
  border-radius: 12px;
  background-color: ${colors.panelBg};
  box-shadow: 0 6px 20px ${colors.shadowMedium};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;


export const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: ${colors.lightText};

  input[type="date"] {
    padding: 8px 12px;
    margin-left: 15px;
    border: 2px solid ${colors.borderColor};
    border-radius: 8px;
    font-size: 1em;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;

    &:focus {
      border-color: ${colors.primary};
      box-shadow: 0 0 0 3px ${colors.primary}30;
    }
  }
`;

export const TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
  ${CustomScrollbar};

  li {
    padding: 15px;
    margin-bottom: 12px;
    background-color: ${colors.background};
    border-radius: 10px;
    color: ${colors.text};
    box-shadow: 0 2px 4px ${colors.shadowLight};
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 1em;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${colors.hoverBg};
    }
  }
`;

export const NoSelectionMessage = styled.p`
  color: ${colors.lightText};
  font-style: italic;
  padding: 30px;
  text-align: center;
  border: 1px dashed ${colors.borderColor};
  border-radius: 10px;
  margin-top: 15px;
  font-size: 1.1em;
`;
export const EmployeePanel = styled.div`
  width: 300px;
  min-width: 300px;
  background-color: ${colors.panelBg};
  padding: 30px 20px;
  border-right: 2px solid ${colors.borderColor};
  box-shadow: 4px 0 15px ${colors.shadowLight};
  overflow-y: auto;
  ${CustomScrollbar}

  h3 {
    margin: 0 0 15px 0;
    color: #172554;
    font-size: 1.4em;
    font-weight: 700;
  }
`;

export const PanelContainer = styled.div`
  flex: 2; /* Wider panel */
  min-width: 350px;
  padding: 15px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  h4 {
    padding-bottom: 10px;
    margin-top: 0;
    color: #555;
  }
`;
export const EmployeeSlidePanel = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 320px;
  height: 100%;
  background: #ffffff;
  box-shadow: 4px 0 10px rgba(0,0,0,0.1);
  transform: translateX(${(p) => (p.$visible ? "0" : "-100%")});
  transition: transform 0.4s ease;
  z-index: 2;  /* Behind department panel */
  padding: 20px;
  overflow-y: auto;
`;
export const EmployeePanelWrapper = styled.div`
  /* Controls the sliding width/visibility of the employee list panel */
  min-width: 0;
  width: ${(props) => (props.$visible ? '300px' : '0')}; 
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  padding: ${(props) => (props.$visible ? '0 20px 0 0' : '0')}; /* Add padding gap */
  transition: width 0.4s ease, opacity 0.3s ease, padding 0.4s ease;
  overflow: hidden;

  /* The inner container should use the flexbox padding/shadow */
  > ${EmployeeContainer} {
    height: 100%;
    width: 300px; /* Ensure inner content keeps its size */
    box-shadow: 0 6px 20px ${colors.shadowMedium};
    padding: 30px;
  }
`;

export const EmployeeItem = styled.div`
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.1s;
  
  &:hover {
    background-color: ${colors.hoverBg};
  }

  /* Active State */
  background-color: ${(props) => (props.$isActive ? colors.activeBg : 'transparent')};
  font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
  color: ${(props) => (props.$isActive ? colors.primaryDark : colors.text)};
`;


export const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${colors.borderColor};
  padding-bottom: 15px;
  margin-bottom: 20px;

  h4 {
    margin: 0;
    color: ${colors.primaryDark};
    font-size: 1.4em;
    font-weight: 700;
  }
`;

export const TaskListItemStyled = styled.li`
  padding: 15px;
  margin-bottom: 15px;
  background-color: ${colors.background};
  border-radius: 10px;
  box-shadow: 0 2px 5px ${colors.shadowLight};
  display: flex;
  align-items: flex-start;
  transition: background-color 0.2s, transform 0.2s;
  border-left: 5px solid ${colors.secondary}; /* Accent bar */
  
  &:hover {
    background-color: ${colors.hoverBg};
    transform: translateY(-2px);
  }
  
  /* Task Completion Icon/Indicator */
  &:before {
    content: '✅'; 
    font-size: 1.2em;
    margin-right: 15px;
    margin-top: 2px;
  }
`;

export const TaskDetails = styled.div`
  flex-grow: 1;
  color: ${colors.text};
  
  .task-header-info {
    display: flex;
    align-items: baseline;
    margin-bottom: 5px;
  }
  
  .task-name {
    font-size: 1.1em;
    font-weight: 700;
    color: ${colors.primaryDark};
  }
  
  .project-name {
    font-size: 0.9em;
    font-weight: 500;
    color: ${colors.lightText};
    margin-left: 10px;
  }
  
  .task-description {
    font-size: 0.95em;
    color: ${colors.text};
    margin: 5px 0 0 0;
    line-height: 1.4;
  }
`;

export const TaskFooter = styled.div`
  display: flex;
  justify-content: flex-end; /* Align to the right */
  gap: 20px;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid ${colors.borderColor};
  /* Optional: Add a light background for emphasis */
  /* background-color: ${colors.activeBg}; 
  padding: 20px 0;
  margin: 0 -30px -30px -30px; */
`;

export const TaskLeft = styled.div`
  display: flex;
  flex-direction: column;

  .task-title {
    font-size: 1.05em;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .task-desc {
    font-size: 0.9em;
    color: ${colors.lightText};
  }
`;

export const TaskRight = styled.div`
  text-align: right;
  font-size: 0.85em;
  color: ${colors.primaryDark};

  .task-time {
    font-weight: 600;
  }

  .task-date {
    color: ${colors.lightText};
  }
`;
export const TaskBottom = styled.div`
  display: flex;
  justify-content: flex-end;   /* Send everything to RIGHT side */
  width: 100%;
  padding-top: 12px;
  border-top: 1px dashed ${colors.borderColor};

  .right-block {
    display: flex;
    flex-direction: column;    
    align-items: flex-end;     
    gap: 16px;
  }

  .time-taken {
    font-size: 0.95em;
    strong {
      color: ${colors.primaryDark};
      font-weight: 700;
    }
  }

  .due-info {
    display: flex;
    // flex-direction: column;     
    align-items: flex-end;      
    gap: 20px;

    .task-date {
      font-weight: 600;
      color: ${colors.text};
    }

    .task-time {
      font-weight: 600;
      color: ${colors.primary};
    }
  }
`;

export const TaskContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px; /* Space above the footer */
`;