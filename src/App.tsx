import './assets/sass/main.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Deposit } from './components/depositPages/Deposit';
import { Loan } from './components/loanPages/Loan';
import { Dividend } from './components/stockPage/Dividend';
import { CompoundAsset } from './components/assetPages/CompoundAsset';
import { Discount } from './components/discountPages/Discount';
import { Home } from './components/Home';

const App = () => {
  return (
      <BrowserRouter>
          <Nav />
        <div className='content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/deposit' element={<Deposit />} />
            <Route path='/loan' element={<Loan />} />
            <Route path='/dividend' element={<Dividend />} />
            <Route path='/compound-asset' element={<CompoundAsset />} />
            <Route path='/discount' element={<Discount />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
};

export default App;
