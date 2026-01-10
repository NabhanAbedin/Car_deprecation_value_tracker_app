import { Link } from "react-router-dom";
import type { MarketCardProps } from "../../types/interfaces"

const MarketCard = ({marketData}: MarketCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div>
                <img src={marketData.img} alt={`${marketData.brand} ${marketData.model}`} className="w-full h-32 object-cover" />
            </div>
            <div className="p-3">
                <div className="mb-2">
                    <h1 className="text-base font-bold text-gray-800">{marketData.brand}</h1>
                    <h2 className="text-sm text-gray-600">{marketData.model}</h2>
                </div>
                <div className="space-y-1 text-xs text-gray-700 mb-3">
                    <div className="flex justify-between">
                        <span className="font-medium">Condition:</span>
                        <span>{marketData.conditionScore}/10</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Mileage:</span>
                        <span>{marketData.mileage.toLocaleString()} mi</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Year:</span>
                        <span>{marketData.year}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium">Sold:</span>
                        <span className="text-primary-600 font-bold">${marketData.soldPrice.toLocaleString()}</span>
                    </div>
                </div>
                <div>
                    <Link
                        to={`/marketData/${marketData.id}`}
                        className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold py-1.5 px-3 rounded-md transition"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default MarketCard;