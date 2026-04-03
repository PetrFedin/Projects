import numpy as np
from app.ai.models.demand_model import DemandForecastModel

def run_demand_training_pipeline():
    print("Starting demand forecasting training pipeline...")
    # 1. Load data from DB (mocked)
    X = np.random.rand(1000, 10)
    y = np.random.rand(1000)
    
    # 2. Initialize model
    model = DemandForecastModel()
    
    # 3. Train
    model.train(X, y)
    
    # 4. Evaluate
    metrics = model.evaluate(X, y)
    print(f"Pipeline completed. Metrics: {metrics}")

if __name__ == "__main__":
    run_demand_training_pipeline()
