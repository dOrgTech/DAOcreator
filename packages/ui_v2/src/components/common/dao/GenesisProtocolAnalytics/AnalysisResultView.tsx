import * as React from "react";
import {
  withStyles,
  LinearProgress,
  Typography,
  Popover,
  ButtonBase
} from "@material-ui/core";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { AnalysisResult } from "./utils";

const AnalysisResultView = (props: {
  title: string;
  result: AnalysisResult;
}) => {
  const NormalStyle = {
    root: {
      height: 5,
      backgroundColor: "#94d8ff"
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#00a2ff"
    }
  };
  const WarningStyle = {
    root: {
      height: 5,
      backgroundColor: "#ffd178"
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#ffa800"
    }
  };
  const Normal = withStyles(NormalStyle)(LinearProgress);
  const Warning = withStyles(WarningStyle)(LinearProgress);

  const { title, result } = props;
  let value = result.t;

  // keep a little showing if there is no bar
  if (Math.fround(result.t) === 0 && !result.warning) {
    value = 0.05;
  }

  value *= 100;

  return (
    <PopupState variant="popover" popupId="popup-popover">
      {(popupState: any) => (
        <>
          <ButtonBase
            style={{ width: "100%" }}
            focusRipple
            {...bindTrigger(popupState)}
          >
            <span style={{ width: "100%" }}>
              <Typography variant="subtitle2">{title}</Typography>
              {result.warning ? (
                <Warning
                  variant="determinate"
                  color="secondary"
                  value={value}
                />
              ) : (
                <Normal variant="determinate" color="secondary" value={value} />
              )}
            </span>
          </ButtonBase>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
          >
            {result.message}
          </Popover>
        </>
      )}
    </PopupState>
  );
};

export default AnalysisResultView;
