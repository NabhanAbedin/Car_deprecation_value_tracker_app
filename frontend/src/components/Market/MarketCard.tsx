import { Link } from "react-router-dom";
import type { MarketCardProps } from "../../types/interfaces"

const MarketCard = ({marketData}: MarketCardProps) => {
    console.log(marketData);
    return (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
            <img src={marketData.img} alt={`${marketData.brand} ${marketData.model}`} className="w-full h-36 object-cover" />
            <div className="p-4">
                <h1 className="text-base font-bold text-gray-900 leading-tight">{marketData.brand}</h1>
                <p className="text-sm text-gray-400 mb-4">{marketData.model} · {marketData.year}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Condition</span>
                        <span className="text-xs text-gray-900">{marketData.conditionScore}/10</span>
                    </div>
                    <div className="border-t border-gray-100" />
                    <div className="flex justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Mileage</span>
                        <span className="text-xs text-gray-900">{marketData.kilometers} km</span>
                    </div>
                    <div className="border-t border-gray-100" />
                    <div className="flex justify-between">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Sold</span>
                        <span className="text-xs font-bold text-gray-900">${marketData.soldPrice.toLocaleString()}</span>
                    </div>
                </div>

                <Link
                    to={`/marketData/${marketData.id}`}
                    className="block w-full text-center bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold py-2 rounded-xl transition"
                >
                    View Details
                </Link>
            </div>
        </div>
    )
}


export default MarketCard;