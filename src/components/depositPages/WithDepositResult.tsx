import React from 'react';
import { ResultState as State, DepositWrappedComponentProps } from '../../ts/interfaces';

export const WithDepositResult = (WrappedComponent: React.FC<DepositWrappedComponentProps>) => {
    class HOC extends React.Component<{}, State> {
        constructor(props: any) {
            super(props);

            this.state = {
                principal: 0,
                interest: 0,
                interests: [],
                tax: 0,
                totalAmount: 0,
                actualInterestRate: 0,
            };
        }
        
        INIT_STATE = {
            principal: 0,
            interest: 0,
            interests: [],
            tax: 0,
            totalAmount: 0,
            actualInterestRate: 0,
        };

        setResultState = (updatedState: State) => {
            const { principal, interest, interests, tax, totalAmount, actualInterestRate } = updatedState;

            this.setState(prevState => ({
                ...prevState,
                principal,
                interest,
                interests,
                tax,
                totalAmount,
                actualInterestRate,
            }));
        };

        resetResultState = () => this.setState(this.INIT_STATE);

        render() {
            return (
                <WrappedComponent 
                    resultState={this.state}
                    resetResultState={this.resetResultState}
                    setResultState={this.setResultState}
                />
            );
        }
    }
    
    return HOC;
};