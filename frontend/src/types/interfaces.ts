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
    onSearch: () => void;
}

export interface MarketCard {
    id: string,
    brand: string;
    model: string,
    year: string,
    conditionScore: string,
    kilometers: string,
    soldPrice: string,
    img: string
}

export interface MarketDataDto {
    id: string,
    brand: string;
    model: string,
    year: string,
    conditionScore: string,
    kilometers: string,
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
    inputKilometers: string,
    inputTransmission: string,
    inputFuelType: string,
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

export interface MarketNavProps {
    showMarketSearch: boolean;
    setShowMarketSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AuthNavProps {
    authPageType: string;
}



interface Neighbors {
    id: string;
    brand: string;
    model: string;
    year: number;
    conditionScore: number;
    kilometers: number;
    soldPrice: number;
    age: number;
    transmission: string;
    fuelType: number;
    owner: string;
    featuresVector: {
        memory: number[];
    };
    img: string;
}

interface newValuation {
    id: string;
    userId: string;
    inputBrand: string;
    inputModel: string;
    inputYear: number;
    inputConditionScore: number;
    inputKilometers: number;
    inputFuelType: string;
    inputTransmission: string;
    predictedValue: number;
    valuationDate: string;
    featuresVector: {
        memory: number[];
    };
    user: null;
    valuationNeighbors: null;
}

export interface valuationRequestDto {
    calcluatedNeigbors: {
        predictedValue: number;
        neighbors: Neighbors[];
    }
    valuationId: string;
    

}

export interface ValuationResultProps {
    neighbors: Neighbors[];
    predictedValue: number;
}

export interface HistoryResponse {
    valuation: {
        inputBrand: string;
        inputModel: string;
        inputYear: number;
        inputConditionScore: number;
        inputKilometers: number;
        inputTransmission: string;
        inputFuelType: string;
        predictedValue: number;
    };
    neighbors: {
        brand: string;
        model: string;
        year: number;
        conditionScore: number;
        kilometers: number;
        soldPrice: number;
    }[];
}

export interface Valuation {
    id: string;
    userId: string;
    inputBrand: string;
    inputModel: string;
    inputYear: number;
    inputConditionScore: number;
    inputKilometers: number;
    inputFuelType: string;
    inputTransmission: string;
    predictedValue: number;
    valuationDate: string;
}