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

// Function to transform the data
const transformData = (families: Family[]) => {
  const allDates = new Set<string>();

  families.forEach((family) => {
    family.attendances.forEach((attendance) => {
      allDates.add(attendance.date);
    });
  });

  // Sort dates
  const sortedDates = Array.from(allDates).sort();

  // Build dataset with each date as key and family attendance as values
  const chartData = sortedDates.map((date) => {
    const entry: any = { date };
    families.forEach((family) => {
      const attendance = family.attendances.find((a) => a.date === date);
      entry[family.familyName] = attendance ? Math.floor(attendance.abaje) : 0; // Ensure integer values
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

  // Find the maximum attendance value to set the upper limit for Y-axis
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
            tickFormatter={(tick) => tick.toFixed(0)} // Ensure Y-axis shows whole numbers
            domain={[0, maxAttendance]} // Ensure the Y-axis domain is from 0 to the maximum attendance
            interval={Math.max(1, Math.floor(maxAttendance / 10))} // Adjust the interval to be an integer
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
