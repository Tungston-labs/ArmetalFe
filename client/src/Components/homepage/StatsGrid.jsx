import React from "react";
import { Grid } from "./StatsGris.Styles";
import StatsCard from "./StatCard";

import { FaUsers, FaFileContract, FaPassport } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";

const StatsGrid = () => {
  return (
    <Grid>
      <StatsCard 
        number="142" 
        label="Total Employees" 
        icon={FaUsers}
        route="/employee"
      />

      <StatsCard 
        number="12" 
        label="Leave Requests" 
        icon={MdPendingActions}
        route="/employee-leave-request"
      />

      <StatsCard 
        number="5" 
        label="Visa Expiring /
         Contract Expiring" 
        icon={FaPassport}
        route="/employee-Contract-Visa-Expiry"
      />
        <StatsCard 
        number="8" 
        label="Attendance" 
        icon={FaFileContract}
        route="/employee-attendance"
      />
    </Grid>
  );
};

export default StatsGrid;
