import { Link } from "react-router-dom";
import { getUserHistory } from "../api/valuationApi";
import { type Valuation } from "../types/interfaces";
import { useQuery } from "@tanstack/react-query";

const HistoryPage = () => {

    const { data: history, isLoading, error } = useQuery<Valuation[]>({
        queryKey: ['history'],
        queryFn: getUserHistory,
    });

    const nav = (
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
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                {nav}
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm tracking-wide">Loading history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                {nav}
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-900 font-semibold text-lg tracking-tight">Failed to load history</p>
                        <p className="text-gray-400 text-sm mt-1">{error.message || 'Something went wrong. Please try again.'}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {nav}

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
