import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { ChartWrapper, ChartTitle } from "./ReimbursementSummary.Styles";

const data = [
    { month: "Jan", amount: 20 },
    { month: "Feb", amount: 40 },
    { month: "Mar", amount: 30 },
    { month: "Apr", amount: 50 },
    { month: "May", amount: 30 },
    { month: "Jun", amount: 20 },
    { month: "Jly", amount: 60 },
    { month: "Aug", amount: 30 },
    { month: "Ste", amount: 40 },
    { month: "Oct", amount: 20 },
    { month: "Nov", amount: 40 },
    { month: "Dec", amount: 10 },
];

const ReimbursementLineChart = () => {
    return (
        <ChartWrapper>
            <ChartTitle> Reimbursement Summary</ChartTitle>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#2563eb" }}
                        activeDot={{ r: 6 }}
                        animationDuration={5000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartWrapper>
    );
};

export default ReimbursementLineChart;
