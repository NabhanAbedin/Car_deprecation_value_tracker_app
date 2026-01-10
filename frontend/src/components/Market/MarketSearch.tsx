import type { MarketSearchProps } from "../../types/interfaces"


const MarketSearchComponent = ({marketSearch, setMarketSearch, onSearch}: MarketSearchProps) => {

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setMarketSearch(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch();
    }

    return (
        <form onSubmit={handleSubmit} className="w-[80vw] mx-auto bg-white rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={marketSearch.brand || ''}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
            </div>

            <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                    type="text"
                    id="model"
                    name="model"
                    value={marketSearch.model || ''}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
            </div>

            <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                    type="number"
                    id="year"
                    name="year"
                    value={marketSearch.year || ''}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
            </div>

            <div>
                <label htmlFor="conditionScore" className="block text-sm font-medium text-gray-700 mb-1">Condition Score</label>
                <input
                    type="number"
                    id="conditionScore"
                    name="conditionScore"
                    value={marketSearch.conditionScore || ''}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
            </div>

            <div>
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={marketSearch.mileage || ''}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
            </div>

            <div>
                <label htmlFor="soldPrice" className="block text-sm font-medium text-gray-700 mb-1">Sold Price</label>
                <input
                    type="number"
                    id="soldPrice"
                    name="soldPrice"
                    value={marketSearch.soldPrice || ''}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
                <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                    Search
                </button>
            </div>
        </form>
    )

}

export default MarketSearchComponent;