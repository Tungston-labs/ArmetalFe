import React, { forwardRef } from "react";

import {
  Wrapper,
  Header,
  SectionTitle,
  Cards,
  Card,
  BreakDown,
  BreakCard,
  Table
} from "./styles";

const LeavePrint = forwardRef(({ data, selectedMonth }, ref) => {

  const total = data.length;

  const pending = data.filter(
    (item) => item.status === "pending"
  ).length;

  const approved = data.filter(
    (item) => item.status === "approved"
  ).length;

  const rejected = data.filter(
    (item) => item.status === "rejected"
  ).length;

  const employeesOnLeave =
    new Set(data.map(item => item.employee?.id)).size;

  const sick =
    data.filter(
      x=>x.leave_type?.toLowerCase()=="sick leave"
    ).length;

  const casual =
    data.filter(
      x=>x.leave_type?.toLowerCase()=="casual leave"
    ).length;

  const annual =
    data.filter(
      x=>x.leave_type?.toLowerCase()=="annual leave"
    ).length;

  const other =
    total - (sick + casual + annual);

  return (
    <Wrapper ref={ref}>

      <Header>
        <h1>Rekory HR Leave Report</h1>
        <p>
          Leave Summary - {selectedMonth}
        </p>
      </Header>

      <SectionTitle>
        Leave Summary
      </SectionTitle>

      <Cards>

        <Card>
          <span>Total Requests</span>
          <h2>{total}</h2>
        </Card>

        <Card>
          <span>Pending</span>
          <h2>{pending}</h2>
        </Card>

        <Card>
          <span>Approved</span>
          <h2>{approved}</h2>
        </Card>

        <Card>
          <span>Rejected</span>
          <h2>{rejected}</h2>
        </Card>

        <Card>
          <span>Employees on Leave</span>
          <h2>{employeesOnLeave}</h2>
        </Card>

      </Cards>


      <SectionTitle>
        Monthly Leave Breakdown
      </SectionTitle>

      <BreakDown>

        <BreakCard>
          Sick Leave : {sick}
        </BreakCard>

        <BreakCard>
          Casual Leave : {casual}
        </BreakCard>

        <BreakCard>
          Annual Leave : {annual}
        </BreakCard>

        <BreakCard>
          Other : {other}
        </BreakCard>

      </BreakDown>


      <SectionTitle>
        Employee Leave Details
      </SectionTitle>

      <Table>

        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {data.map((leave)=>(
            <tr key={leave.id}>

              <td>
                {leave.employee?.name}
              </td>

              <td>
                {leave.employee?.department}
              </td>

              <td>
                {leave.leave_type}
              </td>

              <td>
                {leave.from_date?.slice(0,10)}
              </td>

              <td>
                {leave.to_date?.slice(0,10)}
              </td>

              <td>
                {leave.status}
              </td>

            </tr>
          ))}

        </tbody>

      </Table>

    </Wrapper>
  )
})

export default LeavePrint;