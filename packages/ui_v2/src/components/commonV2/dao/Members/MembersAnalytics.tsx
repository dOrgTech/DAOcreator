import React, { Fragment } from "react";
import { MDBBox, MDBRow, MDBCol } from "mdbreact";

import LineGraphic from "components/commonV2/LineGraphic";

export const MembersAnalytics = ({ data }: { data: any }) => {
  const newTokenConfig = {
    showPercentage: false,
    height: "0.5rem",
    symbol: "token", // TODO get token symbol (?)
    dataKey: "tokens",
    nameKey: "address"
  };

  const newReputationConfig = {
    showPercentage: false,

    height: "0.5rem",
    symbol: "REP",
    dataKey: "reputation",
    nameKey: "address"
  };

  const AnalyticsBoxes = () => (
    <Fragment>
      <MDBBox>
        <MDBRow>
          <MDBCol size="4">
            <div>Reputation Distribution</div>
          </MDBCol>
          <MDBCol size="8">
            <LineGraphic data={data} config={newReputationConfig} />
          </MDBCol>
        </MDBRow>
        <br />
        <MDBRow>
          <MDBCol size="4">
            <div>Token Distribution</div>
          </MDBCol>
          <MDBCol size="8">
            <LineGraphic data={data} config={newTokenConfig} />
          </MDBCol>
        </MDBRow>
      </MDBBox>
    </Fragment>
  );
  return data.length > 0 ? <AnalyticsBoxes /> : null;
};
