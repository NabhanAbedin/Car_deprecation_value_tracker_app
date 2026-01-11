import { getUserHistory } from "../api/valuationApi";
import { type ValuationDto } from "../types/interfaces";
import { useQuery } from "@tanstack/react-query";

const HistoryPage = () => {

    const {data: history, isLoading, error} = useQuery<ValuationDto[]>({
        queryKey: ['history'],
        queryFn: getUserHistory,
    })

    if (isLoading) return <h1>Loading</h1>
    if (error) return <h1>Error</h1>

    if (!history) return <h1>History not found</h1>


    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Valuation History</h1>

                {history.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No valuations yet. Start by requesting a valuation!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((valuation) => (
                            <div
                                key={valuation.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {valuation.inputBrand} {valuation.inputModel}
                                        </h2>
                                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Year:</span> {valuation.inputYear}
                                            </div>
                                            <div>
                                                <span className="font-medium">Mileage:</span> {valuation.inputMileage}
                                            </div>
                                            <div>
                                                <span className="font-medium">Condition:</span> {valuation.inputConditionScore}/10
                                            </div>
                                            <div>
                                                <span className="font-medium">Date:</span> {new Date(valuation.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-6 text-right">
                                        <p className="text-sm text-gray-500">Predicted Value</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${Number(valuation.predictedPrice).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {valuation.valuationNeighbors && valuation.valuationNeighbors.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Similar Cars Found:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {valuation.valuationNeighbors.slice(0, 3).map((neighbor) => (
                                                <div
                                                    key={neighbor.id}
                                                    className="text-xs bg-gray-50 rounded p-2"
                                                >
                                                    <p className="font-medium text-gray-800">
                                                        {neighbor.marketData.brand} {neighbor.marketData.model}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {neighbor.marketData.year} · {neighbor.marketData.mileage} mi
                                                    </p>
                                                    <p className="text-green-600 font-semibold">
                                                        ${Number(neighbor.marketData.soldPrice).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )

}

export default HistoryPage;