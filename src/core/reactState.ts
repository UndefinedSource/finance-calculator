import { ChangeEvent } from "react";
import { String } from "./utils";

export const State = {
    changePropertyValueToZero(e: ChangeEvent<HTMLInputElement>, setFunction: any) {
        setFunction((prevForm: any) => ({
            ...prevForm,
            [e.target.name]: 0,
        }));
    },
    changeProperty(e: ChangeEvent<HTMLInputElement>, setFunction: any) {
        setFunction((prevForm: any) => ({
            ...prevForm,
            [e.target.name]: e.target.value,
        }));
    },
    changeIntProperty(e: ChangeEvent<HTMLInputElement>, setFunction: any) {
        if (e.target.value === '') {
            this.changePropertyValueToZero(e, setFunction);
            return;
        }

        setFunction((prevForm: any) => ({
            ...prevForm,
            [e.target.name]: parseInt(e.target.value),
        }));
    },
    changeFloatProperty(e: ChangeEvent<HTMLInputElement>, setFunction: any) {
        if (e.target.value === '') {
            this.changePropertyValueToZero(e, setFunction);
            return;
        }

        setFunction((prevForm: any) => ({
            ...prevForm,
            [e.target.name]: parseFloat(e.target.value),
        }));
    },
    changeNumWithCommasProperty(e: ChangeEvent<HTMLInputElement>, setFunction: any) {
        const { value, name } = e.target;

        if (value === '') {
            this.changePropertyValueToZero(e, setFunction);
            return;
        }

        if (value.includes(',')) {
            const valueWithoutCommas = String.removeCommas(value);

            setFunction((prevForm: any) => ({
                ...prevForm,
                [name]: parseInt(valueWithoutCommas),
            }));
            return;
        }

        if (!String.isDigit(value))
            return;

        this.changeIntProperty(e, setFunction);
    },
};