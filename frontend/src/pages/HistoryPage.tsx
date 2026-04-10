import { Link } from "react-router-dom";
import { getUserHistory } from "../api/valuationApi";
import { type Valuation } from "../types/interfaces";
import { useQuery } from "@tanstack/react-query";

const HistoryPage = () => {

    const { data: history, isLoading, error } = useQuery<Valuation[]>({
        queryKey: ['history'],
        queryFn: getUserHistory,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-400 text-sm">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-400 text-sm">Failed to load history.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <nav className="w-screen bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">Car Market</h1>
                    <Link to="/" className="text-sm text-gray-900 hover:text-gray-600 transition-colors">← Back</Link>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Valuation History</h2>
                <p className="text-gray-400 text-sm mb-10">Your past car valuations</p>

                {!history || history.length === 0 ? (
                    <p className="text-gray-400 text-sm">No valuations yet. Start by requesting a valuation!</p>
                ) : (
                    <div className="space-y-4">
                        {history.map((valuation) => (
                            <Link
                                key={valuation.id}
                                to={`/history/${valuation.id}`}
                                className="block border-b border-gray-100 pb-4 hover:bg-gray-50 px-2 py-3 rounded-lg transition"
                            >
                                <p className="text-lg font-semibold text-gray-900">
                                    {valuation.inputBrand} {valuation.inputModel}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {valuation.inputYear} · {valuation.inputKilometers.toLocaleString()} km · {valuation.inputFuelType}
                                </p>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    ${valuation.predictedValue.toLocaleString()}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
