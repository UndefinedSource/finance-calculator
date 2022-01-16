import { useState } from 'react';
import { State } from '../../core/reactState';
import { Period, Num, Rate } from '../../core/utils';
import { InstallmentSaving } from '../../core/calculator/deposit';
import { InstallmentSavingProps } from '../../ts/interfaces';
import { InstallmentSavingInterestChart } from '../charts/DepositChart';
import { InstallmentSavingInterestTable } from '../tables/InstallmentSavingInterestTable';
import { TAX_TYPE, DepositResult, TaxSelection } from './shared';
import { TermSelection } from '../shared/TermSelection';
import { WithDepositResult } from './WithDepositResult';
import { ControlBtnSection } from '../shared/ControlBtnSection';

interface Input {
    monthlySaving: number;
    interestRate: number;
    termInMonth: number;
    taxRate: number;
    isTermInMonth: boolean;
    isMonthlyCompoundInterest: boolean;
}

const InstallmentSavingPage = (props: InstallmentSavingProps) => {
    const INIT_INPUT_STATE = {
        monthlySaving: 0,
        interestRate: 0,
        termInMonth: 0,
        taxRate: TAX_TYPE.INCOME,
        isTermInMonth: true,
        isMonthlyCompoundInterest: false,
    };

    const [input, setInput] = useState<Input>(INIT_INPUT_STATE);
    const { resultState } = props;

    const resetStates = () => {
        setInput(INIT_INPUT_STATE);
        props.resetResultState();
    };

    const switchIsMonthlyCompoundInterest = () => {
        setInput(prevState => ({
            ...prevState,
            isMonthlyCompoundInterest: !input.isMonthlyCompoundInterest,
        }));
    };

    const setIsTermInMonth = (val: boolean) => {
        setInput(prevState => ({
            ...prevState,
            isTermInMonth: val,
        }));
    };

    const setTaxRate = (val: number) => {
       setInput(prevState => ({
            ...prevState,
            taxRate: val,
       }));
    };

    const handleSetResult = (principal: number, interestBeforeTax: number, interests: number[], tax: number, actualInterestRate: number) => {
        props.setResultState({
            principal,
            interest: interestBeforeTax,
            interests,
            tax,
            totalAmount: principal + interestBeforeTax - tax,
            actualInterestRate,
        });
    };
    
    const calculateMonthlyCompoundInstallmentSaving = (termInMonth: number) => {
        const { monthlySaving, interestRate, taxRate } = input;
        const principal = monthlySaving * termInMonth;
        const interestBeforeTax = InstallmentSaving.getMonthlyCompoundInterestBeforeTax(monthlySaving, termInMonth, interestRate);
        const interests = InstallmentSaving.getMonthlyCompoundInterestsBeforeTax(monthlySaving, termInMonth, interestRate);
        const tax = InstallmentSaving.getTaxOnInterest(interestBeforeTax, taxRate);
        const actualInterestRate = Rate.getActualRate(principal, interestBeforeTax - tax, Period.convertMonthToYear(termInMonth));

        handleSetResult(principal, interestBeforeTax, interests, tax, actualInterestRate);
    };

    const calculateInstallmentSaving = (termInMonth: number) => {
        const { monthlySaving, interestRate, taxRate } = input;
        const principal = monthlySaving * termInMonth;
        const interestBeforeTax = InstallmentSaving.getInterestBeforeTax(monthlySaving, termInMonth, interestRate);
        const interests = InstallmentSaving.getInterestsBeforeTax(monthlySaving, termInMonth, interestRate);
        const tax = InstallmentSaving.getTaxOnInterest(interestBeforeTax, taxRate);
        const actualInterestRate = Rate.getActualRate(principal, interestBeforeTax - tax, Period.convertMonthToYear(termInMonth));

        handleSetResult(principal, interestBeforeTax, interests, tax, actualInterestRate);
    };

    const calculate = () => {
        const termInMonth = input.isTermInMonth ? 
            input.termInMonth :
            Period.convertYearToMonth(input.termInMonth);

        if (input.isMonthlyCompoundInterest) {
            calculateMonthlyCompoundInstallmentSaving(termInMonth);
            return;
        }

        calculateInstallmentSaving(termInMonth);
    };

    return (
        <div className='installment-saving-container'>
            <div className='input-container'>
                <div className='input-group input-with-legend'>
                    <label>월 적금액</label>
                    <input type='text' name='monthlySaving'
                        value={Num.addCommas(input.monthlySaving)}
                        onChange={(e) => State.changeNumWithCommasProperty(e, setInput)} />
                </div>
                <TermSelection isTermInMonth={input.isTermInMonth} setIsTermInMonth={setIsTermInMonth}/>
                <div className='input-group input-with-legend'>
                    <label>기간</label>
                    <input type='number' name='termInMonth'
                        value={input.termInMonth.toString()}
                        onChange={(e) => State.changeIntProperty(e, setInput)} />
                </div>
                <div className='input-group'>
                    <label>월복리?</label>
                    <button type='button' className={input.isMonthlyCompoundInterest ? 
                        'btn-primary' : 'btn-primary outline'}
                        onClick={() => switchIsMonthlyCompoundInterest()}>
                        네
                    </button>
                </div>
                <div className='input-group input-with-legend'>
                    <label>이자 금리</label>
                    <input type='number' name='interestRate'
                        onChange={(e) => State.changeFloatProperty(e, setInput)}
                        value={input.interestRate.toString()} />
                </div>
                <TaxSelection taxRate={input.taxRate} setTaxRate={setTaxRate} />
                <div className='input-group input-with-legend'>
                    <label>세금</label>
                    <input type='number' name='taxRate'
                        value={input.taxRate.toString()}
                        onChange={(e) => State.changeFloatProperty(e, setInput)} />
                </div>
                <ControlBtnSection calculate={calculate} resetStates={resetStates} />
            </div>
            <div className='result-container'>
                <DepositResult
                    principal={resultState.principal}
                    interest={resultState.interest}
                    tax={resultState.tax}
                    totalAmount={resultState.totalAmount}
                    actualInterestRate={resultState.actualInterestRate}
                />
                <InstallmentSavingInterestChart
                    term={input.termInMonth}
                    isTermInMonth={input.isTermInMonth}
                    interests={resultState.interests}
                />
                <InstallmentSavingInterestTable
                    monthlySaving={input.monthlySaving}
                    termInMonth={input.termInMonth}
                    isTermInMonth={input.isTermInMonth}
                    interests={resultState.interests}
                />
            </div>
        </div>
    );
};

export const InstallmentSavingSection = WithDepositResult(InstallmentSavingPage);