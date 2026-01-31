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

    if (isPending) {
        return (
            <div className="min-h-screen bg-primary-950 flex items-center justify-center">
                <h1 className="text-2xl text-primary-200">Loading...</h1>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-primary-950 flex items-center justify-center">
                <h1 className="text-2xl text-red-400">Error loading data</h1>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-primary-950">
           <MarketNav showMarketSearch={showMarketSearch} setShowMarketSearch={setShowMarketSearch}/>
            {showMarketSearch && (
                <div className="py-6">
                    <MarketSearchComponent marketSearch={marketSearch} setMarketSearch={setMarketSearch} onSearch={handleSearch} />
                </div>
            )}
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