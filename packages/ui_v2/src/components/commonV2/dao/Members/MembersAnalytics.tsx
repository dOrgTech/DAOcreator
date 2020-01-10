import React from "react";
import { MDBBox } from "mdbreact";

import PieChart from "components/commonV2/PieChart";
import LineGraphic from "components/commonV2/LineGraphic";

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
    symbol: "token", // TODO get token symbol (?)
    dataKey: "tokens",
    nameKey: "address"
  };

  const newReputationConfig = {
    height: "10px",
    symbol: "REP",
    dataKey: "reputation",
    nameKey: "address"
  };

  const AnalyticsBoxes = () => (
    <>
      <MDBBox>
        Token Distribution
        {/* <PieChart data={data} config={tokenDistributionConfig} /> */}
        <LineGraphic data={data} config={newTokenConfig} />
      </MDBBox>

      <MDBBox>
        Reputation Distribution
        <LineGraphic data={data} config={newReputationConfig} />
        {/* <PieChart data={data} config={reputationDistributionConfig} /> */}
      </MDBBox>
    </>
  );
  return data.length > 0 ? <AnalyticsBoxes /> : null;
};
