export function getRateOfReturn(principal: number, actualInterest: number) {
    const rateOfReturn = actualInterest / principal * 100;

    return Num.parseFloatWithPrecision(rateOfReturn, 2);
}

export const Num = {
    addCommas(num: number) { 
        return num.toLocaleString();
    },
    parseFloatWithPrecision(num: number, decimalPlaces: number) {
        return parseFloat(num.toFixed(decimalPlaces));
    },
};

export const Rate = {
    getAnnualRate(termInMonth: number, interestRate: number) {
        return (termInMonth / 12) * interestRate;
    },
    getActualRate(principal: number, actualInterest: number, termInYear: number) {
        const rateOfReturn = getRateOfReturn(principal, actualInterest);
        const actualRate = rateOfReturn / termInYear;

        return Num.parseFloatWithPrecision(actualRate, 2);
    },
    convertRateToDecimal(rate: number) {
        return rate / 100;
    },
    convertYearlyRateToMonthlyRate(rate: number) {
        return rate / 12;
    },
};

export const Period = {
    convertYearToMonth(year: number) {
        return Math.floor(year * 12);
    },
    convertMonthToYear(month: number) {
        return Math.floor(month / 12);
    },
    getPeriodSequences(end: number) {
        return Array.from({length: end}, (v, k) => (++k));
    },
    getPeriodSequencesInString(end: number) {
        return Array.from({length: end}, (v, k) => (++k).toString());
    }
};

export const String = {
    removeCommas(string: string) {
        return string.replaceAll(',', '');
    },
    isDigit(value: string) {
        if (/^[0-9]+$/.test(value)) 
            return true;
        return false;
    },
};