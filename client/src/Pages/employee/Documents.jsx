// DocumentUploadForm.jsx
import React from 'react';
import {
  Container, Header, RoleInfo, Stepper, Step, SectionTitle,
  UploadSection, LabelRow, UploadButton, ImagePreviewRow,
  ImageBox, ButtonGroup, Button,Title,Subtitle,Hr,InlineUploadRow
} from './Document.Styles';
import Multistep from '../../Components/Multistep'
import { LuCirclePlus } from "react-icons/lu";
import { IoImageOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
export default function DocumentUploadForm() {
  const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger"
  },
  buttonsStyling: false
});
swalWithBootstrapButtons.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Yes, delete it!",
  cancelButtonText: "No, cancel!",
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {
    swalWithBootstrapButtons.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire({
      title: "Cancelled",
      text: "Your imaginary file is safe :)",
      icon: "error"
    });
  }
});
  return (
    <Container>
      <Header>
       <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </div>
        <RoleInfo> <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
            <span>HR Manager</span>
          </RoleInfo>
      </Header>
   <Hr />
       <div style={{ width: "100%", justifyContent: "center", display: "flex", padding: "10px" }}>
        <div style={{ width: "50%" }}>
          <Multistep />
        </div>
      </div>
     

      <SectionTitle>Documents</SectionTitle>

   {["Passport", "Work Permit", "Employement Contract",  "Insurance "].map((label, idx) => (
  <UploadSection key={idx}>
    <LabelRow>{label}</LabelRow>
    <InlineUploadRow>
      <UploadButton><LuCirclePlus /> Upload images</UploadButton>
      <ImagePreviewRow>
     <ImageBox><IoImageOutline size={100} color="#555" /></ImageBox>
         <ImageBox><IoImageOutline size={100} color="#555" /></ImageBox>
      </ImagePreviewRow>
    </InlineUploadRow>
  </UploadSection>
))}


      <SectionTitle>Certificate</SectionTitle>
  <UploadSection>
  <LabelRow>Upload certificate</LabelRow>
  <InlineUploadRow>
    <UploadButton>⬆ Upload images</UploadButton>
    <ImagePreviewRow>
 <ImageBox><IoImageOutline size={100} color="#555" /></ImageBox>
 <ImageBox><IoImageOutline size={100} color="#555" /></ImageBox>
    </ImagePreviewRow>
  </InlineUploadRow>
</UploadSection>


      <ButtonGroup>
        <Button secondary>Previous step</Button>
        <Button>Submit</Button>
      </ButtonGroup>
    </Container>
  );
}
