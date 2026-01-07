import { useState } from "react";
import { Link } from "react-router-dom";
import { type MarketDataDto, type MarketSearch } from "../types/interfaces";
import MarketSearchComponent from "../components/Market/MarketSearch";
import { useQuery } from "@tanstack/react-query";
import MarketCard from "../components/Market/MarketCard";
import { getMarket } from "../api/marketApi";



const MarketPage = () => {
    const [marketSearch, setMarketSearch] = useState<MarketSearch>({
        brand: '',
        model: '',
        year: '',
        conditionScore: '',
        mileage: '',
        soldPrice: '',
    });
    const [showMarketSearch, setShowMarketSearch] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const params = new URLSearchParams();


    const {data: marketData, isLoading, error} = useQuery<MarketDataDto[]>({
        queryKey: ['marketData', params.toString() ], //change to string of query later
        queryFn: async () => {
            if (marketSearch.brand) params.append('brand', marketSearch.brand);
            if (marketSearch.model) params.append('model', marketSearch.model);
            if (marketSearch.year) params.append('year', marketSearch.year);
            if (marketSearch.conditionScore) params.append('conditionScore', marketSearch.conditionScore);
            if (marketSearch.mileage) params.append('mileage', marketSearch.mileage);
            if (marketSearch.soldPrice) params.append('soldPrice', marketSearch.soldPrice);

            const queryString = params.toString();

            const data = await getMarket(queryString);
            return data;


        },
        enabled: !hasSearched || marketSearch.brand?.trim() !== '',
        staleTime: 5 * 60 * 1000,  
        gcTime: 10 * 60 * 1000,
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-primary-50 flex items-center justify-center">
                <h1 className="text-2xl text-primary-700">Loading...</h1>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-primary-50 flex items-center justify-center">
                <h1 className="text-2xl text-red-600">Error loading data</h1>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-primary-50">
           <nav className="bg-primary-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Car Market</h1>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setShowMarketSearch(!showMarketSearch)}
                        className="bg-primary-700 hover:bg-primary-800 px-4 py-2 rounded-lg transition"
                    >
                        {showMarketSearch ? 'Hide' : 'Show'} Filters
                    </button>
                    <Link to={'/login'} className="hover:text-primary-200 transition">Login</Link>
                    <Link to={'/register'} className="hover:text-primary-200 transition">Register</Link>
                </div>
            </div>
            {showMarketSearch && (
                <div className="bg-white border-t border-primary-200">
                    <div className="container mx-auto px-4 py-6">
                        <MarketSearchComponent marketSearch={marketSearch} setMarketSearch={setMarketSearch} setHasSearched={setHasSearched} />
                    </div>
                </div>
            )}
           </nav>
           <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {marketData?.map((item) => (
                <MarketCard
                    key={item.id}
                    marketData={item}
                />
                ))}
            </div>
           </div>
        </div>
    )
}



export default MarketPage;