import * as React from "react";
import {
  withStyles,
  Theme,
  LinearProgress,
  Tooltip,
  Grid,
  Typography
} from "@material-ui/core";
import { AnalysisResult } from "./utils";

const AnalysisResultView = (props: {
  title: string;
  result: AnalysisResult;
}) => {
  const NormalStyle = {
    root: {
      height: 10,
      backgroundColor: "#94d8ff"
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#00a2ff"
    }
  };
  const WarningStyle = {
    root: {
      height: 10,
      backgroundColor: "#ffd178"
    },
    bar: {
      borderRadius: 20,
      backgroundColor: "#ffa800"
    }
  };
  const Normal = withStyles(NormalStyle)(LinearProgress);
  const Warning = withStyles(WarningStyle)(LinearProgress);

  const Info = withStyles((theme: Theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      maxWidth: 600,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
      paddingRight: 40
    }
  }))(Tooltip);

  const { title, result } = props;
  let value = result.t;

  // keep a little showing if there is no bar
  if (Math.fround(result.t) === 0 && !result.warning) {
    value = 0.05;
  }

  value *= 100;

  return (
    <Info title={result.message} placement={"top"}>
      <Grid>
        <Typography variant="subtitle2">{title}</Typography>
        {result.warning ? (
          <Warning variant="determinate" color="secondary" value={value} />
        ) : (
          <Normal variant="determinate" color="secondary" value={value} />
        )}
      </Grid>
    </Info>
  );
};

export default AnalysisResultView;
