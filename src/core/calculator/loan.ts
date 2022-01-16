import { Rate } from '../utils';
class Loan {
    static getTotalInterest = (interests: number[]) => {
        return interests.reduce((sum, current) => sum + current, 0);
    }
}

/*
    원리금 균등 상환 (동일한 매월 상환금)
    
    원금 * 월이자율 * (1 + 월이자율)^상환기간 
    /
    (1 + 월이자율)^상환기간 - 1
*/

export class LevelPayment extends Loan {
    static getMonthlyPaymentsOnPrincipal = (principal: number, termInMonth: number, interestRate: number) => {
        const monthlyPayments = this.getMonthlyPayments(principal, termInMonth, interestRate);
        const monthlyInterests = this.getMonthlyInterests(principal, termInMonth, interestRate);

        const monthlyPaymentsOnPrincipal = monthlyPayments.map((monthlyPayment, i) => {
            return monthlyPayment - monthlyInterests[i];
        });
        
        return monthlyPaymentsOnPrincipal;
    }

    static getMonthlyPayment = (principal: number, termInMonth: number, interestRate: number) => {
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);
        const monthlyRateInDecimal = Rate.convertYearlyRateToMonthlyRate(interestRateInDecimal);

        const monthlyPayment = 
            (principal * monthlyRateInDecimal * Math.pow((1 + monthlyRateInDecimal), termInMonth))
            / (Math.pow((1 + monthlyRateInDecimal), termInMonth) - 1);

        return Math.round(monthlyPayment);
    }

    static getMonthlyPayments = (principal: number, termInMonth: number, interestRate: number) => {
        const monthlyPayment = this.getMonthlyPayment(principal, termInMonth, interestRate);

        return Array(termInMonth).fill(monthlyPayment);
    }

    // 매월 이자 계산 => 잔금 * 월이자율
    static getMonthlyInterests = (principal: number, termInMonth: number, interestRate: number) => {
        let remainingPrincipal = principal;
        const monthlyInterests: number[] = [];
        const monthlyPayment = this.getMonthlyPayment(principal, termInMonth, interestRate);
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);
        const monthlyRateInDecimal = Rate.convertYearlyRateToMonthlyRate(interestRateInDecimal);

        for (let i = 0; i < termInMonth; i++) {
            const currentMonthInterest = Math.round(remainingPrincipal * monthlyRateInDecimal);
            monthlyInterests.push(currentMonthInterest);
            remainingPrincipal -= (monthlyPayment - currentMonthInterest);
        }

        return monthlyInterests;
    }
}

/*
    원금 균등 상환 (월 납입 = 납입 원금 + 이자)

    월 납입 = (원금 / 총 대출기간) + (원금 잔액 / 남은 대출기간 * 이자)
*/
export class EqualPayment extends Loan {
    static getMonthlyPayments = (principal: number, termInMonth: number, interestRate: number) => {
        let remainingPrincipal = principal;
        const monthlyPayments: number[] = [];
        const monthPaymentOnPrincipal = this.getMonthlyPaymentOnPrincipal(principal, termInMonth);
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);
        const monthlyRateInDecimal = Rate.convertYearlyRateToMonthlyRate(interestRateInDecimal);

        for (let i = 0; i < termInMonth; i++) { 
            const currentMonthInterest = Math.round(remainingPrincipal * monthlyRateInDecimal);
            monthlyPayments.push(monthPaymentOnPrincipal + currentMonthInterest);
            remainingPrincipal -= monthPaymentOnPrincipal;
        }

        return monthlyPayments;
    }

    static getMonthlyInterests = (principal: number, termInMonth: number, interestRate: number) => {
        let remainingPrincipal = principal;
        const monthlyInterests: number[] = [];
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);
        const monthlyPaymentOnPrincipal = this.getMonthlyPaymentOnPrincipal(principal, termInMonth);
        const monthlyRateInDecimal = Rate.convertYearlyRateToMonthlyRate(interestRateInDecimal);
        
        for (let i = 0; i < termInMonth; i++) {
            const currentMonthInterest = remainingPrincipal * monthlyRateInDecimal;
            monthlyInterests.push(Math.round(currentMonthInterest));
            remainingPrincipal -= monthlyPaymentOnPrincipal;
        }

        return monthlyInterests;
    }

    static getMonthlyInterest = (principal: number, termInMonth: number, interestRate: number) => {
        let monthlyInterest = 0;
        let remainingPrincipal = principal;
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);
        const monthlyPaymentOnPrincipal = this.getMonthlyPaymentOnPrincipal(principal, termInMonth);
        const monthlyRateInDecimal = Rate.convertYearlyRateToMonthlyRate(interestRateInDecimal);
        
        for (let i = 0; i < termInMonth; i++) {
            const currentMonthInterest = remainingPrincipal / monthlyRateInDecimal;
            monthlyInterest += Math.round(currentMonthInterest);
            remainingPrincipal -= monthlyPaymentOnPrincipal;
        }

        return monthlyInterest;
    }

    static getMonthlyPaymentOnPrincipal = (principal: number, termInMonth: number) => {
        return Math.round(principal / termInMonth);
    }

    static getMonthlyPaymentsOnPrincipal = (principal: number, termInMonth: number) => {
        const monthlyPayment = Math.round(principal / termInMonth);

        return Array(termInMonth).fill(monthlyPayment);
    }
}

/*
    원금만기일시상환

    첫달 ~ 마지막달 전 달까지 = 이자 납부
    마지막달 = 이자 납부 + 원금
*/
export class BulletPayment {
    static getMonthlyPaymentOnPrincipal = () => {
        return 0;
    }

    static getMonthlyPaymentsOnPrincipal = (principal: number, termInMonth: number) => {
        const monthlyPaymentsOnPrincipal = Array(termInMonth).fill(this.getMonthlyPaymentOnPrincipal());
        monthlyPaymentsOnPrincipal[monthlyPaymentsOnPrincipal.length - 1] += principal;

        return monthlyPaymentsOnPrincipal;
    }

    static getTotalInterest = (principal: number, termInMonth: number, interestRate: number) => {
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);

        return Math.round(principal * interestRateInDecimal * (termInMonth / 12));
    }

    static getMonthlyInterest = (principal: number, termInMonth: number, interestRate: number) => {
        const totalInterest = this.getTotalInterest(principal, termInMonth, interestRate);

        return Math.round(totalInterest / termInMonth);
    }

    static getMonthlyInterests = (principal: number, termInMonth: number, interestRate: number) => {
        const monthlyInterest = this.getMonthlyInterest(principal, termInMonth, interestRate);

        return Array(termInMonth).fill(monthlyInterest);
    }

    static getMonthlyPayments = (principal: number, termInMonth: number, interestRate: number) => {
        const monthlyPayments = this.getMonthlyInterests(principal, termInMonth, interestRate);
        monthlyPayments[monthlyPayments.length - 1] += principal;

        return monthlyPayments;
    }
}