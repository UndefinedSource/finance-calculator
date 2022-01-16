import { linkButtonData } from './shared';

export const Nav = () => {
    return (
        <nav className='nav'>
            <span className='logo'><a href='/'>금융 계산기</a></span>
            <ToggleButton/>
            <ul className='menu-list'>
                {linkButtonData.map((data, i) => {
                    return (
                        <li key={i}>
                            <a href={`${data.link}`}>{data.value}</a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

const ToggleButton = () => {
    return (
        <>
            <input type='checkbox' className='menu-btn' id='menu-btn' />
            <label className='menu-icon' htmlFor='menu-btn'>
                <span className='fa fa-bars'></span>
            </label>
        </>
    );
};