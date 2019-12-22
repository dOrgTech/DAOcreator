import React from "react";
import { MDBBox } from "mdbreact";

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
  const AnalyticsBoxes = () => (
    <>
      <MDBBox>
        Token Distribution
        <PieChart data={data} config={tokenDistributionConfig} />
      </MDBBox>

      <MDBBox>
        Reputation Distribution
        <PieChart data={data} config={reputationDistributionConfig} />
      </MDBBox>
    </>
  );
  return data.length > 0 ? <AnalyticsBoxes /> : null;
};
