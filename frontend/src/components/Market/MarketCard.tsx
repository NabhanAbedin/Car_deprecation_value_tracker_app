import { Link } from "react-router-dom";
import type { MarketCardProps } from "../../types/interfaces"

const MarketCard = ({marketData}: MarketCardProps) => {
    return (
        <div>
            <div>
                <img src={marketData.img} alt="" />
            </div>
            <div>
                <h1>{marketData.brand}</h1>
                <h2>{marketData.model}</h2>
            </div>
            <div>
                Condition Score: {marketData.conditionScore}
                Mileage: {marketData.mileage}
            </div>
            <div>
                Sold At: {marketData.soldPrice}
                Year: {marketData.year}
            </div>
            <div>
                <button>
                    <Link to={`/marketData/${marketData.id}`}>
                        View Details
                    </Link>
                </button>
            </div>
        </div>
    )
}


export default MarketCard;