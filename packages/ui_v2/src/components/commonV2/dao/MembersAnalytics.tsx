import React from "react";
import { Box } from "@chakra-ui/core";

import PieChart from "components/commonV2/PieChart";

export const MembersAnalytics = ({ data }: { data: any }) => {
  const tokenDistributionConfig = {
    size: 240,
    dataKey: "tokens",
    nameKey: "address"
  };
  const reputationDistributionConfig = {
    size: 240,
    dataKey: "reputation",
    nameKey: "address"
  };

  return (
    <>
      <Box>
        Token Distribution
        <PieChart data={data} config={tokenDistributionConfig} />
      </Box>

      <Box>
        Reputation Distribution
        <PieChart data={data} config={reputationDistributionConfig} />
      </Box>
    </>
  );
};
