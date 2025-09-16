import React, { useEffect, useState } from 'react';
import AddCompanyModal from '../superAdmin/AddCompany'; // adjust path as needed
import {
  Container,
  Header,
  Title,
  Subtitle,
  TopBar,
  AddButton,
  SearchInput,
  TableWrapper,
  Table,
  Th,
  Td,
  IconButton,
  ImpersonateButton,
  Pagination,
  HeaderSection,
  TitleSection,
  Icon,
  ActionArea,
  HRManager,SearchIcon,SearchWrapper
} from './SuperAdmin.Styles';
import { FiSearch } from "react-icons/fi";


import { LuArrowLeft } from "react-icons/lu";
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import { TbPencilMinus } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { getCompanies, removeCompany } from '../../Redux/superAdminSlice';
import { IoInformationCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../Components/Navbar"


const CompanyTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies, loading, pagination } = useSelector((state) => state.superAdmin);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    dispatch(getCompanies({ page, search: search.trim() }));
  }, [dispatch, page, search]);

  const handleDelete = (id) => {
    setSelectedCompanyId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(removeCompany(selectedCompanyId));
    setShowDeleteModal(false);
    setSelectedCompanyId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCompanyId(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPage(newPage);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedCompany(null);
    setShowCompanyModal(true);
  };

  const handleEdit = (company) => {
    setIsEditMode(true);
    setSelectedCompany(company);
    setShowCompanyModal(true);
  };

  return (
    <Container>
      <TopBar>
        <div />
        <Navbar/>
      </TopBar>

      <HeaderSection>
        <TitleSection>
          <LuArrowLeft style={{ width: "30px", height: 30 }} />
          <img src="/images/laptop_chromebook.png" alt="Payroll Icon" style={{ height: "50px" }} />
          <div>
            <Title>Super admin</Title>
            <Subtitle>Manage all departments within the organization.</Subtitle>
          </div>
        </TitleSection>
        <ActionArea>
          <AddButton onClick={handleAdd}>
            <FaPlus /> Add Company
          </AddButton>

          <SearchWrapper>
  <SearchIcon />
  <SearchInput
    type="text"
    placeholder="Search by Company name"
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setPage(1);
    }}
  />
</SearchWrapper>
        </ActionArea>
      </HeaderSection>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Sl no</Th>
              <Th>Company name</Th>
              <Th>Address</Th>
              <Th>Company ID</Th>
              <Th>Contact details</Th>
              <Th>No of Employees</Th>
              <Th>Info</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
              {/* <Th>Impersonate</Th> */}
            </tr>
          </thead>
          <tbody>
            {!loading && companies.length > 0 ? (
              companies.map((item, idx) => (
                <tr key={item.id}>
                  <Td>{(page - 1) * 7 + idx + 1}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.address}</Td>
                  <Td>{item.company_id}</Td>
                  <Td>{item.contact_number}</Td>
                  <Td>{item.number_of_employees}</Td>

                  {/* ✅ Navigate with company_id */}
                  <Td onClick={() => navigate(`/view/${item.id}`)} style={{ cursor: 'pointer' }}>
  <IoInformationCircleOutline />
</Td>


                  <Td>
                    <IconButton onClick={() => handleEdit(item)}>
                      <TbPencilMinus />
                    </IconButton>
                  </Td>
                  <Td>
                    <IconButton danger onClick={() => handleDelete(item.id)}>
                      <FaTrashAlt />
                    </IconButton>
                  </Td>
                  {/* <Td>
                    <ImpersonateButton>Impersonate</ImpersonateButton>
                  </Td> */}
                </tr>
              ))
            ) : (
              <tr>
                <Td colSpan="10" style={{ textAlign: 'center' }}>
                  {loading ? "Loading..." : "No companies found"}
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "10px",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%"
          }}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this company?</p>
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={confirmDelete}
                style={{
                  marginRight: "1rem",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Company Modal */}
      {showCompanyModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "10px",
            maxWidth: "900px",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <AddCompanyModal
              isEdit={isEditMode}
              selectedCompany={selectedCompany}
              onClose={() => setShowCompanyModal(false)}
            />
          </div>
        </div>
      )}

      {/* Pagination */}

          <Pagination>
  <span onClick={() => handlePageChange(Math.max(page - 1, 1))}>&larr;</span>
  {Array.from({ length: pagination?.total_pages || 1 }, (_, i) => i + 1).map(
    (pageNumber) => (
      <span
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
        className={page === pageNumber ? "active" : ""}
      >
        {pageNumber}
      </span>
    )
  )}
  <span
    onClick={() => {
      if (page < (pagination?.total_pages || 1)) {
        handlePageChange(page + 1);
      }
    }}
  >
    &rarr;
  </span>
</Pagination>
    </Container>
  );
};

export default CompanyTable;
