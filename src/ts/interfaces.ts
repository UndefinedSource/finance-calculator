export interface Dataset {
    label: string;
    backgroundColor: string;
    borderColor: string;
    data: number[];
}

export interface Chart {
    labels: string[];
    datasets: Dataset[];
}

export interface ResultState {
    principal: number;
    interest: number;
    interests: number[]
    tax: number;
    totalAmount: number;
    actualInterestRate: number;
}

export interface DepositWrappedComponentProps {
    resultState: ResultState;
    setResultState: (updatedState: ResultState) => void;
    resetResultState: () => void;
}

export interface FixedDepositProps extends DepositWrappedComponentProps { }
export interface InstallmentSavingProps extends DepositWrappedComponentProps { }