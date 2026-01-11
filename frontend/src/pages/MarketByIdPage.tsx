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

    if (isLoading) return <h1>Loading</h1>
    if (error) return <h1>Error</h1>

    if (!marketData) return <h1>Error Loading Data</h1>


    return (
        <div className="min-h-screen bg-primary-950">
            <nav className="w-screen bg-primary-600 text-white">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Vehicle Details</h1>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="w-full h-96 bg-gray-200">
                        <img
                            src={marketData.img}
                            alt={`${marketData.brand} ${marketData.model}`}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-8">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {marketData.brand} {marketData.model}
                            </h2>
                            <p className="text-xl text-gray-600">{marketData.year}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-primary-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Condition Score</p>
                                <p className="text-2xl font-bold text-primary-700">{marketData.conditionScore}/10</p>
                            </div>

                            <div className="bg-primary-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Mileage</p>
                                <p className="text-2xl font-bold text-primary-700">{Number(marketData.mileage).toLocaleString()} mi</p>
                            </div>

                            <div className="bg-primary-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Year</p>
                                <p className="text-2xl font-bold text-primary-700">{marketData.year}</p>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">Sold Price</p>
                                <p className="text-2xl font-bold text-green-700">${Number(marketData.soldPrice).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => window.history.back()}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition"
                            >
                                Back to Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default MarketByIdPage;