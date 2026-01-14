# Local ML Development

This directory contains scripts for training the KNN car valuation model locally before deploying to AWS Lambda.

## Directory Structure

```
local/
├── data/
│   ├── raw/              # Place downloaded CSV here
│   ├── cleaned/          # Cleaned data will be saved here
│   └── models/           # Trained model artifacts
├── data_cleaner.py       # Step 1: Clean raw data
├── model_trainer.py      # Step 2: Train KNN model
├── predictor.py          # Step 3: Test predictions
├── requirements.txt      # Python dependencies
└── README.md             # This file
```

## Setup Instructions

### 1. Create Virtual Environment

```bash
# Navigate to the local directory
cd infrastructure/lambda/local

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Download Dataset

Download a car sales dataset from Kaggle with the following columns:
- Model (e.g., "ToyotaCamry" - will be split into Brand + Model)
- Year
- Selling Price
- Kilometers Driven (will be converted to miles)
- Car Condition (will be normalized to 1-10 scale)

**Recommended datasets:**
- [Used Car Price Prediction Dataset](https://www.kaggle.com/datasets/taeefnajib/used-car-price-prediction-dataset)
- [Used Car Price Data](https://www.kaggle.com/datasets/ankits29/used-car-price-data)

**Save the CSV as:** `data/raw/cars_raw.csv`

## Running the Pipeline

### Step 1: Clean the Data

```bash
python data_cleaner.py
```

**What it does:**
- Splits "ToyotaCamry" into Brand="Toyota", Model="Camry"
- Converts kilometers to miles
- Normalizes condition scores to 1-10 scale
- Removes outliers and missing values
- Generates synthetic sale dates
- Saves cleaned data to `data/cleaned/cars_cleaned.csv`

### Step 2: Train the Model

```bash
python model_trainer.py
```

**What it does:**
- Encodes categorical features (Brand, Model)
- Scales numerical features using StandardScaler
- Trains KNN regressor (k=5)
- Evaluates model with train/test split and cross-validation
- Saves model artifacts to `data/models/`:
  - `knn_model.joblib` - Trained KNN model
  - `scaler.joblib` - StandardScaler for feature scaling
  - `encoders.joblib` - Label encoders for Brand/Model
  - `metrics.json` - Model performance metrics

### Step 3: Test Predictions

```bash
# Run automated tests
python predictor.py

# Or run interactive mode
python predictor.py --interactive
```

**What it does:**
- Loads trained model and encoders
- Makes predictions on sample cars
- Returns predicted price + 5 nearest neighbors
- Shows which similar cars influenced the prediction

## Understanding the Output

### Model Metrics (metrics.json)

```json
{
  "k": 5,
  "test_mae": 2500.00,      // Average error in dollars
  "test_rmse": 3200.00,     // Root mean squared error
  "test_r2": 0.85,          // R² score (0-1, higher is better)
  "cv_mae": 2600.00         // Cross-validation MAE
}
```

**Good model performance:**
- R² > 0.75 (model explains 75%+ of price variation)
- MAE < 10% of average car price
- Test metrics close to training metrics (not overfitting)

## Next Steps After Training

1. **Review Model Performance**
   - Check `data/models/metrics.json`
   - If MAE is too high, try increasing k or getting more data

2. **Upload Cleaned Data to PostgreSQL**
   - Load `data/cleaned/cars_cleaned.csv` into your local `MarketData` table
   - This becomes your KNN reference dataset

3. **Deploy to AWS Lambda**
   - Copy trained models to S3 bucket
   - Update `knn-prediction` Lambda to load models from S3
   - Lambda will use the same prediction logic as `predictor.py`

## Troubleshooting

### "Brand not in training data" warning
- The model hasn't seen this brand before
- It will use a fallback encoding
- Solution: Get more diverse training data

### High MAE (> $5000)
- Model accuracy is low
- Try: Increasing k, adding more features, or getting more data
- Check for outliers in the training data

### ImportError
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

## Column Mapping Reference

| Dataset Column      | Cleaned Column | Type  | Description |
|---------------------|----------------|-------|-------------|
| Model               | Brand + Model  | str   | Split at second uppercase letter |
| Year                | Year           | int   | Manufacturing year |
| Selling Price       | SoldPrice      | int   | Sale price in dollars |
| Kilometers Driven   | Mileage        | int   | Converted to miles |
| Car Condition       | ConditionScore | int   | Normalized to 1-10 scale |
| (Generated)         | SoldDate       | date  | Synthetic sale date |
