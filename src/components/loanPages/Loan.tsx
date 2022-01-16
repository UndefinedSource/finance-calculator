import { useState } from 'react';
import { Period, Num } from '../../core/utils';
import { State } from '../../core/reactState';
import { TermSelection } from '../shared/TermSelection';
import { LevelPayment, BulletPayment, EqualPayment } from '../../core/calculator/loan';
import { LoanTable } from '../tables/LoanTable';
import { ControlBtnSection } from '../shared/ControlBtnSection';

interface LoanState {
    principal: number;
    termInMonth: number;
    isTermInMonth: boolean;
    interestRate: number;
    repaymentType: string;
}

interface Result {
    interest: number;
    monthlyInterests: number[];
    monthlyPaymentsOnPrincipal: number[];
    monthlyPayments: number[];
}

enum RepaymentType {
    LevelPayment = 'LEVEL_PAYMENT',
    EqualPayment = 'EqualPayment',
    BulletPayment = 'BulletPayment',
};

export const Loan = () => {
    const INIT_INPUT_STATE = {
        principal: 0,
        termInMonth: 0,
        interestRate: 0,
        isTermInMonth: true,
        repaymentType: RepaymentType.LevelPayment,
    };

    const INIT_RESULT_STATE = {
        interest: 0,
        monthlyInterests: [],
        monthlyPaymentsOnPrincipal: [],
        monthlyPayments: [],
    };

    const [input, setInput] = useState<LoanState>(INIT_INPUT_STATE);
    const [result, setResult] = useState<Result>(INIT_RESULT_STATE);

    const resetStates = () => {
        setInput(INIT_INPUT_STATE);
        setResult(INIT_RESULT_STATE);
    };

    const changeRepaymentType = (type: string) => {
        setInput(prevState => ({
            ...prevState,
            repaymentType: type,
        }));
    };

    const setIsTermInMonth = (bool: boolean) => {
        setInput(prevState => ({
            ...prevState,
            isTermInMonth: bool,
        }));
    };

    const calculate = (termInMonth: number) => {
        const { principal, interestRate, repaymentType } = input;
        let monthlyInterests: number[] = [];
        let monthlyPayments: number[] = [];
        let monthlyPaymentsOnPrincipal: number[] = [];
        let interest = 0;

        switch (repaymentType) {
            case RepaymentType.LevelPayment:
                monthlyInterests = LevelPayment.getMonthlyInterests(principal, termInMonth, interestRate);
                monthlyPayments = LevelPayment.getMonthlyPayments(principal, termInMonth, interestRate);
                monthlyPaymentsOnPrincipal = LevelPayment.getMonthlyPaymentsOnPrincipal(principal, termInMonth, interestRate);
                interest = LevelPayment.getTotalInterest(monthlyInterests);
                break;
            case RepaymentType.EqualPayment:
                monthlyInterests = EqualPayment.getMonthlyInterests(principal, termInMonth, interestRate);
                monthlyPayments = EqualPayment.getMonthlyPayments(principal, termInMonth, interestRate);
                monthlyPaymentsOnPrincipal = EqualPayment.getMonthlyPaymentsOnPrincipal(principal, termInMonth);
                interest = EqualPayment.getTotalInterest(monthlyInterests);
                break;
            case RepaymentType.BulletPayment:
                monthlyInterests = BulletPayment.getMonthlyInterests(principal, termInMonth, interestRate);
                monthlyPayments = BulletPayment.getMonthlyPayments(principal, termInMonth, interestRate);
                monthlyPaymentsOnPrincipal = BulletPayment.getMonthlyPaymentsOnPrincipal(principal, termInMonth);
                interest = BulletPayment.getTotalInterest(principal, termInMonth, interestRate);
                break;
        }

        setResult(prevResult => ({
            ...prevResult,
            interest,
            monthlyInterests,
            monthlyPayments,
            monthlyPaymentsOnPrincipal,
        }));
    };

    const handleCalculate = () => {
        if (input.isTermInMonth) {
            calculate(input.termInMonth);
            return;
        }

        calculate(Period.convertYearToMonth(input.termInMonth));
    };

    return (
        <div className='loan-container'>
            <div className='input-container'>
                <div className='input-group input-with-legend'>
                    <input type='text' name='principal'
                    value={Num.addCommas(input.principal).toString()}
                    onChange={(e) => State.changeNumWithCommasProperty(e, setInput)} />
                    <label>대출금액</label>
                </div>
                <TermSelection isTermInMonth={input.isTermInMonth} setIsTermInMonth={setIsTermInMonth}/>
                <div className='input-group input-with-legend'>
                    <label>기간</label>
                    <input type='number' name='termInMonth' value={input.termInMonth.toString()}
                    onChange={(e) => State.changeIntProperty(e, setInput)} />
                </div>
                <div className='input-group input-with-legend'>
                    <label>이자 금리</label>
                    <input type='number' name='interestRate'
                        onChange={(e) => State.changeFloatProperty(e, setInput)}
                        value={input.interestRate.toString()} />
                </div>
                <div className='input-group'>
                    <label>상환 유형</label>
                    <div className='radio-btn-list-container'>
                        <input type='radio' id='incomeTax' className='radio-btn btn-primary' name='taxType'
                        checked={input.repaymentType === RepaymentType.LevelPayment} readOnly
                        onClick={() => changeRepaymentType(RepaymentType.LevelPayment)} />
                        <label htmlFor='incomeTax'>원리금균등</label>
                        <input type='radio' id='none' className='radio-btn btn-primary' name='taxType'
                        onClick={() => changeRepaymentType(RepaymentType.EqualPayment)} />
                        <label htmlFor='none'>원금균등</label>
                        <input type='radio' id='discount' className='radio-btn btn-primary' name='taxType'
                        onClick={() => changeRepaymentType(RepaymentType.BulletPayment)} />
                        <label htmlFor='discount'>만기일시</label>
                    </div>
                </div>
                <ControlBtnSection calculate={handleCalculate} resetStates={resetStates}/>
            </div>
            <div className='result-container'>
                <div className='result-calculation'>
                    <div className='result-group'>
                        <label>대출원금</label>
                        <span>{Num.addCommas(input.principal)}</span>
                    </div>
                    <div className='result-group'>
                        <label>총 이자</label>
                        <span>{Num.addCommas(result.interest)}</span>
                    </div>
                    <div className='result-group'>
                        <label>총 상환 금액</label>
                        <span>{Num.addCommas(input.principal + result.interest)}</span>
                    </div>
                </div>
                <LoanTable principal={input.principal}
                    termInMonth={input.isTermInMonth ? input.termInMonth : Period.convertYearToMonth(input.termInMonth)}
                    monthlyInterests={result.monthlyInterests}
                    monthlyPayments={result.monthlyPayments}
                    monthlyPaymentsOnPrincipal={result.monthlyPaymentsOnPrincipal}
                />
            </div>
        </div>
    );
};