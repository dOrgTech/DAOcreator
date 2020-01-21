import React, { FC } from "react";
import {
  MDBContainer,
  MDBProgress,
  MDBTooltip,
  MDBBox,
  MDBRow
} from "mdbreact";
import Blockies from "react-blockies";

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
  data: IData[];
  total: number;
  config: ILineConfig;
}

const LineGraphic: FC<IProps> = ({ data, total, config }: IProps) => {
  const { showPercentage, height, symbol, dataKey, nameKey } = config;

  const colours = ["success", "info", "warning", "danger"];

  if (total === 0) return null;

  return (
    <MDBContainer className="text-center">
      {data.map((element: IData, index: number) => {
        const value: number = element[dataKey] as number;

        const percentage = `${(value / total) * 100}`.toString().substr(0, 4);

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
                width: `${(value / total) * 100}%`,
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
