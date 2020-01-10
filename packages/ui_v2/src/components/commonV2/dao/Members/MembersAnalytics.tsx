import React from "react";
import { MDBBox } from "mdbreact";

import PieChart from "components/commonV2/PieChart";
import Line from "components/commonV2/Line";

export const MembersAnalytics = ({ data }: { data: any }) => {
  // const tokenDistributionConfig = {
  //   size: 240,
  //   dataKey: "tokens",
  //   nameKey: "address"
  // };

  // const reputationDistributionConfig = {
  //   size: 240,
  //   dataKey: "reputation",
  //   nameKey: "address"
  // };

  const newTokenConfig = {
    height: "10px",
    symbol: "token",
    dataKey: "tokens",
    nameKey: "address"
  };

  const newReputationConfig = {
    height: "10px",
    symbol: "REP",
    dataKey: "tokens",
    nameKey: "address"
  };

  const AnalyticsBoxes = () => (
    <>
      <MDBBox>
        Token Distribution
        {/* <PieChart data={data} config={tokenDistributionConfig} /> */}
        <Line data={data} config={newTokenConfig} />
      </MDBBox>

      <MDBBox>
        Reputation Distribution
        <Line data={data} config={newReputationConfig} />
        {/* <PieChart data={data} config={reputationDistributionConfig} /> */}
      </MDBBox>
    </>
  );
  return data.length > 0 ? <AnalyticsBoxes /> : null;
};
