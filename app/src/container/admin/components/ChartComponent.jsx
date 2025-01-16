"use client"

import { useEffect, useState } from 'react';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import axios from 'axios';

const chartConfig = {
    service: {
        label: 'Tư vấn dịch vụ',
        color: 'var(--chart-1)'
    },
    errors: {
        label: 'Các loại lỗi',
        color: 'var(--chart-2)'
    }
};

export default function BarChartComponent() {
    const [chartData, setChartData] = useState([]);
    const [totals, setTotals] = useState({ service: 0, others: 0 });

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const response = await axios.get('http://localhost:5050/ticket');
                const tickets = response.data;

                // Get last 7 days
                const days = [];
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    days.push(date);
                }

                // Initialize chart data structure
                const transformedData = days.map(date => ({
                    day: date.toLocaleDateString('vi-VN', { weekday: 'long' }),
                    date: date.toISOString().split('T')[0],
                    service: 0,
                    errors: 0
                }));

                // Initialize a temporary totals object
                const tempTotals = { service: 0, others: 0 };

                // Count tickets for each day and category
                tickets.forEach(ticket => {
                    const ticketDate = new Date(ticket.creationTime).toISOString().split('T')[0];
                    const dayData = transformedData.find(d => d.date === ticketDate);

                    if (dayData) {
                        if (ticket.tags.includes('Tư vấn dịch vụ')) {
                            dayData.service++;
                            tempTotals.service++; // Increment temporary service total
                        } else if (ticket.tags.some(tag => tag.includes('Lỗi'))) {
                            dayData.errors++;
                            tempTotals.others++; // Increment temporary others total
                        }
                    }
                });

                // Update totals state with the temporary totals
                setTotals(tempTotals);
                // Remove the date property as it's no longer needed
                const finalData = transformedData.map(({ date, day, service, errors }) => ({
                    day,
                    service,
                    errors
                }));
                setChartData(finalData);

            } catch (error) {
                console.error('Error fetching ticket data:', error);
            }
        };

        fetchTicketData();
    }, []);

    return (
        <>
            <ChartContainer
                className="aspect-auto h-[300px] xl:h-[200px] 2xl:h-[250px] w-full"
                config={chartConfig}
            >
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="day"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar dataKey="service" fill="var(--chart-1)" radius={4} />
                    <Bar dataKey="errors" fill="var(--chart-2)" radius={4} />
                </BarChart>
            </ChartContainer>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums justify-between leading-none">
                <div className="text-center font-normal text-sm text-muted-foreground">
                    <Badge variant="secondary" className={"bg-[#5d8cf2] text-white hover:bg-[#5d8cf2]"}>Tư vấn dịch vụ</Badge><p>{totals.service}</p>
                </div>
                <div className="text-center font-normal text-sm text-muted-foreground">
                    <Badge variant="secondary" className={"bg-[#93c5fd] text-white hover:bg-[#93c5fd]"}>Các loại lỗi</Badge><p>{totals.others}</p>
                </div>
            </div>
        </>
    );
}
