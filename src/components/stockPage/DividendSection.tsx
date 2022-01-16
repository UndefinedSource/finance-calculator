import { useState } from 'react';
import { Num, Rate } from '../../core/utils';
import { State } from '../../core/reactState';

interface RequiredCapitalSectionState {
    desiredDividend: number;
    dividendRate: number;
}

interface YearlyDividendSectionState {
    capitalAmount: number;
    dividendRate: number;
}

export const RequiredCapitalSection = () => {
    const [input, setInput] = useState<RequiredCapitalSectionState>({
        desiredDividend: 0,
        dividendRate: 0,
    });

    const calculateRequiredCapital = () => {
        const dividendRateInDecimal = Rate.convertRateToDecimal(input.dividendRate);
        return Math.round(input.desiredDividend / dividendRateInDecimal);
    };

    return (
        <div className='required-capital-container'>
            <div className='input-group input-with-legend'>
                <label>희망 연배당</label>
                <input type='text' name='desiredDividend' 
                    value={Num.addCommas(input.desiredDividend)}
                    onChange={(e) => State.changeNumWithCommasProperty(e, setInput)}
                />
            </div>
            <div className='input-group input-with-legend'>
                <label>배당률</label>
                <input type='number' name='dividendRate' 
                    value={input.dividendRate.toString()}
                    onChange={(e) => State.changeFloatProperty(e, setInput)}
                />
            </div>
            <div className='result-container'>
                <div className='result-group'>
                    <label>필요 금액</label>
                    <span>{Num.addCommas(calculateRequiredCapital())}</span>
                </div> 
            </div>
        </div>
    );
};

export const YearlyDividendSection = () => {
    const [input, setInput] = useState<YearlyDividendSectionState>({
        capitalAmount: 0,
        dividendRate: 0,
    });

    const calculateYearlyDividend = () => {
        const { capitalAmount, dividendRate } = input;
        const dividendRateInDecimal = Rate.convertRateToDecimal(dividendRate);

        return Math.round(capitalAmount * dividendRateInDecimal);
    };

    return (
        <div className='yearly-dividend-container'>
            <div className='input-group input-with-legend'>
                <label>투자 금액</label>
                <input type='text' name='capitalAmount' 
                    value={Num.addCommas(input.capitalAmount)}
                    onChange={(e) => State.changeNumWithCommasProperty(e, setInput)}
                />
            </div>
            <div className='input-group input-with-legend'>
                <label>배당률</label>
                <input type='number' name='dividendRate' 
                    value={input.dividendRate.toString()}
                    onChange={(e) => State.changeFloatProperty(e, setInput)}
                />
            </div>
            <div className='result-container'>
                <div className='result-group'>
                    <label>연 배당</label>
                    <span>{Num.addCommas(calculateYearlyDividend())}</span>
                </div> 
            </div>
        </div>
    );
};