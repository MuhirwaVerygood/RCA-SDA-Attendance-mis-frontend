import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface Attendance {
  id: number;
  abanditswe: number;
  abaje: number;
  date: string;
}

interface Family {
  id: number;
  familyName: string;
  attendances: Attendance[];
}

interface FamilyPresenceProps {
  families: Family[];
  totalMembers: number;
}

const transformData = (families: Family[]) => {
  const allDates = new Set<string>();

  families.forEach((family) => {
    family.attendances.forEach((attendance) => {
      allDates.add(attendance.date);
    });
  });

  const sortedDates = Array.from(allDates).sort();

  const chartData = sortedDates.map((date) => {
    const entry: any = { date };
    families.forEach((family) => {
      const attendance = family.attendances.find((a) => a.date === date);
        entry[family.familyName] = attendance ? Math.floor(attendance.abaje) : 0;
    });
    return entry;
  });

  return chartData;
};

const FamiliesPresenceGraph: React.FC<FamilyPresenceProps> = ({
  families,
  totalMembers,
}) => {
  const chartData = transformData(families);

  const maxAttendance = chartData.reduce((max, entry) => {
    families.forEach((family) => {
      max = Math.max(max, entry[family.familyName]);
    });
    return max;
  }, 0);

  return (
    <Card className="h-[calc(100vh-33vh)]">
      <CardHeader>
        <CardTitle>{totalMembers} People</CardTitle>
        <CardDescription>Maximum present</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart width={800} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
                      tickFormatter={(tick) => tick.toFixed(0)}
                      domain={[0, maxAttendance]}
                      interval={Math.max(1, Math.floor(maxAttendance / 10))}
          />
          <Tooltip />
          <Legend />
          {families.map((family) => (
            <Line
              key={family.id}
              type="monotone"
              dataKey={family.familyName}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
            />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default FamiliesPresenceGraph;
