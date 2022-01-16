interface LinkButtonData {
    link: string;
    value: string;
    className: string;
};

export const linkButtonData: Array<LinkButtonData> = [
    { className: 'btn-primary', link: 'deposit', value: '예금' },
    { className: 'btn-danger', link: 'loan', value: '대출' },
    { className: 'btn-success', link: 'dividend', value: '배당' },
    { className: 'btn-secondary', link: 'compound-asset', value: '자산' },
    { className: 'btn', link: 'discount', value: '할인' },
];