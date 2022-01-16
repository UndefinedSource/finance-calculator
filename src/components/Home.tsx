import { Link } from 'react-router-dom';
import { linkButtonData } from './shared';

export const Home = () => {
    return (
        <div>
            <QuickNavigationButtonList />
        </div>
    );
};

const QuickNavigationButtonList = () => {
    return (
        <div className='home-page-btn-list-container'>
            {linkButtonData.map((data, i) => {
                return (
                    <Link key={i} to={`/${data.link}`}>
                        <button className={data.className}>{data.value}</button>
                    </Link>
                );
            })}
        </div>
    );
};