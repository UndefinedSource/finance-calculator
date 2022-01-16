import { useState } from 'react';
import { Num, Period, Rate } from '../../core/utils';
import { State } from '../../core/reactState';
import { FixedDeposit } from '../../core/calculator/deposit';
import { FixedDepositProps } from '../../ts/interfaces';
import { FixedDepositInterestChart } from '../charts/DepositChart';
import { FixedDepositInterestTable } from '../tables/FixedDepositInterestTable';
import { TAX_TYPE, DepositResult, TaxSelection } from './shared';
import { TermSelection } from '../shared/TermSelection';
import { WithDepositResult } from './WithDepositResult';
import { ControlBtnSection } from '../shared/ControlBtnSection';

interface Input {
    principal: number;
    interestRate: number;
    termInYear: number;
    taxRate: number;
    hasTaxOnCompoundInterest: boolean;
    isTermInMonth: boolean;
    isCompoundSaving: boolean;
    isMonthlyCompoundInterest: boolean;
}

const FixedDepositPage = (props: FixedDepositProps) => {
    const INIT_INPUT_STATE = {
        principal: 0,
        interestRate: 0,
        termInYear: 0,
        taxRate: TAX_TYPE.INCOME, 
        hasTaxOnCompoundInterest: false,
        isTermInMonth: false,
        isCompoundSaving: false,
        isMonthlyCompoundInterest: false,
    };

    const [input, setInput] = useState<Input>(INIT_INPUT_STATE);
    const { resultState } = props;

    const resetStates = () => {
        setInput(INIT_INPUT_STATE);
        props.resetResultState();
    };

    const switchIsCompoundSaving = () => {
        setInput(prevState => ({
            ...prevState,
            isCompoundSaving: !input.isCompoundSaving,
        }));
    };

    const switchHasTaxOnCompoundInterest = () => {
        setInput(prevState => ({
            ...prevState,
            hasTaxOnCompoundInterest: !input.hasTaxOnCompoundInterest,
        }));
    };

    const setTaxRate = (val: number) => {
       setInput(prevState => ({
            ...prevState,
            taxRate: val,
       }));
    };

    const setIsTermInMonth = (val: boolean) => {
       setInput(prevState => ({
            ...prevState,
            isTermInMonth: val,
        }));
    };

    const setIsMonthlyCompoundInterest = (val: boolean) => {
       setInput(prevState => ({
            ...prevState,
            isMonthlyCompoundInterest: val,
        }));
    };

    const setStandardSavingResult = (principal: number, interestBeforeTax: number, tax: number, actualInterestRate: number) => {
        props.setResultState({
            principal,
            interest: interestBeforeTax,
            interests: [],
            tax,
            totalAmount: principal + interestBeforeTax - tax,
            actualInterestRate,
        });
    };

    const setCompoundSavingResult = (principal: number, interestBeforeTax: number, interests: number[],
    tax: number, actualInterestRate: number) => {
        props.setResultState({
            principal,
            interest: interestBeforeTax,
            interests,
            tax,
            totalAmount: principal + interestBeforeTax - tax,
            actualInterestRate,
        });
    };

    const calculateWithMonthlyTerm = () => {
        const { principal, termInYear, interestRate, taxRate } = input;
        const termInMonth = termInYear;
        const interestBeforeTax = FixedDeposit.getInterestWithMonthlyTermBeforeTax(principal, termInMonth, interestRate);
        const tax = FixedDeposit.getTaxOnInterest(interestBeforeTax, taxRate);
        const actualInterestRate = Rate.getActualRate(principal, interestBeforeTax - tax, Period.convertMonthToYear(termInMonth));

        setStandardSavingResult(principal, interestBeforeTax, tax, actualInterestRate);
    };

    const calculateWithYearlyTerm = () => {
        const { principal, termInYear, interestRate, taxRate } = input;
        const interestBeforeTax = FixedDeposit.getInterestWithYearlyTermBeforeTax(principal, termInYear, interestRate);
        const tax = FixedDeposit.getTaxOnInterest(interestBeforeTax, taxRate);
        const actualInterestRate = Rate.getActualRate(principal, interestBeforeTax - tax, termInYear);

        setStandardSavingResult(principal, interestBeforeTax, tax, actualInterestRate);
    };

    const calculateYearlyCompoundSaving = () => {
        const { principal, interestRate, taxRate } = input;
        const termInYear = input.isTermInMonth ? Period.convertMonthToYear(input.termInYear) : input.termInYear;
        const interestBeforeTax = FixedDeposit.getYearlyCompoundInterestBeforeTax(principal, termInYear, interestRate);
        const interests = FixedDeposit.getYearlyCompoundInterestsBeforeTax(principal, termInYear, interestRate);
        const tax = FixedDeposit.getTaxOnInterest(interestBeforeTax, taxRate);
        const actualInterestRate = Rate.getActualRate(principal, interestBeforeTax - tax, termInYear);

        setCompoundSavingResult(principal, interestBeforeTax, interests, tax, actualInterestRate);
    };
  
    const calculateMonthlyCompoundSaving = () => {
        const { principal, termInYear, interestRate, taxRate } = input;
        const termInMonth = input.isTermInMonth ? termInYear : Period.convertYearToMonth(termInYear);
        const interestBeforeTax = FixedDeposit.getMonthlyCompoundInterestBeforeTax(principal, termInMonth, interestRate)
        const interests = FixedDeposit.getMonthlyCompoundInterestsBeforeTax(principal, termInMonth, interestRate);
        const tax = FixedDeposit.getTaxOnInterest(interestBeforeTax, taxRate);
        const actualInterestRate = Rate.getActualRate(principal, interestBeforeTax - tax, termInYear);

        setCompoundSavingResult(principal, interestBeforeTax, interests, tax, actualInterestRate);
    }

    const calculate = () => {
        const { isTermInMonth, isCompoundSaving, isMonthlyCompoundInterest } = input;

        if (isCompoundSaving) {
            if (isMonthlyCompoundInterest) {
                calculateMonthlyCompoundSaving();
            } else {
                calculateYearlyCompoundSaving();
            }
            return;
        }

        if (isTermInMonth) {
            calculateWithMonthlyTerm();
            return;
        }

        calculateWithYearlyTerm();
    };

    return (
        <div className='fixed-deposit-container'>
            <div className='input-container'>
                <div className='input-group input-with-legend'>
                    <label>원금</label>
                    <input type='text' name='principal'
                    value={Num.addCommas(input.principal).toString()}
                    onChange={(e) => State.changeNumWithCommasProperty(e, setInput)} />
                </div>
                <TermSelection isTermInMonth={input.isTermInMonth} setIsTermInMonth={setIsTermInMonth}/>
                <div className='input-group input-with-legend'>
                    <label>기간</label>
                    <input type='number' name='termInYear' value={input.termInYear.toString()}
                    onChange={(e) => State.changeIntProperty(e, setInput)} />
                </div>
                <div className='input-group'>
                    <label>복리?</label>
                    <button type='button' className={input.isCompoundSaving ?
                        'btn-primary' : 'btn-primary outline'}
                        onClick={() => switchIsCompoundSaving()}>
                        네
                    </button>
                </div>
                { input.isCompoundSaving &&
                <> 
                    <div className='input-group'>
                        <label>복리 유형</label>
                        <div className='btn-list-container'>
                            <button type='button' className={!input.isMonthlyCompoundInterest ?
                                'btn-primary' :  'btn-primary outline'}
                                onClick={() => setIsMonthlyCompoundInterest(false)}>
                                연간
                            </button>
                            <button type='button' className={input.isMonthlyCompoundInterest ?
                                'btn-primary' :  'btn-primary outline'}
                                onClick={() => setIsMonthlyCompoundInterest(true)}>
                                월간
                            </button>
                        </div>
                    </div>
                    <div className='input-group'>
                        <label>복리 이자 세금?</label>
                            <button type='button' className={input.hasTaxOnCompoundInterest ?
                                'btn-primary' :  'btn-primary outline'}
                                onClick={() => switchHasTaxOnCompoundInterest()}>
                                네
                            </button>
                    </div>
                </> 
                }
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
                    principal={input.principal}
                    interest={resultState.interest}
                    tax={resultState.tax}
                    totalAmount={resultState.totalAmount}
                    actualInterestRate={resultState.actualInterestRate}
                />
                { input.isCompoundSaving &&
                <>
                    <FixedDepositInterestChart
                        interests={resultState.interests}
                        termInYear={input.termInYear}
                        taxRateInDecimal={Rate.convertRateToDecimal(input.taxRate)}
                        hasTaxOnCompoundInterest={input.hasTaxOnCompoundInterest}
                        isMonthlyCompoundInterest={input.isMonthlyCompoundInterest}
                    />
                    <FixedDepositInterestTable 
                        principal={input.principal}
                        term={input.termInYear} 
                        interests={resultState.interests}
                        taxRateInDecimal={Rate.convertRateToDecimal(input.taxRate)}
                        isYearlyCompoundSaving={input.isCompoundSaving && !input.isMonthlyCompoundInterest}
                        hasTaxOnCompoundInterest={input.hasTaxOnCompoundInterest}
                    />
                </>
                }
            </div>
        </div>
    );
};

export const FixedDepositSection = WithDepositResult(FixedDepositPage);