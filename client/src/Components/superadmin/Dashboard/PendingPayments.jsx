import React from "react";
import {
  PaymentContainer,
  PaymentHeader,
  PaymentTitle,
  PaymentCount,
  PaymentTableWrapper,
  PaymentTable,
  TableHeader,
  TableRow,
  TableCell,
} from "./PendingPayments.Styles";

const payments = [
  {
    company: "Tungston labs",
    address: "Al-Barsha 1 , Dubai UAE",
    companyId: "iue_arm_buk_948",
    contact: "+971555736021",
    employees: "1",
    dueDate: "20-06-2026",
  },
  {
    company: "MEDIORA",
    address:
      "Second floor, Vilakkath Tower, Opposite Cloude 9 hotel, Thankalam, Ernakulam",
    companyId: "mediora",
    contact: "+919567923861",
    employees: "08",
    dueDate: "20-06-2026",
  },
  {
    company: "Stampede Networks Pvt Ltd",
    address:
      "E1, Second Floor, Municipal Veg Market Complex, AM Road, Perumbavoor",
    companyId: "jim_arm_per_434",
    contact: "+918590502983",
    employees: "27",
    dueDate: "20-06-2026",
  },
  {
    company: "Y FLY",
    address:
      "Room No3 ,Second Floor, Swapnil Enclave Marine Drive, High Court, Jn, Shanmugham",
    companyId: "yfly",
    contact: "+919645903691",
    employees: "04",
    dueDate: "20-06-2026",
  },
  {
    company: "Tungston labs",
    address: "Thrikkakara,Ernakulam",
    companyId: "Tungstonlabs",
    contact: "+9716767545456",
    employees: "10",
    dueDate: "20-06-2026",
  },
];

const PendingPaymentDetails = ({ data = payments }) => {
  return (
    <PaymentContainer>
      <PaymentHeader>
        <PaymentTitle>Pending Payment Details</PaymentTitle>
        <PaymentCount>{String(data.length).padStart(2, "0")}</PaymentCount>
      </PaymentHeader>

      <PaymentTableWrapper>
        <PaymentTable>
          <thead>
            <tr>
              <TableHeader>Company name</TableHeader>
              <TableHeader>Address</TableHeader>
              <TableHeader>Company ID</TableHeader>
              <TableHeader>Contact details</TableHeader>
              <TableHeader>No of Employees</TableHeader>
              <TableHeader>Due Date</TableHeader>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.company}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.companyId}</TableCell>
                <TableCell>{item.contact}</TableCell>
                <TableCell>{item.employees}</TableCell>
                <TableCell>{item.dueDate}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </PaymentTable>
      </PaymentTableWrapper>
    </PaymentContainer>
  );
};

export default PendingPaymentDetails;