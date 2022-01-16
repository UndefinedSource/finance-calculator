import { ReactElement } from 'react';
import { Num } from '../../core/utils';

interface Props {
    principal: number;
    termInMonth: number;
    monthlyInterests: number[];
    monthlyPayments: number[];
    monthlyPaymentsOnPrincipal: number[];
}

export const LoanTable = (props: Props) => {
    const { principal, termInMonth, monthlyPayments, monthlyInterests, monthlyPaymentsOnPrincipal } = props;

    const displayMonthlyPaymentData = (): ReactElement<HTMLTableCellElement>[] | null => {
        if (monthlyInterests.length !== termInMonth)
            return null;

        const tableData: ReactElement<HTMLTableCellElement>[] = [];
        let currentRepaymentTotal = 0;

        for (let i = 0; i < termInMonth; i++) {
            const currentTerm = i + 1;
            currentRepaymentTotal += monthlyPaymentsOnPrincipal[i];

            tableData.push(
                <tr key={i}>
                    <td>{currentTerm}</td>
                    <td>{Num.addCommas(monthlyPaymentsOnPrincipal[i])}</td>
                    <td>{Num.addCommas(monthlyInterests[i])}</td>
                    <td>{Num.addCommas(monthlyPayments[i])}</td>
                    <td>{Num.addCommas(currentRepaymentTotal)}</td>
                    <td>{Num.addCommas(principal - currentRepaymentTotal)}</td>
                </tr>
            );
        }

        return tableData;
    };

    return (
        <table className='bordered primary'>
            <thead>
                <tr>
                    <th>월</th>
                    <th>원금</th>
                    <th>이자</th>
                    <th>상환금</th>
                    <th>총 납입원금</th>
                    <th>잔금</th>
                </tr>
            </thead>
            <tbody>
                {displayMonthlyPaymentData()}
            </tbody>
        </table>
    );
};
