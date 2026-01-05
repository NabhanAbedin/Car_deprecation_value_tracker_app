export interface LoginInfo {
    username: string;
    password: string;
}

export interface RegisterInfo {
    username: string;
    password: string;
    confirmPassword: string;
}

export interface MarketSearch {
    brand?: string;
    model?: string,
    year?: string,
    conditionScore?: string,
    mileage?: string,
    soldPrice?: string,
}

export interface MarketSearchProps {
    marketSearch: MarketSearch;
    setMarketSearch: React.Dispatch<React.SetStateAction<MarketSearch>>;
}