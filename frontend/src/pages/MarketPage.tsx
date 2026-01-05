import { useState } from "react";
import { Link } from "react-router-dom";
import type { MarketSearch } from "../types/interfaces";
import MarketSearchComponent from "../components/Market/MarketSearch";



const MarketPage = () => {
    const [marketSearch, setMarketSearch] = useState<MarketSearch>({
        brand: '',
        model: '',
        year: '',
        conditionScore: '',
        mileage: '',
        soldPrice: '',
    });
    const [showMarketSearch, setShowMarketSearch] = useState<boolean>(false);

    return (
        <div>
           <nav>
            <div onClick={() => setShowMarketSearch(!marketSearch)}>
                show filter
                {showMarketSearch && (
                    <MarketSearchComponent marketSearch={marketSearch} setMarketSearch={setMarketSearch} />
                )}
            </div>
            <Link to={'/login'}>Login icon</Link>
            <Link to={'/register'}>Register icon</Link>
           </nav>
        </div>
    )
}



export default MarketPage;