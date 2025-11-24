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
        route="/employees"
      />

      <StatsCard 
        number="12" 
        label="Leave Requests" 
        icon={MdPendingActions}
        route="/leave-requests"
      />

      <StatsCard 
        number="5" 
        label="Visa Expiring /
         Contract Expiring" 
        icon={FaPassport}
        route="/visa-expiry"
      />
        <StatsCard 
        number="8" 
        label="Attendance" 
        icon={FaFileContract}
        route="/contract-expiry"
      />
    </Grid>
  );
};

export default StatsGrid;
