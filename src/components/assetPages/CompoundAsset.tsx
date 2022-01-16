import { useState } from 'react';
import { Num, Rate } from '../../core/utils';
import { State } from '../../core/reactState';
import { CompoundAssetTable } from '../tables/CompoundAssetTable';
import { CompoundAssetChart } from '../charts/CompoundAssetChart';

interface Input {
    assetAmount: number;
    numOfYear: number;
    yearlyYield: number;
    yearlyInvestmentAmount: number;
    hasMonthlyInvestment: boolean;
}

export const CompoundAsset = () => {
    const [input, setInput] = useState<Input>({
        assetAmount: 0,
        numOfYear: 0,
        yearlyYield: 0,
        yearlyInvestmentAmount: 0,
        hasMonthlyInvestment: false,
    });

    const switchHasMonthlyInvestment = () => {
        setInput(prevState => ({
            ...prevState,
            hasMonthlyInvestment: !input.hasMonthlyInvestment,
        }));
    };

    const calculateYearlyCompoundAsset = () => {
        const { assetAmount, yearlyYield, yearlyInvestmentAmount, numOfYear } = input;
        const yearlyCompoundAssets = [];
        const yearlyYieldInDecimal = Rate.convertRateToDecimal(yearlyYield);
        let currentAssetAmount = assetAmount;

        for (let i = 0; i < numOfYear; i++) {
            currentAssetAmount += currentAssetAmount * yearlyYieldInDecimal;
            yearlyCompoundAssets.push(Math.round(currentAssetAmount));

            currentAssetAmount += yearlyInvestmentAmount;
        }

        return yearlyCompoundAssets;
    };

    return (
        <div className='compounding-asset-container'>
            <div>
                <div className='input-group input-with-legend'>
                    <label>자산</label>
                    <input type='text' name='assetAmount' 
                        value={Num.addCommas(input.assetAmount)}
                        onChange={(e) => State.changeNumWithCommasProperty(e, setInput)}/>
                </div>
                <div className='input-group input-with-legend'>
                    <label>연 수익률</label>
                    <input type='number' name='yearlyYield' 
                        value={input.yearlyYield}
                        onChange={(e) => State.changeFloatProperty(e, setInput)}/>
                </div>
                <div className='input-group input-with-legend'>
                    <label>연</label>
                    <input type='number' name='numOfYear' 
                        value={input.numOfYear}
                        onChange={(e) => State.changeIntProperty(e, setInput)}/>
                </div>
                <div className='input-group'>
                    <label>연 추가 투자?</label>
                    <button type='button'
                        className={input.hasMonthlyInvestment ? 'btn-primary' : 'btn-primary outline'}
                        onClick={() => switchHasMonthlyInvestment()}>
                        네
                    </button>
                </div>
                { input.hasMonthlyInvestment && 
                <div className='input-group input-with-legend'>
                    <label>투자 금액</label>
                    <input type='text' name='yearlyInvestmentAmount' 
                        value={Num.addCommas(input.yearlyInvestmentAmount)}
                        onChange={(e) => State.changeNumWithCommasProperty(e, setInput)}
                    />
                </div>
                }
            </div>
            <div className='result-container'>
                <CompoundAssetChart
                    compoundAssetAmounts={calculateYearlyCompoundAsset()} 
                    numOfYear={input.numOfYear}
                />
                <CompoundAssetTable
                    compoundAssetAmounts={calculateYearlyCompoundAsset()}
                    numOfYear={input.numOfYear}
                    initialAssetAmount={input.assetAmount}
                    hasYearlyInvestment={input.hasMonthlyInvestment}
                    yearlyInvestmentAmount={input.yearlyInvestmentAmount} 
                />
            </div>
        </div>
    );
};