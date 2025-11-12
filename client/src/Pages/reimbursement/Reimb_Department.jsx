import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments, createNewDepartment } from '../../Redux/departmentSlice.js';
import { useNavigate } from 'react-router-dom';
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
  DropdownMenu, DropdownWrapper,
  EmployeeImage
  
} from './Reimb_Department.Styles.js';


import Employee from "../../assets/remi.svg"; 
import { FaPlus, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { GoArrowUpRight } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import Navbar from '../../Components/Navbar.jsx';
import Loader from "../../Components/Loader.jsx"
import HistoryIcon from "../../assets/history.svg";
import EmployeeTitle from '../../Components/EmployeeTitle.jsx';
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
    <>
         <Navbar />
    <DepartmentContainer>

<EmployeeTitle
  iconSrc={Employee}
  title="Reimbursement"
  subtitle="Manage all departments within the organization"
  buttonText="History"
  buttonIcon={HistoryIcon} 
  onAddClick={() => setShowModal(true)} 
  showDropdown={false}
  showBackArrow={false}
  showTabs={false}
  showSearch={false}
/>

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
      <h3 
        className="dept-name" 
        title={dept.name} // tooltip for full dept name
      >
        {dept.name?.length > 10 ? dept.name.slice(0, 10) + "..." : dept.name}
      </h3>

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
          <p 
            className="head-name"
            title={
              typeof dept.department_head === 'object'
                ? dept.department_head?.name
                : dept.department_head || 'Not Assigned'
            }
          >
            {(() => {
              const headName = typeof dept.department_head === 'object'
                ? dept.department_head?.name
                : dept.department_head || 'Not Assigned';
              return headName?.length > 10 ? headName.slice(0, 10) + "..." : headName;
            })()}
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
    </>
  );
};

export default Department;