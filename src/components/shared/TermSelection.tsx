interface Props {
    isTermInMonth: boolean;
    setIsTermInMonth: (val: boolean) => void;
}

export const TermSelection = (props: Props) => {
    const { isTermInMonth, setIsTermInMonth } = props;

    return (
        <div className='input-group'>
            <label>기간 유형</label>
            <div className='btn-list-container'>
                <button type='button' className={!isTermInMonth ?
                    'btn-primary' : 'btn-primary outline'}
                    onClick={() => setIsTermInMonth(false)}>
                    연
                </button>
                <button type='button' className={isTermInMonth ?
                    'btn-primary' : 'btn-primary outline'}
                    onClick={() => setIsTermInMonth(true)}>
                    개월
                </button>
            </div>
        </div>
    );
};