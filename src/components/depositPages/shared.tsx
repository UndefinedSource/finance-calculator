import { Num } from '../../core/utils';

interface DepositResultProps {
    principal: number;
    interest: number;
    tax: number;
    totalAmount: number;
    actualInterestRate: number;
}

interface TaxSelectionProps {
    taxRate: number;
    setTaxRate: (taxRate: number) => void;
}

export const TAX_TYPE = {
    INCOME: 15.4,
    NONE: 0,
    DISCOUNT: 9.5,
};

export const DepositResult = (props: DepositResultProps) => {
    const { principal, interest, tax, totalAmount, actualInterestRate } = props;

    return (
        <div>
            <div className='result-group'>
                <label>원금</label>
                <span>{Num.addCommas(principal)}</span>
            </div>
            <div className='result-group'>
                <label>이자</label>
                <span>{Num.addCommas(interest)}</span>
            </div>
            <div className='result-group'>
                <label>세금</label>
                <span>{tax === 0 ? Num.addCommas(tax) : `-${Num.addCommas(tax)}`}
                </span>
            </div>
            <div className='result-group'>
                <label>수령액</label>
                <span>{Num.addCommas(totalAmount)}</span>
            </div>
            <div className='result-group'>
                <label>실질 금리</label>
                <span>{actualInterestRate}% / 연</span>
            </div>
        </div>
    );
};

export const TaxSelection = (props: TaxSelectionProps) => {
    const { taxRate, setTaxRate } = props;

    return (
        <div className='radio-btn-list-container'>
            <input type='radio' id='taxTypeIncomeTax' className='radio-btn btn-primary' name='taxType'
            checked={taxRate === TAX_TYPE.INCOME} readOnly
            onClick={() => setTaxRate(TAX_TYPE.INCOME)} />
            <label htmlFor='taxTypeIncomeTax'>일반과세</label>
            <input type='radio' id='taxTypeNone' className='radio-btn btn-primary' name='taxType'
            onClick={() => setTaxRate(TAX_TYPE.NONE)} />
            <label htmlFor='taxTypeNone'>비과세</label>
            <input type='radio' id='taxTypeDiscount' className='radio-btn btn-primary' name='taxType'
            onClick={() => setTaxRate(TAX_TYPE.DISCOUNT)} />
            <label htmlFor='taxTypeDiscount'>세금우대</label>
        </div>
    );
};