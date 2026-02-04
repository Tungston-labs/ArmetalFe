import React, { useState } from "react";
import {
    PageWrapper,
    Header,
    CardWrapper,
    Card,
    CardTitle,
    CardValue,
    HistoryTable,
    Table,
    Th,
    Td,
    Tr,
    CalendarWrapper,
} from "./AttendanceDetails.Styles";

const AttendanceDetails = () => {
    const today = new Date();
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const [selectedDate, setSelectedDate] = useState(formatDate(today));
    const todayPunch = {
        punchIn: "09:00 AM",
        punchOut: "06:15 PM",
    };
    const weeklyHours = "45 hrs";
    const monthlyHours = "182 hrs";
    const history = [
        { date: "01 Feb 2026", in: "09:05 AM", out: "06:10 PM", location: "kakkanad, thrikkakara" },
        { date: "01 Feb 2026", in: "09:00 AM", out: "06:00 PM", location: "kakkanad, thrikkakara" },
        { date: "01 Feb 2026", in: "09:10 AM", out: "06:20 PM", location: "kakkanad, thrikkakara" },
    ];
    const cardList = [
        {
            title: "Today Punch In",
            value: todayPunch.punchIn,
        },
        {
            title: "Today Punch Out",
            value: todayPunch.punchOut,
        },
        {
            title: "Weekly Hours",
            value: weeklyHours,
        },
        {
            title: "Monthly Hours",
            value: monthlyHours,
        },
    ];

    return (
        <PageWrapper>

            <Header>Attendance Details</Header>
            <CardWrapper>
                {cardList.map((card, index) => (
                    <Card key={index}>
                        <CardTitle>{card.title}</CardTitle>
                        <CardValue>{card.value}</CardValue>
                    </Card>
                ))}
            </CardWrapper>
            <HistoryTable>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <Header>Previous Attendance</Header>
                    <div>
                        <CalendarWrapper>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                }}
                            />
                        </CalendarWrapper>
                    </div>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <Th>Date</Th>
                            <Th>Punch In</Th>
                            <Th>Punch Out</Th>
                            <Th>Location</Th>
                        </tr>
                    </thead>

                    <tbody>
                        {history.map((item, index) => (
                            <Tr key={index}>
                                <Td>{item.date}</Td>
                                <Td>{item.in}</Td>
                                <Td>{item.out}</Td>
                                <Td>{item.location}</Td>
                            </Tr>
                        ))}
                    </tbody>
                </Table>
            </HistoryTable>

        </PageWrapper>
    );
};

export default AttendanceDetails;
