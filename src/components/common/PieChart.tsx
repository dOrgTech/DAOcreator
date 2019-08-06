import * as React from "react";
import {
  Chart,
  PieSeries,
  Tooltip
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker } from "@devexpress/dx-react-chart";

export interface PieChartConfig {
  size: number;
  dataKey: string;
  nameKey: string;
}

export interface Props {
  data: any[];
  config: PieChartConfig;
}

interface State {
  targetItem: any;
}

class PieChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      targetItem: undefined
    };
  }

  render() {
    const { data, config } = this.props;
    const { targetItem } = this.state;

    console.log(config.nameKey);

    const TooltipContent = () => (
      <div>
        <Tooltip.Content
          targetItem={targetItem}
          text={`${config.nameKey}: ${data[targetItem.point][config.nameKey]}`}
        />
        <Tooltip.Content
          targetItem={targetItem}
          text={`${config.dataKey}: ${data[targetItem.point][config.dataKey]}`}
        />
      </div>
    );

    return (
      <Chart data={data} height={config.size}>
        <PieSeries valueField={config.dataKey} argumentField={config.nameKey} />
        <EventTracker />
        <Tooltip
          targetItem={targetItem}
          contentComponent={TooltipContent}
          onTargetItemChange={(targetItem: any) =>
            this.setState({ targetItem })
          }
        />
        <Animation />
      </Chart>
    );
  }
}

export default PieChart;
