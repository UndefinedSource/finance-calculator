import { Rate } from "../utils";

export class Discount {
    static getDiscountedPrice(price: number, discountRate: number) {
        const discountPercentageInDecimal = Rate.convertRateToDecimal(discountRate);

        return (1 - discountPercentageInDecimal) * price;
    }
}
