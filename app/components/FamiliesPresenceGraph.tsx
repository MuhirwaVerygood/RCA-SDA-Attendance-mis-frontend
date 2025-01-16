"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { month: "January", desktop: 186, mobile: 80, tablet: 50 },
    { month: "February", desktop: 305, mobile: 200, tablet: 120 },
    { month: "March", desktop: 237, mobile: 120, tablet: 95 },
    { month: "April", desktop: 73, mobile: 190, tablet: 70 },
    { month: "May", desktop: 209, mobile: 130, tablet: 90 },
    { month: "June", desktop: 214, mobile: 140, tablet: 110 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
    tablet: {
        label: "Tablet",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function FamiliesPresenceGraph() {
    return (
        <Card className="w-[70%] mt-[3%]">
            <CardHeader>
                <CardTitle>Line Chart - Multiple Devices</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <ChartContainer config={chartConfig}>
                    <LineChart
                        width={400}
                        height={200} // Increased height for better visualization
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="desktop"
                            type="monotone"
                            stroke="hsl(var(--chart-1))" // Desktop color
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="mobile"
                            type="monotone"
                            stroke="hsl(var(--chart-2))" // Mobile color
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="tablet"
                            type="monotone"
                            stroke="hsl(var(--chart-3))" // Tablet color
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Trending up for all devices <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            Showing total members participated for the last 6 months
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
