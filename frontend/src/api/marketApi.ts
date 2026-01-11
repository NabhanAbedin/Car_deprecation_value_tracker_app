import type { MarketDataDto} from "../types/interfaces";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getMarket = async (query: string): Promise<MarketDataDto[]> => {
    const url = query ? `${API_BASE_URL}/api/market?${query}` : `${API_BASE_URL}/api/market`;
    
    const res = await fetch(url);
    
    if (!res.ok) {
        throw new Error('Failed to fetch market data');
    }
    
    return res.json();
}

export const getMarketById = async (id: string): Promise<MarketDataDto> => {
    
    const res = await fetch(`${API_BASE_URL}/api/market/${id}`);
    
    if (!res.ok) {
        throw new Error('Failed to fetch market data');
    }
    
    return res.json();
}