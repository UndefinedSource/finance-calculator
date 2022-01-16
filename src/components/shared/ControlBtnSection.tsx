interface Props {
    calculate: () => void;
    resetStates: () => void;
}

export const ControlBtnSection = (props: Props) => {
    return (
        <div className='control-btn-list-container'>
            <button type='button' className='btn-success' onClick={() => props.calculate()}>계산</button>
            <button type='button' className='btn-secondary'
            onClick={() => props.resetStates()}>초기화</button>
        </div>
    );
};