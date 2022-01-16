import { useState } from 'react';
import { Num } from '../../core/utils';
import { State } from '../../core/reactState';
import { Discount as DiscountCalc } from '../../core/calculator/discount';

interface Input {
    price: number;
    discountPercentage: number;
}

export const ItemDiscount = () => {
    const INIT_INPUT_STATE = {
        price: 0,
        discountPercentage: 0,
    };

    const [input, setInput] = useState<Input>(INIT_INPUT_STATE);

    const calculate = () => {
        const { price, discountPercentage } = input;
        const finalPrice = DiscountCalc.getDiscountedPrice(price, discountPercentage);

        return {
            finalPrice,
            moneySaved: price - finalPrice,
        };
    };

    const result = calculate();

    return (
        <div className='discounted-price-container'>
            <div className='input-container'>
                <div className='input-group input-with-legend'>
                    <label>가격</label>
                    <input type='text' name='price'
                    value={Num.addCommas(input.price).toString()}
                    onChange={(e) => State.changeNumWithCommasProperty(e, setInput)} />
                </div>
                <div className='input-group input-with-legend'>
                    <label>할인율</label>
                    <input type='number' name='discountPercentage'
                    value={input.discountPercentage.toString()}
                    onChange={(e) => State.changeFloatProperty(e, setInput)} />
                </div>
                <div className='btn-list-container'>
                    <button className='btn-secondary' 
                    onClick={() => setInput(INIT_INPUT_STATE)}>초기화</button>
                </div>
            </div>
            <div className='result-container'>
                <div className='result-group'>
                    <label>할인된 가격</label>
                    <span>{Num.addCommas(result.finalPrice)}</span>
                </div>
                <div className='result-group'>
                    <label>할인 가격</label>
                    <span>{Num.addCommas(result.moneySaved)}</span>
                </div>
            </div>
        </div>
    );
};