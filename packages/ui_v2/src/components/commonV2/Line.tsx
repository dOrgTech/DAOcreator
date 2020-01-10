import React, { FC } from "react";
import { MDBContainer, MDBProgress, MDBTooltip } from "mdbreact";

export interface ILineConfig {
  height: string;
  data: string;
  name: string;
}

interface IData {
  value: number;
  name: string;
}

interface IProps {
  data: IData[];
  config: ILineConfig;
}

const Line: FC<IProps> = ({ data, config }: IProps) => {
  let totalAmount = 0;
  for (let i = 0; i < data.length; i++) {
    totalAmount += data[i].value;
  }

  const colours = ["success", "info", "warning", "danger"];

  return (
    <MDBContainer className="text-center">
      {data.map(({ value, name }, index) => {
        const percentage = `${(value / totalAmount) * 100}`
          .toString()
          .substr(0, 4);

        return (
          <MDBTooltip key={index} placement="top" height={config.height}>
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
                height="1rem"
                color={colours[index % 4]}
              >
                {`${(value / totalAmount) * 100}`.toString().substr(0, 4)}%
              </MDBProgress>
            </div>
            <div>
              <p>{`(BLOCKY) ${name}`}</p>
              <p>
                {`${value} ${config.data}`} ({`${percentage}%`})
              </p>
            </div>
          </MDBTooltip>
        );
      })}
    </MDBContainer>
  );
};

export default Line;
