import React, { useEffect, useMemo, useState } from "react";
import AddCompanyModal from "../superAdmin/AddCompany";
import {
  Container,
  IconButton,
} from "./SuperAdmin.Styles";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { TbPencilMinus } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, removeCompany } from "../../Redux/superAdminSlice";
import { IoInformationCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import EmailComposeModal from "../../Components/superadmin/EmailCompose/EmailCompose";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableConfirmModal from "../../Components/modals/ReusableConfirmModal";

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
   <ReusableHeader
  title="COMPANY"
  breadcrumbs={["Dashboard", "Company"]}
  buttonText="+ ADD NEW COMPANY"
  onButtonClick={handleAdd}
/>

          <ReusableFilter
            search={search}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
         showSearch
  searchPlaceholder="Search by company name or ID"
          />
    

      <ReusableTable columns={columns} data={companies} loading={loading} />

     <ReusableConfirmModal
        show={showDeleteModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this company?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loadingText="Deleting..."
        onConfirm={confirmDelete}
        onClose={cancelDelete}
      />
 {showCompanyModal && (
  <AddCompanyModal
    isEdit={isEditMode}
    selectedCompany={selectedCompany}
    showPrivileges={true}
    onClose={() => setShowCompanyModal(false)}
  />
)}

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