import React, { FC, useEffect, useState } from "react";
import {
  MDBContainer,
  MDBProgress,
  MDBTooltip,
  MDBBox,
  MDBRow
} from "mdbreact";
import Blockies from "react-blockies";

export interface ILineConfig {
  showPercentage: boolean;
  height: string;
  symbol?: string;
  dataKey: string;
  nameKey: string;
}

interface IData {
  [name: string]: string | number;
}

interface IProps {
  data: IData[];
  config: ILineConfig;
}

const LineGraphic: FC<IProps> = ({ data, config }: IProps) => {
  const { showPercentage, height, symbol, dataKey, nameKey } = config;

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (!data) return;

    let count = 0;
    data.map(element => {
      count += element[dataKey] as number;
    });
    setTotalAmount(count);
  }, [data, dataKey]);

  const colours = ["success", "info", "warning", "danger"];

  if (!data || data.length < 1) return null;

  return (
    <MDBContainer className="text-center">
      {data.map((element: IData, index: number) => {
        const value: number = element[dataKey] as number;

        const percentage = `${(value / totalAmount) * 100}`
          .toString()
          .substr(0, 4);

        const name = element[nameKey] as string;

        return (
          <MDBTooltip
            className="grey darken-3"
            domElement
            key={index}
            placement="top"
          >
            <div
              style={{
                width: `${(value / totalAmount) * 100}%`,
                display: "inline-block"
              }}
            >
              <MDBProgress
                className="rounded-0"
                material
                value={100}
                height={height}
                color={colours[index % 4]}
              >
                {showPercentage && `${percentage}%`}
              </MDBProgress>
            </div>
            <MDBBox className="align-middle justify-content-center">
              <MDBRow className="m-2">
                <Blockies seed={name} />
                <div>
                  {`${name.substr(0, 6)}...${name.substring(name.length - 4)}`}
                </div>
              </MDBRow>
              <MDBRow className="m-2">
                <div>
                  {`${value} ${symbol}`} ({`${percentage}%`})
                </div>
              </MDBRow>
            </MDBBox>
          </MDBTooltip>
        );
      })}
    </MDBContainer>
  );
};

export default LineGraphic;
