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
  HRManager
} from './SuperAdmin.Styles';
import { LuArrowLeft } from "react-icons/lu";
import { FaTrashAlt, FaPlus } from 'react-icons/fa';
import { TbPencilMinus } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCompanies,
  removeCompany
} from '../../Redux/superAdminSlice';

const CompanyTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies, loading, pagination } = useSelector((state) => state.superAdmin);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);


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

  return (
    <Container>
      <TopBar>
        <div />
        <HRManager>
          <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar>

      <HeaderSection>
        <TitleSection>
          <LuArrowLeft style={{ width: "30px", height: 30 }} />
          <img src="/images/superadmin.png" alt="Payroll Icon" style={{ height: "50px" }} />
          <div>
            <Title>Super admin</Title>
            <Subtitle>Manage all departments within the organization.</Subtitle>
          </div>
        </TitleSection>
        <ActionArea>
        <AddButton onClick={() => setShowAddModal(true)}>
  <FaPlus /> Add Company
</AddButton>

          <SearchInput
            type="text"
            placeholder="Search by Company name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
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
              <Th>Edit</Th>
              <Th>Delete</Th>
              <Th>Impersonate</Th>
            </tr>
          </thead>
          <tbody>
            {!loading && companies.length > 0 ? (
              companies.map((item, idx) => (
                <tr key={item.id}>
                  <Td>{idx + 1}</Td>
                  <Td>{item.name}</Td>
                  <Td>{item.address}</Td>
                  <Td>{item.company_id}</Td>
                  <Td>{item.contact_number}</Td>
                  <Td>{item.number_of_employees}</Td>
                  <Td>
                    <IconButton onClick={() => navigate(`/edit-company/${item.id}`)}>
                      <TbPencilMinus />
                    </IconButton>
                  </Td>
                  <Td>
                    <IconButton danger onClick={() => handleDelete(item.id)}>
                      <FaTrashAlt />
                    </IconButton>
                  </Td>
                  <Td>
                    <ImpersonateButton>Impersonate</ImpersonateButton>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <Td colSpan="9" style={{ textAlign: 'center' }}>
                  {loading ? "Loading..." : "No companies found"}
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>

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
      {showAddModal && (
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
      <AddCompanyModal onClose={() => setShowAddModal(false)} />
    </div>
  </div>
)}


      <Pagination>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          {'←'}
        </button>

        {[...Array(pagination.total_pages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              className={page === pageNum ? 'active' : ''}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button onClick={() => handlePageChange(page + 1)} disabled={page === pagination.total_pages}>
          {'→'}
        </button>
      </Pagination>
    </Container>
  );
};

export default CompanyTable;
