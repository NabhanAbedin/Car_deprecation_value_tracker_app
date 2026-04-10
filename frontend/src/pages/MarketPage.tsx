import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { type MarketDataDto, type MarketSearch } from "../types/interfaces";
import MarketSearchComponent from "../components/Market/MarketSearch";
import { useMutation } from "@tanstack/react-query";
import MarketCard from "../components/Market/MarketCard";
import { getMarket } from "../api/marketApi";
import MarketNav from "../components/nav/MarketNav";



const MarketPage = () => {
    const [marketSearch, setMarketSearch] = useState<MarketSearch>({
        brand: '',
        model: '',
        year: '',
        conditionScore: '',
        mileage: '',
        soldPrice: '',
    });
    const [, setSearchParams] = useSearchParams();
    const [showMarketSearch, setShowMarketSearch] = useState<boolean>(false);


    const {mutate: fetchMarket, data: marketData, isPending, error} = useMutation<MarketDataDto[], Error, string>({
        mutationKey: ['marketData'],
        mutationFn: async (queryString: string) => {
            
            const data = await getMarket(queryString);
            return data;


        }
    })

    useEffect(() => {
       handleSearch();
    },[])

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (marketSearch.brand) params.append('brand', marketSearch.brand);
        if (marketSearch.model) params.append('model', marketSearch.model);
        if (marketSearch.year) params.append('year', marketSearch.year);
        if (marketSearch.conditionScore) params.append('conditionScore', marketSearch.conditionScore);
        if (marketSearch.mileage) params.append('mileage', marketSearch.mileage);
        if (marketSearch.soldPrice) params.append('soldPrice', marketSearch.soldPrice);

        setSearchParams(params);

        fetchMarket(params.toString());
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <MarketNav showMarketSearch={showMarketSearch} setShowMarketSearch={setShowMarketSearch} />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-900 font-semibold text-lg tracking-tight">Failed to load market data</p>
                        <p className="text-gray-400 text-sm mt-1">{error.message || 'Something went wrong. Please try again.'}</p>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="mt-1 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
           <MarketNav showMarketSearch={showMarketSearch} setShowMarketSearch={setShowMarketSearch}/>
            {showMarketSearch && (
                <div className="py-6">
                    <MarketSearchComponent marketSearch={marketSearch} setMarketSearch={setMarketSearch} onSearch={handleSearch} />
                </div>
            )}
           <div className="container mx-auto px-4 py-8">
            {isPending ? (
                <div className="flex flex-col items-center gap-4 py-20">
                    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm tracking-wide">Loading market data...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketData?.map((item) => (
                        <MarketCard
                            key={item.id}
                            marketData={item}
                        />
                    ))}
                </div>
            )}
           </div>
        </div>
    )
}



export default MarketPage;