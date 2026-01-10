import { Link } from "react-router-dom";
import { type MarketNavProps } from "../../types/interfaces";



const MarketNav = ({showMarketSearch, setShowMarketSearch}: MarketNavProps) => {
    
    return (
        <nav className="w-screen bg-primary-600 text-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Car Market</h1>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setShowMarketSearch(!showMarketSearch)}
                    >
                        {showMarketSearch ? 'Hide' : 'Show'} Filters
                    </button>
                    <Link to={'/login'} style={{color: 'white', textDecoration: 'none'}}>Login</Link>
                    <Link to={'/register'} style={{color: 'white', textDecoration: 'none'}}>Register</Link>
                </div>
            </div>
        </nav>
    )
}

export default MarketNav;