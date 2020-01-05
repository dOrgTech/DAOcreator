import React from "react";
import { MDBBox, MDBContainer, MDBRow } from "mdbreact";

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
      <MDBContainer>
        <MDBRow className="justify-content-center">
          <MDBBox>
            Token Distribution
            <PieChart data={data} config={tokenDistributionConfig} />
          </MDBBox>
        </MDBRow>

        <MDBRow className="justify-content-center">
          <MDBBox>
            Reputation Distribution
            <PieChart data={data} config={reputationDistributionConfig} />
          </MDBBox>
        </MDBRow>
      </MDBContainer>
    </>
  );
  return data.length > 0 ? <AnalyticsBoxes /> : null;
};
