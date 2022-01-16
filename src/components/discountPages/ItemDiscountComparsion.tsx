import React, { useCallback, useEffect, useState } from 'react';
import { Discount as DiscountCalc } from '../../core/calculator/discount';
import { State } from '../../core/reactState';
import { Num, String } from '../../core/utils';

interface Item {
    price: number;
    discountRate: number;
    discountedPrice: number;
}

interface Input {
    items: Item[];
    globalDiscountRate: number;
    shouldApplyGlobalDiscountRate: boolean;
}

export const ItemDiscountComparsion = () => {
    const INIT_STATE = {
        items: [],
        globalDiscountRate: 0,
        shouldApplyGlobalDiscountRate: false,
    };

    const INIT_ITEM = {
        price: 0,
        discountedPrice: 0,
        discountRate: 0,
    };

    const [input, setInput] = useState<Input>(INIT_STATE);

    const isUpdatedItemsEqualToCurrentItems = useCallback((updatedItems: Item[]) => {
        for (let i = 0; i < updatedItems.length; i++) {
            if (input.items[i].discountRate !== updatedItems[i].discountRate)
                return false;
        }

        return true;
    }, [input.items]);

    useEffect(() => {
        const updatedItems = input.items.map(item => {
            return {
                ...item,
                discountRate: input.globalDiscountRate,
                discountedPrice:  DiscountCalc.getDiscountedPrice(item.price, input.globalDiscountRate),
            };
        });

        if (isUpdatedItemsEqualToCurrentItems(updatedItems))
            return;

        setInput(prevState => ({
            ...prevState,
            items: updatedItems,
        }));
    }, [input.globalDiscountRate, input.items, isUpdatedItemsEqualToCurrentItems]);


    const switchShouldApplyGlobalDiscountRate = () => {
        setInput(prevState => ({
            ...prevState,
            shouldApplyGlobalDiscountRate: !input.shouldApplyGlobalDiscountRate,
        }));
    };

    const addItem = () => {
        setInput(prevState => ({
            ...prevState,
            items: [...input.items, INIT_ITEM],
        }));
    };

    const removeItem = (idx: number) => {
        const items = input.items.filter((item, i) => {
            if (i !== idx) return item;
            return null;
        });

        updateInputItems(items);
    };

    const resetItems = () => {
        setInput(prevState => ({
            ...prevState,
            items: Array(input.items.length).fill(INIT_ITEM),
        }));
    };

    const updateInputItems = (items: Item[]) => {
        setInput(prevState => ({
            ...prevState,
            items,
        }));
    };

    const handleDiscountRateOnChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = Number(e.target.value);
        const items = [...input.items];

        items[idx].discountRate = val;
        items[idx].discountedPrice = DiscountCalc.getDiscountedPrice(items[idx].price, val);

        updateInputItems(items);
    };

    const handlePriceOnChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value;
        const items = [...input.items];
        let valInDigit = 0;

        if (val === '' || val.includes(',')) {
            valInDigit = Number(String.removeCommas(val));

            items[idx].price = valInDigit;
            items[idx].discountedPrice = DiscountCalc.getDiscountedPrice(valInDigit, items[idx].discountRate);

            updateInputItems(items);
            return;
        }

        if (!String.isDigit(val))
            return;

        valInDigit = Number(val);

        items[idx].price = valInDigit;
        items[idx].discountedPrice = DiscountCalc.getDiscountedPrice(valInDigit, items[idx].discountRate);

        updateInputItems(items);
    };

    const sortByDiscountedPriceInDescendingOrder = () => {
        const currentItems = [...input.items];

        const sortedItems = currentItems.sort((a, b) => {
            if (a.discountedPrice < b.discountedPrice)
                return 1;
            return -1;
        });

        updateInputItems(sortedItems);
    };

    const populateItems = () => {
        const items = [];

        for (let i = 0; i < input.items.length; i++) {
            const item = input.items[i];
            items.push(
                <div className='item-discount-container' key={i}>
                    <div className='input-group input-with-legend'>
                        <label>가격</label>
                        <input type='text' name='price'
                        value={Num.addCommas(item.price).toString()} onChange={(e) => handlePriceOnChange(e, i)} />
                    </div>
                    <div className='input-group input-with-legend'>
                        <label>할인율</label>
                        <input type='number' name='discountRate'
                        value={item.discountRate} onChange={(e) => handleDiscountRateOnChange(e, i)} />
                    </div>
                    <div className='final-price-container'>
                        <label>할인된 가격</label>
                        <label>{item.discountedPrice}</label>
                    </div>
                    <button className='btn-danger' onClick={() => removeItem(i)}>삭제</button>
                </div>
            );
        }

        return items;
    };

    const reset =() => {
        resetItems();
        setInput(prevState => ({
            ...prevState,
            globalDiscountRate: 0,
        }));
    };
 
    return (
        <div className='item-discount-comparsion-container'>
            <button className={input.shouldApplyGlobalDiscountRate ?
            'btn-primary' : 'btn-primary outline'}
            onClick={() => switchShouldApplyGlobalDiscountRate()}>
                전체 상품에 동일 할인율 적용
            </button>
            { input.shouldApplyGlobalDiscountRate &&
                <div className='input-group input-with-legend'>
                    <label>할인율</label>
                    <input type='number' name='globalDiscountRate' value={input.globalDiscountRate}
                    onChange={(e) => State.changeFloatProperty(e, setInput)} />
                </div>
            }
            {populateItems()}
            <div className='btn-list-container'>
                <button className='btn-success' onClick={() => addItem()}>상품 추가</button>
                <button className='btn-primary' onClick={() => sortByDiscountedPriceInDescendingOrder()}>정렬</button>
                <button className='btn-secondary' onClick={() => reset()}>초기화</button>
            </div>
        </div>
    );
};