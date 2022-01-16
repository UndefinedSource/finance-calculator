import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Period } from '../../core/utils';
import { Chart } from '../../ts/interfaces';
import { INIT_LINE_CHART_STATE, CHART_COLOR, LINE_CHART_SETTING } from './shared';

interface InterestChartProps {
    interests: number[];
}

interface InstallmentSavingInterestChartProps extends InterestChartProps {
    term: number;
    isTermInMonth: boolean;
}

interface FixedDepositInterestChartProps extends InterestChartProps {
    termInYear: number;
    taxRateInDecimal: number;
    isMonthlyCompoundInterest: boolean;
    hasTaxOnCompoundInterest: boolean;
}

export const InstallmentSavingInterestChart = (props: InstallmentSavingInterestChartProps) => {
    const [data, setData] = useState<Chart>(INIT_LINE_CHART_STATE);
    const { interests, isTermInMonth } = props;

    useEffect(() => {
        const term = isTermInMonth ? props.term : Period.convertYearToMonth(props.term);

        setData({
            labels: Period.getPeriodSequencesInString(term),
            datasets: [
                {
                    label: '이자',
                    borderColor: CHART_COLOR.PRIMARY,
                    backgroundColor: CHART_COLOR.PRIMARY, 
                    data: interests,
                },
            ],
        });
    }, [interests, isTermInMonth, props.term]);

    const options: any = {
        responsive: true,
        plugins: LINE_CHART_SETTING.plugins,
        scales: {
            x: {
                title: {
                    display: true,
                    text: '월',
                    font: LINE_CHART_SETTING.font,
                },
            },
            y: {
                title: {
                    display: true,
                    text: '이자',
                    font: LINE_CHART_SETTING.font,
                },
            },
        },
    };

    return <Line data={data} options={options} />;
};

export const FixedDepositInterestChart = (props: FixedDepositInterestChartProps) => {
    const [data, setData] = useState<Chart>(INIT_LINE_CHART_STATE);
    const { interests, taxRateInDecimal, hasTaxOnCompoundInterest } = props;

    useEffect(() => {
        const interestsAfterTax = [];

        if (hasTaxOnCompoundInterest) {
            for (let i = 0; i < interests.length; i++) {
                const interestAfterTax = interests[i] - Math.round(interests[i] * taxRateInDecimal);
                interestsAfterTax.push(Math.round(interestAfterTax));
            }
        }

        setData({
            labels: Period.getPeriodSequencesInString(interests.length),
            datasets: [
                {
                    label: '이자',
                    borderColor: CHART_COLOR.PRIMARY,
                    backgroundColor: CHART_COLOR.PRIMARY, 
                    data: hasTaxOnCompoundInterest ? interestsAfterTax : interests,
                },
            ],
        });
    }, [hasTaxOnCompoundInterest, taxRateInDecimal, interests]);

    const options: any = {
        responsive: true,
        plugins: LINE_CHART_SETTING.plugins,
        scales: {
            x: {
                title: {
                    display: true,
                    text: `${props.isMonthlyCompoundInterest ? '월' : '연'}`,
                    font: {
                        size: 20,
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: '이자',
                    font: {
                        size: 20,
                    },
                },
            },
        },
    };

    return <Line data={data} options={options} />;
};