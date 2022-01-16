import { Rate } from '../utils';

class Deposit {
    static getTaxOnInterest(interest: number, taxRate: number) {
        const taxOnInterest = interest * Rate.convertRateToDecimal(taxRate);

        // 세금 소수점 .51부터는 올림
        if (taxOnInterest - 0.5 > taxOnInterest)
            return Math.round(taxOnInterest);

        return Math.floor(taxOnInterest);
    }

    static getCompoundInterestsBeforeTax(principal: number, term: number, interestRate: number) {
        const interests = [];
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);
        let prevPrincipalWithInterest = principal;

        for (let i = 0; i < term; i++) {
            const currentPrincipalWithInterest = prevPrincipalWithInterest + prevPrincipalWithInterest * interestRateInDecimal;
            const interest = currentPrincipalWithInterest - prevPrincipalWithInterest;
            interests.push(Math.round(interest));

            prevPrincipalWithInterest = currentPrincipalWithInterest;
        }

        return interests;
    }

    static getCompoundInterestsAfterTax(principal: number, term: number, interestRate: number, taxRate: number) {
        const interests = [];
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);
        let prevPrincipalWithInterest = principal;

        for (let i = 0; i < term; i++) {
            const currentPrincipalWithInterest = prevPrincipalWithInterest + prevPrincipalWithInterest * interestRateInDecimal;
            const interest = currentPrincipalWithInterest - prevPrincipalWithInterest;
            const tax = this.getTaxOnInterest(interest, taxRate);
            interests.push(interest - tax);

            prevPrincipalWithInterest = currentPrincipalWithInterest - tax;
        }

        return interests;
    }

    static getYearlyCompoundInterestsBeforeTax(principal: number, termInYear: number, interestRate: number) {
        return this.getCompoundInterestsBeforeTax(principal, termInYear, interestRate);
    }

    static getMonthlyCompoundInterestsBeforeTax(principal: number, termInMonth: number, interestRate: number) {
        const monthlyRate = Rate.convertYearlyRateToMonthlyRate(interestRate);

        return this.getCompoundInterestsBeforeTax(principal, termInMonth, monthlyRate);
    }
}

export class FixedDeposit extends Deposit {
    static getInterestBeforeTax(principal: number, interestRate: number) {
        const interestBeforeTax = principal * Rate.convertRateToDecimal(interestRate);

        return Math.round(interestBeforeTax);
    }

    static getYearlyCompoundInterestBeforeTax(principal: number, termInYear: number, interestRate: number) {
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);
        const principalWithCompoundInterestBeforeTax = principal * Math.pow((1 + interestRateInDecimal), termInYear);

        return Math.round(principalWithCompoundInterestBeforeTax - principal);
    }

    static getMonthlyCompoundInterestBeforeTax(principal: number, termInMonth: number, interestRate: number) {
        const monthlyRate = Rate.convertYearlyRateToMonthlyRate(interestRate);
        const interestRateInDecimal = Rate.convertRateToDecimal(monthlyRate);
        const principalWithCompoundInterestBeforeTax = principal * Math.pow((1 + interestRateInDecimal), termInMonth);

        return Math.round(principalWithCompoundInterestBeforeTax - principal);
    }

    static getInterestWithYearlyTermBeforeTax(principal: number, termInYear: number, interestRate: number) {
        const yearlyInterestBeforeTax = this.getInterestBeforeTax(principal, interestRate);

        return Math.round(yearlyInterestBeforeTax) * termInYear;
    }

    static getInterestWithMonthlyTermBeforeTax(principal: number, termInMonth: number, interestRate: number) {
        const annualRate = Rate.getAnnualRate(termInMonth, interestRate);

        return this.getInterestBeforeTax(principal, annualRate);
    }
};

export class InstallmentSaving extends Deposit {
    static getInterestBeforeTax(monthlySaving: number, termInMonth: number, interestRate: number) {
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);
        const interest = monthlySaving * termInMonth * (termInMonth + 1) / 2 * interestRateInDecimal / 12;

        return Math.round(interest);
    }

    static getInterestsBeforeTax(monthlySaving: number, termInMonth: number, interestRate: number) {
        let interests = [];
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);

        for (let remainingMonth = termInMonth; remainingMonth > 0; remainingMonth--) {
            const interest = monthlySaving * (remainingMonth / 12) * interestRateInDecimal;
            interests.push(Math.round(interest));
        }

        return interests;
    }

    static getPrincipalWithInterestFromMonthlyCompoundSaving(monthlySaving: number, termInMonth: number, interestRate: number) {
    /*
        월 복리 총합 + 원금
        
        월 납입금 x (1 + (이자율 / 100) / 12) x 
        (((1 + (이자율 / 100) / 12) ^ 납입개월) - 1) /
        ((1 + (이자율 / 100) / 12) - 1))
    */
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);
        const principalWithCompoundInterestBeforeTax = 
            (monthlySaving * (1 + interestRateInDecimal / 12)) *
            (Math.pow((1 + interestRateInDecimal / 12), termInMonth) - 1) /
            ((1 + interestRateInDecimal / 12 ) - 1);

        return Math.round(principalWithCompoundInterestBeforeTax);
    }
    
    static getMonthlyCompoundInterestBeforeTax(monthlySaving: number, termInMonth: number, interestRate: number) {
        const principal = monthlySaving * termInMonth;
        const principalWithCompoundInterestBeforeTax = this.getPrincipalWithInterestFromMonthlyCompoundSaving(monthlySaving, termInMonth, interestRate);

        return principalWithCompoundInterestBeforeTax - principal;
    }

    static getMonthlyCompoundInterestsBeforeTax(monthlySaving: number, termInMonth: number, interestRate: number) {
    /*
        월 복리 이자
        월 납입금 x ((1 + 이자율 / 100 / 12) ^ 남은 개월)
    */
        const interests = [];
        const interestRateInDecimal = Rate.convertRateToDecimal(interestRate);

        for (let remainingMonth = termInMonth; remainingMonth > 0; remainingMonth--) {
            const monthlySavingWithInterest = monthlySaving * Math.pow((1 + interestRateInDecimal / 12), remainingMonth);
            const interest = monthlySavingWithInterest - monthlySaving;
            interests.push(Math.round(interest));
        }

        return interests;
    }
};