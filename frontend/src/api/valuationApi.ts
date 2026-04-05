import type { HistoryResponse, Valuation, ValuationDto, ValuationRequest, valuationRequestDto } from "../types/interfaces";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const createValuation = async (valuationData: ValuationRequest): Promise<valuationRequestDto> => {
    const res = await fetch(`${API_BASE_URL}/api/valuation/predict`, {
        method: 'POST',
        headers: {
            //need to include auth header later
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(valuationData)
    });

    if (!res.ok) {
        throw new Error('Valuation Failed');
    }

    const result = await res.json();
    return result;
}

export const getValuationById = async (id: string): Promise<ValuationDto> => {
    const res = await fetch(`${API_BASE_URL}/api/valuation/${id}`);

    if (!res.ok) {
        throw new Error('valuation failed');
    }

    return res.json();
}


export const getUserHistory = async (): Promise<Valuation[]> => {
    const res = await fetch(`${API_BASE_URL}/api/valuation/history`, {
        method: 'GET',
        headers: {
            //headers for auth
        }
    })

    if (!res.ok) { 
        throw new Error('History data retrival failed');
    }

    return res.json();
}

export const getHistoryById = async (id: string): Promise<HistoryResponse> => {

    const res = await fetch(`${API_BASE_URL}/api/valuation/history/${id}`, {
        method: 'GET',
        headers: {
            //auth headers
        }
    })

    if (!res.ok) throw new Error("Cannot retrieve data");

    return res.json();
}