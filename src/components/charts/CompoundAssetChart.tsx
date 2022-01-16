import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from '../../ts/interfaces';
import { INIT_LINE_CHART_STATE, CHART_COLOR, LINE_CHART_SETTING } from './shared';
import { Period } from '../../core/utils';

interface Props {
    compoundAssetAmounts: number[];
    numOfYear: number;
}

export const CompoundAssetChart = (props: Props) => {
    const [data, setData] = useState<Chart>(INIT_LINE_CHART_STATE);
    const { numOfYear, compoundAssetAmounts } = props;

    useEffect(() => {
        setData({
            labels: Period.getPeriodSequencesInString(numOfYear),
            datasets: [
                {
                    label: '자산',
                    borderColor: CHART_COLOR.PRIMARY,
                    backgroundColor: CHART_COLOR.PRIMARY, 
                    data: compoundAssetAmounts,
                },
            ]
        });

    }, [numOfYear, compoundAssetAmounts]);

    const options: any = {
        responsive: true,
        plugins: LINE_CHART_SETTING.plugins,
        scales: {
            x: {
                title: {
                    display: true,
                    text: '연',
                    font: LINE_CHART_SETTING.font,
                },
            },
            y: {
                title: {
                    display: true,
                    text: '금액',
                    font: LINE_CHART_SETTING.font,
                },
            },
        },
    };

    return <Line data={data} options={options} />;
};