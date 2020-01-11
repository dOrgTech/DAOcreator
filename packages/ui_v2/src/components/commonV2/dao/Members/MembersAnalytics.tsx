import React from "react";
import { MDBBox } from "mdbreact";

import LineGraphic from "components/commonV2/LineGraphic";

export const MembersAnalytics = ({ data }: { data: any }) => {
  const newTokenConfig = {
    height: "0.5rem",
    symbol: "token", // TODO get token symbol (?)
    dataKey: "tokens",
    nameKey: "address"
  };

  const newReputationConfig = {
    height: "0.5rem",
    symbol: "REP",
    dataKey: "reputation",
    nameKey: "address"
  };

  const AnalyticsBoxes = () => (
    <>
      <MDBBox display="flex" flex="row">
        <div style={{ whiteSpace: "nowrap", width: "10rem" }}>
          Token Distribution
        </div>
        <LineGraphic data={data} config={newTokenConfig} />
      </MDBBox>

      <MDBBox display="flex" flex="row">
        <div style={{ whiteSpace: "nowrap", width: "10rem" }}>
          Reputation Distribution
        </div>
        <LineGraphic data={data} config={newReputationConfig} />
      </MDBBox>
    </>
  );
  return data.length > 0 ? <AnalyticsBoxes /> : null;
};
