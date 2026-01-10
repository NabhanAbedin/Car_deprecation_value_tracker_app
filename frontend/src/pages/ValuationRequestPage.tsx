import { useState } from "react";
import type { ValuationRequest } from "../types/interfaces";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createValuation } from "../api/ValuationApi";


const ValuationRequestPage = () => {
    const [valuationRequest, setValuationRequest] = useState<ValuationRequest>({
        inputBrand: '',
        inputModel: '',
        inputMileage: '',
        inputConditionScore: '',
        inputYear: ''
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
            alert('valuation successful');
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
            <div className="min-h-screen bg-primary-950 flex items-center justify-center">
                <h1 className="text-2xl text-primary-200">Loading...</h1>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-primary-950 flex items-center justify-center">
                <h1 className="text-2xl text-red-400">Error submitting valuation request</h1>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-primary-950">
            <nav className="w-screen bg-primary-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Get Car Valuation</h1>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-primary-700 mb-6">Enter Your Car Details</h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="inputBrand" className="block text-sm font-medium text-gray-700 mb-1">
                                Brand
                            </label>
                            <input
                                type="text"
                                id="inputBrand"
                                name="inputBrand"
                                value={valuationRequest.inputBrand}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="inputModel" className="block text-sm font-medium text-gray-700 mb-1">
                                Model
                            </label>
                            <input
                                type="text"
                                id="inputModel"
                                name="inputModel"
                                value={valuationRequest.inputModel}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="inputYear" className="block text-sm font-medium text-gray-700 mb-1">
                                Year
                            </label>
                            <input
                                type="number"
                                id="inputYear"
                                name="inputYear"
                                value={valuationRequest.inputYear}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="inputConditionScore" className="block text-sm font-medium text-gray-700 mb-1">
                                Condition Score
                            </label>
                            <input
                                type="number"
                                id="inputConditionScore"
                                name="inputConditionScore"
                                value={valuationRequest.inputConditionScore}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="inputMileage" className="block text-sm font-medium text-gray-700 mb-1">
                                Mileage
                            </label>
                            <input
                                type="number"
                                id="inputMileage"
                                name="inputMileage"
                                value={valuationRequest.inputMileage}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={isPending || !Object.values(valuationRequest).every(val => val.trim() !== '')}
                                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Get Valuation
                            </button>
                        </div>
                    </form>

                    {data && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="bg-primary-50 rounded-lg p-4 text-center">
                                <p className="text-primary-700 font-medium mb-3">Valuation completed successfully!</p>
                                <Link
                                    to={`/valuation/${data.id}`}
                                    className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )







}


export default ValuationRequestPage;