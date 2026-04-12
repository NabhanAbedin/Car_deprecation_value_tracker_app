import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHistoryById } from "../api/valuationApi";
import type { HistoryResponse } from "../types/interfaces";

const HistoryByIdPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useQuery<HistoryResponse>({
        queryKey: ['valuation', id],
        queryFn: () => getHistoryById(id!),
        enabled: !!id,
    });

    return (
        <div className="min-h-screen bg-white">
            <nav className="w-screen bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Car Market</h1>
                        <button
                            onClick={() => window.history.back()}
                            className="text-sm text-gray-900 hover:text-gray-600 transition-colors"
                        >
                            Back
                        </button>
                    </div>
                </nav>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <p className="text-gray-400 text-sm">Loading...</p>
                    </div>
                ) : (error || !data) ? (
                    <div className="flex justify-center py-20">
                        <p className="text-gray-400 text-sm">Failed to load valuation.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            {data.valuation.inputBrand} {data.valuation.inputModel}
                        </h2>
                        <p className="text-gray-400 text-sm mb-10">Valuation details</p>

                        <div className="border-b border-gray-100 pb-8 mb-8">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Your Car</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Year</p>
                                    <p className="text-sm text-gray-900">{data.valuation.inputYear}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Kilometers</p>
                                    <p className="text-sm text-gray-900">{data.valuation.inputKilometers.toLocaleString()} km</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Condition</p>
                                    <p className="text-sm text-gray-900">{data.valuation.inputConditionScore}/10</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Fuel</p>
                                    <p className="text-sm text-gray-900">{data.valuation.inputFuelType}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Transmission</p>
                                    <p className="text-sm text-gray-900">{data.valuation.inputTransmission}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Predicted Score</p>
                                    <p className="text-sm text-gray-900">${data.valuation.predictedValue.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Similar Cars Sold</p>
                            <div className="space-y-4">
                                {data.neighbors.map((neighbor, index) => (
                                    <div key={index} className="border-b border-gray-100 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {neighbor.brand} {neighbor.model}
                                                </p>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {neighbor.year} · {neighbor.kilometers.toLocaleString()} km · {neighbor.conditionScore}/10
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                ${neighbor.soldPrice.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default HistoryByIdPage;
