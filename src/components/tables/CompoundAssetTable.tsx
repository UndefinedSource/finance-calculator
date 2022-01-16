import { ReactElement } from 'react';
import { Num } from '../../core/utils';

interface Props {
    initialAssetAmount: number;
    numOfYear: number;
    yearlyInvestmentAmount: number;
    compoundAssetAmounts: number[];
    hasYearlyInvestment: boolean;
}

export const CompoundAssetTable = (props: Props) => {
    const { numOfYear, initialAssetAmount, compoundAssetAmounts, yearlyInvestmentAmount } = props; 

    const displayCompoundAssetData = () => {
        const tableData: ReactElement<HTMLTableCellElement>[] = [];
        let prevAssetAmount = initialAssetAmount;

        for (let i = 0; i < numOfYear; i++) {
            const currentYear = i + 1;
            const currentAssetAmount = compoundAssetAmounts[i];

            tableData.push(
                <tr key={i}>
                    <td>{currentYear}</td>
                    <td>{Num.addCommas(prevAssetAmount)}</td>
                    { props.hasYearlyInvestment && <td>{yearlyInvestmentAmount}</td> }
                    <td>{Num.addCommas(currentAssetAmount - prevAssetAmount - yearlyInvestmentAmount)}</td>
                    <td>{Num.addCommas(currentAssetAmount)}</td>
                </tr>
            );

            prevAssetAmount = currentAssetAmount;
        }

        return tableData;
    };

    return (
        <table className='bordered primary'>
            <thead>
                <tr>
                    <th>연</th>
                    <th>현재 자산</th>
                    { props.hasYearlyInvestment && <th>연 적립액</th> }
                    <th>수익</th>
                    <th>총 자산</th>
                </tr>
            </thead>
            <tbody>
                {displayCompoundAssetData()}
            </tbody>
        </table>
    );
};