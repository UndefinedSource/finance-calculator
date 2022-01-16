import { useState } from 'react';
import { YearlyDividendSection, RequiredCapitalSection } from './DividendSection';

enum CalculationType {
    GetRequiredCapital = 'GetRequiredCapital',
    GetYearlyDividend = 'GetYearlyDividend',
}

export const Dividend = () => {
    const [sectionType, setSectionType] = useState<string>(CalculationType.GetRequiredCapital);

    const showSelectedSection = () => {
        switch (sectionType) {
            case CalculationType.GetRequiredCapital:
                return <RequiredCapitalSection />;
            case CalculationType.GetYearlyDividend:
                return <YearlyDividendSection />;
            default:
                break;
        }

        return null;
    };

    return (
        <div className='dividend-container'>
            <div className='radio-btn-list-container'>
                <input type='radio' id='dividendTypeYearlyDividend' className='radio-btn btn-primary' name='dividendType'
                checked={sectionType === CalculationType.GetRequiredCapital} readOnly
                onClick={() => setSectionType(CalculationType.GetRequiredCapital)} />
                <label htmlFor='dividendTypeYearlyDividend'>희망 연배당에 필요한 금액</label>
                <input type='radio' id='dividendTypeRequiredCapital' className='radio-btn btn-primary' name='dividendType'
                onClick={() => setSectionType(CalculationType.GetYearlyDividend)} />
                <label htmlFor='dividendTypeRequiredCapital'>연배당</label>
            </div>
            {showSelectedSection()}
        </div>
    );
};