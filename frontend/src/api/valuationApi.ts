import { getFreshJwt } from "../lib/getFreshJWT";
import type { HistoryResponse, Valuation, ValuationDto, ValuationRequest, valuationRequestDto } from "../types/interfaces";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const createValuation = async (valuationData: ValuationRequest): 
Promise<valuationRequestDto> => {
    const token = await getFreshJwt();
    console.log('token type:', typeof token, 'value:', token);
    const res = await fetch(`${API_BASE_URL}/api/valuation/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
    const token = await getFreshJwt();
    const res = await fetch(`${API_BASE_URL}/api/valuation/history`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) { 
        throw new Error('History data retrival failed');
    }

    return res.json();
}

export const getHistoryById = async (id: string): Promise<HistoryResponse> => {
    const token = await getFreshJwt();
    const res = await fetch(`${API_BASE_URL}/api/valuation/history/${id}`, {
        method: 'GET',
        headers: {
           'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (!res.ok) throw new Error("Cannot retrieve data");

    return res.json();
}