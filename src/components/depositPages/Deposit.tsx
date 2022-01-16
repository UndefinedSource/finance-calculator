import { useState } from 'react';
import { InstallmentSavingSection } from './InstallmentSaving';
import { FixedDepositSection } from './FixedDeposit';

enum SavingType {
    FixedDeposit = 'FixedDeposit',
    InstallmentSaving = 'InstallmentSaving',
}

export const Deposit = () => {
    const [sectionType, setSectionType] = useState<string>(SavingType.FixedDeposit);

    const showSelectedSection = () => {
        switch (sectionType) {
            case SavingType.FixedDeposit:
                return <FixedDepositSection />;
            case SavingType.InstallmentSaving:
                return <InstallmentSavingSection />;
            default:
                break;
        }

        return null;
    };

    return (
        <div className='deposit-container'>
            <div className='input-group'>
                <label>예금 유형</label>
                <div className='radio-btn-list-container'>
                    <input type='radio' id='fixedDeposit' className='radio-btn btn-primary' name='savingType'
                    checked={sectionType === SavingType.FixedDeposit} readOnly
                    onClick={() => setSectionType(SavingType.FixedDeposit)} />
                    <label htmlFor='fixedDeposit'>정기예금</label>
                    <input type='radio' id='installmentSaving' className='radio-btn btn-primary' name='savingType'
                    onClick={() => setSectionType(SavingType.InstallmentSaving)} />
                    <label htmlFor='installmentSaving'>적금</label>
                </div>
            </div>
            <div>
                {showSelectedSection()}
            </div>
        </div>
    );
};