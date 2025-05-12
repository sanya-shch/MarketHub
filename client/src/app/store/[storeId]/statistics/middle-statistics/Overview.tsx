import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

import { IMonthlySales } from '@/shared/types/statistics.interface';

import { formatPrice } from '@/utils/formatPrice';

const chartConfig = {
    value: {
        label: 'Income',
        color: '#3b82f6',
    },
} satisfies ChartConfig;

interface OverviewProps {
    data: IMonthlySales[];
}

export const Overview = ({ data }: OverviewProps) => {
    return (
        <Card>
            <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-4'>
                <CardTitle className='text-xl font-medium tracking-[0.1px] line-clamp-1'>
                    Income
                </CardTitle>
            </CardHeader>

            <ChartContainer
                className='aspect-auto h-[310px] w-full'
                config={chartConfig}
            >
                <AreaChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey='date'
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />

                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                labelFormatter={formatPrice}
                                indicator='line'
                            />
                        }
                    />

                    <Area
                        dataKey='value'
                        type='natural'
                        fill='var(--color-value)'
                        stroke='var(--color-value)'
                    />
                </AreaChart>
            </ChartContainer>
        </Card>
    );
};
