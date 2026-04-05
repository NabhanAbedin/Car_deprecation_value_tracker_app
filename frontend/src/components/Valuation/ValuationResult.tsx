import type { ValuationResultProps } from "../../types/interfaces";


const ValuationResult = ({neighbors, predictedValue}: ValuationResultProps) => {
    return (
        <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="mb-8 text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Predicted Value</p>
                <p className="text-4xl font-bold text-gray-900">${predictedValue.toLocaleString()}</p>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Similar Cars</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(neighbors ?? []).map((neighbor) => (
                    <div key={neighbor.id} className="border border-gray-100 rounded-xl p-5">
                        <p className="text-sm font-semibold text-gray-900">{neighbor.brand} {neighbor.model}</p>
                        <p className="text-xs text-gray-400 mt-1">{neighbor.year} · {neighbor.transmission} · {neighbor.fuelType}</p>
                        <div className="mt-3 flex justify-between text-xs text-gray-500">
                            <span>{neighbor.kilometers.toLocaleString()} km</span>
                            <span>Condition: {neighbor.conditionScore}/10</span>
                        </div>
                        <p className="mt-3 text-base font-bold text-gray-900">${neighbor.soldPrice.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ValuationResult;