import React, { FC, useEffect, useState } from "react";
import { MDBBox, MDBRow, MDBCol } from "mdbreact";

import LineGraphic from "../../LineGraphic";

interface IData {
  [name: string]: string | number;
}

interface ILineConfig {
  showPercentage: boolean;
  height: string;
  symbol?: string;
  dataKey: string;
  nameKey: string;
}

interface IProps {
  data: IData[]; // TODO Potentially update data type to flattened form type,
  getDAOTokenSymbol: () => string;
}

export const MembersAnalytics: FC<IProps> = ({
  data,
  getDAOTokenSymbol
}: IProps) => {
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

  const [totalTokenAmount, setTotalTokenAmount] = useState(0);
  const [totalReputationAmount, setTotalReputationAmount] = useState(0);

  useEffect(() => {
    let count = 0;
    data.map((element: IData) => {
      count += element[tokenConfig.dataKey] as number;
      return element;
    });
    setTotalTokenAmount(count);
  }, [data, tokenConfig.dataKey]);

  useEffect(() => {
    let count = 0;
    data.map((element: IData) => {
      count += element[reputationConfig.dataKey] as number;
      return element;
    });
    setTotalReputationAmount(count);
  }, [data, reputationConfig.dataKey]);

  interface IBoxProps {
    name: string;
    total: number;
    config: ILineConfig;
  }

  const Box: FC<IBoxProps> = ({ name, total, config }: IBoxProps) =>
    total === 0 ? null : (
      <MDBRow>
        <MDBCol size="4">
          <div>{name}</div>
        </MDBCol>
        <MDBCol size="8">
          <LineGraphic data={data} total={total} config={config} />
        </MDBCol>
      </MDBRow>
    );

  const AnalyticsBoxes: FC = () => {
    const reputationBox = (
      <Box
        name={"Reputation Distribution"}
        total={totalReputationAmount}
        config={reputationConfig}
      />
    );
    const tokenBox = (
      <Box
        name={`${getDAOTokenSymbol()} Token Distribution`}
        total={totalTokenAmount}
        config={tokenConfig}
      />
    );

    if (totalReputationAmount === 0 && totalTokenAmount === 0) return null;

    return (
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
        {reputationBox}
        {totalReputationAmount !== 0 && totalTokenAmount !== 0 && <br />}
        {tokenBox}
      </div>
    );
  };

  return <AnalyticsBoxes />;
};
