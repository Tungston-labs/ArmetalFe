import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";

import {
  PageWrapper,
  Header,
  HeaderLeft,
  HeaderTitle,
  HeaderSubtitle,
  ProfileSection,
  ProfileImage,
  ProfileInfo,
  Label,
  Value,
  Row,
  DateSection,
  DescriptionBox,
  BillsSection,
  BillsGrid,
  BillImage,
  SelectBox,
  Divider,
} from "./Reimb_info.Styles";
import RemiIcon from "../../assets/remi.svg";
import {
  fetchReimbursementDetail,
  updateReimbursementStatus,
} from "../../services/reimbursement";
import Loader from "../../Components/Loader"
const ReimbursementDetail = () => {
  const { id } = useParams(); // get :id from URL
  const navigate = useNavigate();

  const [reimbursement, setReimbursement] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch reimbursement detail on mount
  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await fetchReimbursementDetail(id);
        setReimbursement(data);
      } catch (error) {
        console.error("Failed to load reimbursement detail:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  // 🔹 Handle status update
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      // Optimistic UI update
      setReimbursement((prev) => ({ ...prev, status: newStatus }));
      await updateReimbursementStatus(id, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };
 if (loading) {
    return (
   
        <Loader  />

    );
  }
  if (!reimbursement) return <p>No reimbursement found.</p>;

  return (
    <PageWrapper>
      {/* Header */}
      <Header>
        <HeaderLeft>
          <HiArrowLeft
                 size={34} 
            style={{ cursor: "pointer", color: "#3250B5", marginRight: "10px" }}
            onClick={() => navigate(-1)}
          />
          <div className="icon-box">
            <img src={RemiIcon} alt="employeeIcon" style={{ height: "60px" }} />
          </div>
          <div>
            <HeaderTitle>Reimbursement</HeaderTitle>
            <HeaderSubtitle>
              Manage all departments within the organization.
            </HeaderSubtitle>
          </div>
        </HeaderLeft>
        <SelectBox value={reimbursement.status} onChange={handleStatusChange}>
          <option value="">Select</option>
          <option value="Approve">Approve</option>
          <option value="On Hold">On Hold</option>
          <option value="In Verification">In Verification</option>
        </SelectBox>
      </Header>

      {/* Profile */}
      <ProfileSection>
      <ProfileImage
  src={
    reimbursement.profile_pic
      ? reimbursement.profile_pic // use as-is
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          reimbursement.employee_name || "User"
        )}&background=random`
  }
  alt="profile"
/>        
        <ProfileInfo>
          <Row>
            <Label>Name</Label>
            <Value>{reimbursement.employee_name}</Value>
          </Row>
          <Row>
            <Label>Employee ID</Label>
            <Value>{reimbursement.employee_id}</Value>
          </Row>
          <Row>
            <Label>Department</Label>
            <Value>{reimbursement.department?.name}</Value>
          </Row>
        </ProfileInfo>
        
      </ProfileSection>

<Divider />
      {/* Date */}
      <DateSection>
        <Label style={{color:"#6C6C6C",fontSize:"14px"}}>Date</Label>
        <Value>{reimbursement.date}</Value>
      </DateSection>

      {/* Note */}
      <h6 style={{color:"#6C6C6C"}}>Note</h6>
      <DescriptionBox>{reimbursement.note}</DescriptionBox>

      {/* Bills */}
      <BillsSection>
  <Label>📑 Bills uploaded</Label>
  <Divider />
  <BillsGrid>
    {reimbursement.images?.map((bill) => (
      <a key={bill.id} href={bill.image} target="_blank" rel="noopener noreferrer">
        <BillImage src={bill.image} alt={`bill-${bill.id}`} />
      </a>
    ))}
  </BillsGrid>
</BillsSection>

    </PageWrapper>
  );
};

export default ReimbursementDetail;
