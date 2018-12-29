import * as React from "react"
import * as R from "ramda"
import { PieChart as RePieChart, Pie, Tooltip, Cell } from "recharts"
import Blockies from "../../integrations/blockies"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export type PieChartConfig = {
  width: number
  hight: number
  dataKey: string
  nameKey: string
}

export type Props = {
  data: any[]
  config: PieChartConfig
}

const PieChart: React.SFC<Props> = ({ data, config }) => {
  return (
    <RePieChart
      style={{ margin: "auto" }}
      width={config.width}
      height={config.hight}
    >
      <Pie
        dataKey={(dataObject: any) => parseInt(dataObject[config.dataKey])}
        nameKey={config.nameKey}
        data={data}
        labelLine={false}
        label={renderCustomizedLabel}
      >
        {data.map((entry, index) => (
          <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </RePieChart>
  )
}

const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`...${R.take(5, name)} - ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default PieChart
