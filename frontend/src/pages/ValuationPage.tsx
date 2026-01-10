import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { type ValuationDto } from "../types/interfaces";
import { getValuationById } from "../api/ValuationApi";


const ValuationPage = () => {
    const {id} = useParams();

    const {data: valuation, isLoading, error} = useQuery<ValuationDto>({
        queryKey: ['valuation',id],
        queryFn: async () => {
            if (!id) throw new Error('No ID provided');
            return await getValuationById(id);
        },
        enabled: !!id,
    })


    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary-950 flex items-center justify-center">
                <h1 className="text-2xl text-primary-200">Loading...</h1>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-primary-950 flex items-center justify-center">
                <h1 className="text-2xl text-red-400">Error loading valuation</h1>
            </div>
        )
    }

    if (!valuation) {
        return (
            <div className="min-h-screen bg-primary-950 flex items-center justify-center">
                <h1 className="text-2xl text-gray-400">No valuation found</h1>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-primary-950">
            <nav className="w-screen bg-primary-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Valuation Details</h1>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-primary-700 mb-4">Your Car</h2>
                        <div className="space-y-2">
                            <p className="text-gray-700"><span className="font-medium">Brand:</span> {valuation.inputBrand}</p>
                            <p className="text-gray-700"><span className="font-medium">Model:</span> {valuation.inputModel}</p>
                            <p className="text-gray-700"><span className="font-medium">Year:</span> {valuation.inputYear}</p>
                            <p className="text-gray-700"><span className="font-medium">Condition:</span> {valuation.inputConditionScore}/10</p>
                            <p className="text-gray-700"><span className="font-medium">Mileage:</span> {valuation.inputMileage.toLocaleString()} miles</p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-primary-600 text-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-2">Predicted Price</h2>
                        <p className="text-5xl font-bold mb-4">${valuation.predictedPrice.toLocaleString()}</p>
                        <p className="text-primary-100">Created: {new Date(valuation.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-primary-700 mb-6">
                        Similar Vehicles ({valuation.valuationNeighbors.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {valuation.valuationNeighbors.map((neighbor) => (
                            <div key={neighbor.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                                <img
                                    src={neighbor.marketData.img}
                                    alt={`${neighbor.marketData.brand} ${neighbor.marketData.model}`}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        {neighbor.marketData.brand} {neighbor.marketData.model}
                                    </h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p><span className="font-medium">Year:</span> {neighbor.marketData.year}</p>
                                        <p><span className="font-medium">Condition:</span> {neighbor.marketData.conditionScore}/10</p>
                                        <p><span className="font-medium">Mileage:</span> {neighbor.marketData.mileage.toLocaleString()} miles</p>
                                        <p className="text-primary-600 font-bold text-base mt-2">
                                            Sold: ${neighbor.marketData.soldPrice.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ValuationPage;