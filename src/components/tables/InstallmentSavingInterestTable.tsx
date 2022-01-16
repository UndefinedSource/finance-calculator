import { ReactElement } from 'react';
import { Num, Period } from '../../core/utils';

interface Props {
    monthlySaving: number;
    termInMonth: number;
    isTermInMonth: boolean;
    interests: number[];
}

export const InstallmentSavingInterestTable = (props: Props) => {
    const { monthlySaving, termInMonth, isTermInMonth, interests } = props;
    
    const displayInterestData = (): ReactElement<HTMLTableCellElement>[] | null => {
        const term = isTermInMonth ? termInMonth : Period.convertYearToMonth(termInMonth);
        const tableData: ReactElement<HTMLTableCellElement>[] = [];
        let currentDeposit = 0;
        let totalInterest = 0;

        if (interests.length !== term)
            return null;

        for (let i = 0; i < term; i++) {
            const month = i + 1;
            currentDeposit += monthlySaving;
            totalInterest += interests[i];

            tableData.push(
                <tr key={i}>
                    <td>{month}</td>
                    <td>{Num.addCommas(currentDeposit)}</td>
                    <td>{Num.addCommas(interests[i])}</td>
                    <td>{Num.addCommas(totalInterest)}</td>
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
                    <th>현재 납입금</th>
                    <th>이자</th>
                    <th>총 이자</th>
                </tr>
            </thead>
            <tbody>
                {displayInterestData()}
            </tbody>
        </table>
    );
};