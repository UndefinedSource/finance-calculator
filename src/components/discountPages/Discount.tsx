import { useState } from 'react';
import { ItemDiscount } from './ItemDiscount';
import { ItemDiscountComparsion } from './ItemDiscountComparsion';

enum DiscountType {
    ItemDiscount = 'ItemDiscount',
    ItemDiscountComparsion  = 'ItemDiscountComparsion',
}

export const Discount = () => {
    const [sectionType, setSectionType] = useState<string>(DiscountType.ItemDiscount);

    const showSelectedSection = () => {
        switch (sectionType) {
            case DiscountType.ItemDiscount:
                return <ItemDiscount />;
            case DiscountType.ItemDiscountComparsion:
                return <ItemDiscountComparsion />;
            default:
                break;
        }

        return null;
    };

    return (
        <div className='discount-container'>
            <div className='radio-btn-list-container'>
                <input type='radio' id='discountedPrice' className='radio-btn btn-primary' name='discount' 
                checked={sectionType === DiscountType.ItemDiscount} readOnly
                onClick={() => setSectionType(DiscountType.ItemDiscount)} />
                <label htmlFor='discountedPrice'>할인 가격</label>
                <input type='radio' id='discountedPriceComparsion' className='radio-btn btn-primary' name='discount'
                onClick={() => setSectionType(DiscountType.ItemDiscountComparsion)} />
                <label htmlFor='discountedPriceComparsion'>할인 가격들 비교</label>
            </div>
            {showSelectedSection()}
        </div>
    );
};