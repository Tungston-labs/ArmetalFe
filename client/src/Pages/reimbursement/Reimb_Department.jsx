import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments, createNewDepartment } from '../../Redux/departmentSlice.js';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi'; // Make sure this is imported in your file
import Side_detail from "./Side_detail.jsx"
import {
  DepartmentContainer,
  HeaderSection,
  TitleSection,
  Subtitle,
  ActionArea,
  AddButton,
  SearchInput,
  SearchIcon,
  CardGrid,
  DepartmentCard,
  HeadInfo,
  Title,

  CardRight,
  TopBar,
  HRManager,
  ModalOverlay,
  CloseButton,
  ModalContent,
  InitialCircle,
  SearchWrapper,
  DropdownMenu, DropdownWrapper
  
} from './Reimb_Department.Styles.js';

// import {
//   Container,
//   TitleRow,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   ButtonRow,
//   CancelButton,
//   SaveButton,
//   BackArrow,
  
// } from './AddDepartment.Styles';
import Employee from "../../assets/remi.svg"; 
import { FaPlus, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { GoArrowUpRight } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import Navbar from '../../Components/Navbar.jsx';
import Loader from "../../Components/Loader.jsx"
const Department = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: departments, loading, error } = useSelector((state) => state.departments);
 const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    department_code: ''
  });

  useEffect(() => {
    dispatch(getDepartments({ page: 1, search }));
  }, [dispatch, search]);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const result = await dispatch(createNewDepartment(formData));
      if (createNewDepartment.fulfilled.match(result)) {
        setShowModal(false);
        setFormData({ name: '', department_code: '' });
        dispatch(getDepartments({ page: 1, search: search.trim() }));
      } else {
        console.error('Department creation failed:', result.payload);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/reimbursement_detail/${id}`);
  };

  return (
    <DepartmentContainer>
     <Navbar />

      <HeaderSection>
<TitleSection>
  <div className="left-content">
    <div className="icon-box">
       <img src={Employee}  alt="employee icon" />
    </div>
    <div>
      <Title>Reimbursement</Title>
      <Subtitle>Manage all departments within the organization.</Subtitle>
    </div>
  </div>

  <AddButton onClick={() => setShowModal(true)}>
  History
  </AddButton>
</TitleSection>



        <ActionArea>
        <SearchWrapper>
    <SearchIcon />
    <SearchInput
      type="text"
      placeholder="Search by Department name"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </SearchWrapper>
          
        </ActionArea>
      </HeaderSection>

      <CardGrid>
  {loading ? (
  <Loader />
  ) : error ? (
    <p style={{ color: 'red' }}>Error: {error?.detail?.toString()}</p>
  ) : Array.isArray(departments) && departments.length > 0 ? (
    departments.map((dept) => {
      const initial = dept.name?.[0]?.toUpperCase() || '?';
      return (
        <DepartmentCard key={dept.id} onClick={() => handleCardClick(dept.id)}>
  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
    <InitialCircle className="initial-circle">{initial}</InitialCircle>
    <div>
      <h3 className="dept-name">{dept.name}</h3>
      <HeadInfo>
        <small className="subtitle">Department Head</small>
        <div className="head-row">
          {typeof dept.department_head === 'object' &&
          dept.department_head?.profile_pic ? (
            <img
              src={dept.department_head.profile_pic}
              alt={dept.department_head.name}
            />
          ) : (
            <PiUserCirclePlusThin size={24} color="#999" />
          )}
          <p className="head-name">
            {typeof dept.department_head === 'object'
              ? dept.department_head?.name
              : dept.department_head || 'Not Assigned'}
          </p>
        </div>
      </HeadInfo>
    </div>
  </div>

  <CardRight>
  <div className="card-value">{dept.reimbursement_request_count || 0}</div>
    <div className="arrow-icon">
      <GoArrowUpRight size={15} style={{ strokeWidth: 2 }} />
    </div>
  </CardRight>
</DepartmentCard>

      );
    })
  ) : (
    <p>No departments found.</p>
  )}
</CardGrid>


       {showModal && <Side_detail onClose={() => setShowModal(false)} />}
    </DepartmentContainer>
  );
};

export default Department;