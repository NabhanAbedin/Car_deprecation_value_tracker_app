import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MarketPage from './pages/MarketPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ValuationRequestPage from './pages/ValuationRequestPage';
import ValuationPage from './pages/ValuationPage';
import MarketByIdPage from './pages/MarketByIdPage';
import HistoryPage from './pages/HistoryPage';



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MarketPage/>}/>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/valuationRequest' element={<ValuationRequestPage/>} />
        <Route path='/valuation/:id' element={<ValuationPage/>} />
        <Route path='/marketData/:id' element={<MarketByIdPage/>} />
        <Route path='/history' element={<HistoryPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
