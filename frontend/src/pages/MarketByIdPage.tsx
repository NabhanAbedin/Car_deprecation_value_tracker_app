import { useQuery } from "@tanstack/react-query"
import { getMarketById } from "../api/marketApi"
import { type MarketDataDto } from "../types/interfaces"
import { useParams } from "react-router-dom"

const MarketByIdPage = () => {
    const {id} = useParams();

    const {data: marketData, isLoading, error} = useQuery<MarketDataDto>({
        queryKey: ['marketById',id],
        queryFn: async () => {
            if (!id) throw new Error("No Id Provided");

            return await getMarketById(id);
        },
        enabled: !!id,
    })

    return (
        <div className="min-h-screen bg-white">
            <nav className="w-screen bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">Car Market</h1>
                    <button
                        onClick={() => window.history.back()}
                        className="text-sm text-gray-900 hover:text-gray-600 transition-colors"
                    >
                        ← Back
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <p className="text-gray-400 text-sm">Loading...</p>
                    </div>
                ) : (error || !marketData) ? (
                    <div className="flex justify-center py-20">
                        <p className="text-gray-400 text-sm">Failed to load vehicle data.</p>
                    </div>
                ) : (
                    <>
                        <img
                            src={marketData.img}
                            alt={`${marketData.brand} ${marketData.model}`}
                            className="w-full h-80 object-cover rounded-xl mb-8"
                        />

                        <h2 className="text-4xl font-bold text-gray-900 mb-1">{marketData.brand} {marketData.model}</h2>
                        <p className="text-gray-400 text-sm mb-10">{marketData.year}</p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Condition</span>
                                <span className="text-sm font-medium text-gray-900">{marketData.conditionScore}/10</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Mileage</span>
                                <span className="text-sm font-medium text-gray-900">{Number(marketData.kilometers).toLocaleString()} mi</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Year</span>
                                <span className="text-sm font-medium text-gray-900">{marketData.year}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Sold Price</span>
                                <span className="text-sm font-bold text-gray-900">${Number(marketData.soldPrice).toLocaleString()}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default MarketByIdPage;
