import { LabelList, Pie, PieChart } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
} from '@/components/ui/chart';
import { Family } from './Families';

export interface FamilyPieChartProps {
  families: Family[];
  totalMembers: number;
}

export function FamiliesPieChart({
  totalMembers,
  families,
}: FamilyPieChartProps) {
  const generateUniqueColors = (count: number): string[] => {
    const colors: string[] = [];
    const hueStep = 360 / count; 

    for (let i = 0; i < count; i++) {
      const hue = i * hueStep; 
      const color = `hsl(${hue}, 70%, 50%)`; 
      colors.push(color);
    }

    return colors;
  };

  // Generate unique colors for each family
  const uniqueColors = generateUniqueColors(families.length);

  // Generate chart data with dynamic colors
  const chartData = families.map((family, index) => {
    const lastAttendance = family.attendances?.[0]; // Use the most recent attendance
    const percentage = lastAttendance
      ? (lastAttendance.abaje / totalMembers) * 100
      : 0;

    return {
      familyName: family.name,
      percentage,
      fill: uniqueColors[index],
    };
  });

  // Dynamically generate chartConfig based on chartData
  const dynamicChartConfig = chartData.reduce((config, data: any) => {
    config[data.familyName] = {
      label: data.familyName,
      color: data.fill,
    };
    return config;
  }, {} as ChartConfig);

  // Custom legend renderer
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap gap-2 ">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span>{`${entry.value}`}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-[30%] mr-[1%] h-[calc(100vh-33vh)] flex flex-col justify-center ">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicChartConfig}
          className="mx-auto aspect-square w-full h-full"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="familyName"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              fill="#8884d8"
            >
              <LabelList
                dataKey="percentage"
                position="inside"
                fill="#fff"
                fontSize={12}
                fontWeight="bold"
                formatter={(value: number) => `${value.toFixed(2)}%`}
              />
            </Pie>

            <ChartLegend
              content={renderCustomLegend}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
