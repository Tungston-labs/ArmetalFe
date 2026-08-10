import React, { useEffect, useMemo, useState } from "react";
import AddCompanyModal from "../superAdmin/AddCompany";
import {
  Container,
  Title,
  Subtitle,
  AddButton,
  SearchInput,
  IconButton,
  Pagination,
  HeaderSection,
  TitleSection,
  ActionArea,
  SearchIcon,
  SearchWrapper,
} from "./SuperAdmin.Styles";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import Loader from "../../Components/Loader/Loader";
import { MdOutlineEmail } from "react-icons/md";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { TbPencilMinus } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, removeCompany } from "../../Redux/superAdminSlice";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import EmailComposeModal from "../../Components/superadmin/EmailCompose/EmailCompose";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";

const CompanyTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies, loading, pagination } = useSelector(
    (state) => state.superAdmin,
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  const handleSendEmail = (company) => {
    setSelectedCompany(company);
    setShowEmailModal(true);
  };

  const columns = useMemo(
    () => [
      {
        header: "Sl no",
        accessor: "slNo",
        sortable: false,
        render: (row, index) => (page - 1) * 7 + index + 1,
      },
      {
        header: "Company name",
        accessor: "name",
      },
      {
        header: "Company ID",
        accessor: "company_id",
      },
      {
        header: "Contact details",
        accessor: "contact_number",
      },
      {
        header: "No of Employees",
        accessor: "number_of_employees",
      },
      {
        header: "Email",
        accessor: "email",
        sortable: false,
        render: (row) => (
          <IconButton onClick={() => handleSendEmail(row)}>
            <MdOutlineEmail />
          </IconButton>
        ),
      },
      {
        header: "Info",
        accessor: "info",
        sortable: false,
        render: (row) => (
          <div
            onClick={() => navigate(`/superadmin/view/${row.id}`)}
            style={{ cursor: "pointer" }}
          >
            <IoInformationCircleOutline />
          </div>
        ),
      },
      {
        header: "Edit",
        accessor: "edit",
        sortable: false,
        render: (row) => (
          <IconButton onClick={() => handleEdit(row)}>
            <TbPencilMinus />
          </IconButton>
        ),
      },
      {
        header: "Delete",
        accessor: "delete",
        sortable: false,
        render: (row) => (
          <IconButton danger onClick={() => handleDelete(row.id)}>
            <FaTrashAlt />
          </IconButton>
        ),
      },
    ],
    [page, navigate],
  );

  return (
    <Container>
      {loading && <Loader />}
      <ReusableHeader
 title="COMPANY"
  breadcrumbs={["Dashboard", "Company"]}
  buttonText="+ ADD NEW COMPANY"
  onButtonClick={() => console.log("Add Employee")}
/>   
      <HeaderSection>
     
        <ActionArea>
        

          <SearchWrapper>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search by Company ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </SearchWrapper>
        </ActionArea>
      </HeaderSection>

      <ReusableTable columns={columns} data={companies} loading={loading} />

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "10px",
              textAlign: "center",
              maxWidth: "400px",
              width: "100%",
            }}
          >
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
                  cursor: "pointer",
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
                  cursor: "pointer",
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "10px",
              maxWidth: "1200px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <AddCompanyModal
              isEdit={isEditMode}
              selectedCompany={selectedCompany}
              showPrivileges={true}
              onClose={() => setShowCompanyModal(false)}
            />
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination>
        <span onClick={() => handlePageChange(Math.max(page - 1, 1))}>
          &larr;
        </span>
        {Array.from(
          { length: pagination?.total_pages || 1 },
          (_, i) => i + 1,
        ).map((pageNumber) => (
          <span
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={page === pageNumber ? "active" : ""}
          >
            {pageNumber}
          </span>
        ))}
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

      {showEmailModal && (
        <EmailComposeModal
          company={selectedCompany}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </Container>
  );
};

export default CompanyTable;