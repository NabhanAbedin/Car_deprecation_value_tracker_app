import { useState } from "react";
import type { ValuationRequest } from "../types/interfaces";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createValuation } from "../api/valuationApi";
import ValuationResult from "../components/Valuation/ValuationResult";



const ValuationRequestPage = () => {
    const [valuationRequest, setValuationRequest] = useState<ValuationRequest>({
        inputBrand: '',
        inputModel: '',
        inputYear: '',
        inputConditionScore: '',
        inputKilometers: '',
        inputTransmission: '',
        inputFuelType: '',
    })
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setValuationRequest(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const {mutate: evaluate, isPending, error, data} = useMutation({
        mutationFn: createValuation,
        onSuccess: () => {
            console.log(data);
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const isValid = Object.values(valuationRequest).every(val => val.trim() !== '');
        if (!isValid) {
            alert('Can not evaluate unless all fields are filled');
            return;
        }

        evaluate(valuationRequest);
    }



    if (isPending) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <nav className="w-screen bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">Car Market</h1>
                        <button onClick={() => window.history.back()} className="text-sm text-gray-900 hover:text-gray-600 transition-colors cursor-pointer">← Back</button>
                    </div>
                </nav>
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm tracking-wide">Evaluating your car...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
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
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-900 font-semibold text-lg tracking-tight">Failed to submit valuation</p>
                        <p className="text-gray-400 text-sm mt-1">{error.message || 'Something went wrong. Please try again.'}</p>
                    </div>
                    <button
                        onClick={() => evaluate(valuationRequest)}
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
            <nav className="w-screen bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold tracking-tight text-gray-900">Car Market</h1>
                    <button onClick={() => window.history.back()} className="text-sm text-gray-900 hover:text-gray-600 transition-colors cursor-pointer">← Back</button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-12 max-w-lg">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Get a valuation</h2>
                <p className="text-gray-400 text-sm mb-10">Enter your car details below</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label htmlFor="inputBrand" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Brand
                        </label>
                        <input
                            type="text"
                            id="inputBrand"
                            name="inputBrand"
                            value={valuationRequest.inputBrand}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                            placeholder="e.g. Toyota"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="inputModel" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Model
                        </label>
                        <input
                            type="text"
                            id="inputModel"
                            name="inputModel"
                            value={valuationRequest.inputModel}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                            placeholder="e.g. Camry"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="inputYear" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Year
                        </label>
                        <input
                            type="number"
                            id="inputYear"
                            name="inputYear"
                            value={valuationRequest.inputYear}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                            placeholder="e.g. 2019"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="inputConditionScore" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Condition Score
                        </label>
                        <input
                            type="number"
                            id="inputConditionScore"
                            name="inputConditionScore"
                            value={valuationRequest.inputConditionScore}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                            placeholder="1 – 10"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="inputKilometers" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Kilometers
                        </label>
                        <input
                            type="number"
                            id="inputKilometers"
                            name="inputKilometers"
                            value={valuationRequest.inputKilometers}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                            placeholder="e.g. 45000"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="inputTransmission" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Transmission
                        </label>
                        <input
                            type="text"
                            id="inputTransmission"
                            name="inputTransmission"
                            value={valuationRequest.inputTransmission}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                            placeholder="e.g. Automatic"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="inputFuelType" className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                            Fuel Type
                        </label>
                        <input
                            type="text"
                            id="inputFuelType"
                            name="inputFuelType"
                            value={valuationRequest.inputFuelType}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-gray-200 py-2 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                            placeholder="e.g. Petrol"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={isPending || !Object.values(valuationRequest).every(val => val.trim() !== '')}
                            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            Get Valuation
                        </button>
                    </div>
                </form>

                {data && (
                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-400 mb-4">Valuation completed successfully</p>
                        <Link
                            to={`/history/${data.valuationId}`}
                            className="inline-block bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-xl transition"
                        >
                            View Details
                        </Link>
                    </div>
                )}

                {data && (
                    <ValuationResult neighbors={data.calcluatedNeigbors.neighbors} predictedValue={data.calcluatedNeigbors.predictedValue} />
                )}
            </div>
        </div>
    )







}


export default ValuationRequestPage;