import { ReactElement } from 'react';
import { Num } from '../../core/utils';

interface Props {
    principal: number;
    term: number;
    taxRateInDecimal: number;
    interests: number[];
    hasTaxOnCompoundInterest: boolean;
    isYearlyCompoundSaving: boolean;
}

export const FixedDepositInterestTable = (props: Props) => {
    const { principal, interests, taxRateInDecimal, hasTaxOnCompoundInterest, isYearlyCompoundSaving } = props;

    const displayInterestData = (): ReactElement<HTMLTableCellElement>[] | null => {
        const tableData: ReactElement<HTMLTableCellElement>[] = [];
        let prevTotalAmount = principal;

        interests.forEach((interest, i) => {
            const currentTerm = i + 1;
            const tax = Math.round(interest * taxRateInDecimal);
            const interestAfterTax = interest - tax;

            if (hasTaxOnCompoundInterest) {
                tableData.push( 
                    <tr key={i}>
                        <td>{currentTerm}</td>
                        <td>{Num.addCommas(prevTotalAmount)}</td>
                        <td>{Num.addCommas(interest)}</td>
                        <td>{Num.addCommas(tax)}</td>
                        <td>{Num.addCommas(interestAfterTax)}</td>
                        <td>{Num.addCommas(prevTotalAmount + interestAfterTax)}</td>
                    </tr>
                );

                prevTotalAmount += interestAfterTax;
            } else {
                tableData.push(
                    <tr key={i}>
                        <td>{currentTerm}</td>
                        <td>{Num.addCommas(prevTotalAmount)}</td>
                        <td>{Num.addCommas(interest)}</td>
                        <td>{Num.addCommas(prevTotalAmount + interest)}</td>
                    </tr>
                );

                prevTotalAmount += interest;
            }
        });

        return tableData;
    };

    const displayTableHeader = () => {
        return <tr>
                    <th>{isYearlyCompoundSaving ? '연' : '월'}</th>
                    <th>총 금액</th>
                    <th>이자</th>
                    {hasTaxOnCompoundInterest ? 
                        <>
                            <th>세금</th>
                            <th>세후 이자</th>
                            <th>총 금액 + 세후 이자</th>
                        </> 
                        :
                        <>
                            <th>총 금액 + 이자</th>
                        </>
                    }
            </tr>
    };

    return (
        <table className='bordered primary'>
            <thead>
                {displayTableHeader()}
            </thead>
            <tbody>
                {displayInterestData()}
            </tbody>
        </table>
    );
};