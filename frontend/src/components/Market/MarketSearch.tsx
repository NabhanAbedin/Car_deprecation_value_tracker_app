import type { MarketSearchProps } from "../../types/interfaces"


const MarketSearchComponent = ({marketSearch, setMarketSearch}: MarketSearchProps) => {

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setMarketSearch(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div>
            <div>
                <label htmlFor="brand">Brand</label>
                <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={marketSearch.brand || ''}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="model">Model</label>
                <input
                    type="text"
                    id="model"
                    name="model"
                    value={marketSearch.model || ''}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="year">Year</label>
                <input
                    type="number"
                    id="year"
                    name="year"
                    value={marketSearch.year || ''}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="conditionScore">Condition Score</label>
                <input
                    type="number"
                    id="conditionScore"
                    name="conditionScore"
                    value={marketSearch.conditionScore || ''}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="mileage">Mileage</label>
                <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={marketSearch.mileage || ''}
                    onChange={onChange}
                />
            </div>

            <div>
                <label htmlFor="soldPrice">Sold Price</label>
                <input
                    type="number"
                    id="soldPrice"
                    name="soldPrice"
                    value={marketSearch.soldPrice || ''}
                    onChange={onChange}
                />
            </div>
        </div>
    )

}

export default MarketSearchComponent;