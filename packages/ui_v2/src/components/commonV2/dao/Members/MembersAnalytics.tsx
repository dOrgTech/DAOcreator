import React, { FC } from "react";
import { MDBBox, MDBRow, MDBCol } from "mdbreact";

import LineGraphic from "components/commonV2/LineGraphic";

export const MembersAnalytics: FC<any> = ({ data }: { data: any }) => {
  const tokenConfig = {
    showPercentage: false,
    height: "0.5rem",
    symbol: "token", // TODO get token symbol (?)
    dataKey: "tokens",
    nameKey: "address"
  };

  const reputationConfig = {
    showPercentage: false,
    height: "0.5rem",
    symbol: "REP",
    dataKey: "reputation",
    nameKey: "address"
  };

  const AnalyticsBoxes = () => (
    <MDBBox>
      <MDBRow>
        <MDBCol size="4">
          <div>Reputation Distribution</div>
        </MDBCol>
        <MDBCol size="8">
          <LineGraphic data={data} config={reputationConfig} />
        </MDBCol>
      </MDBRow>
      <br />
      <MDBRow>
        <MDBCol size="4">
          <div>Token Distribution</div>
        </MDBCol>
        <MDBCol size="8">
          <LineGraphic data={data} config={tokenConfig} />
        </MDBCol>
      </MDBRow>
    </MDBBox>
  );
  return data.length > 0 ? <AnalyticsBoxes /> : null;
};
