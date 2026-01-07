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
    setHasSearched: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MarketCard {
    id: string,
    brand: string;
    model: string,
    year: string,
    conditionScore: string,
    mileage: string,
    soldPrice: string,
    img: string
}

export interface MarketDataDto {
    id: string,
    brand: string;
    model: string,
    year: string,
    conditionScore: string,
    mileage: string,
    soldPrice: string,
    img: string
}

export interface MarketCardProps {
    marketData: MarketCard
}

export interface ValuationRequest {
    inputBrand: string,
    inputModel: string,
    inputYear: string,
    inputConditionScore: string,
    inputMileage: string,
}

export interface ValuationNeighbor {
    id: string;
    valuationId: string;
    marketDataId: string;
    marketData: {
        id: string;
        brand: string;
        model: string;
        year: string;
        conditionScore: string;
        mileage: string;
        soldPrice: string;
        img: string;
    };
}

export interface ValuationDto {
    id: string;
    userId: string;
    inputBrand: string;
    inputModel: string;
    inputYear: string;
    inputConditionScore: string;
    inputMileage: string;
    predictedPrice: string;
    createdAt: string; // or Date if you parse it
    valuationNeighbors: ValuationNeighbor[];
}