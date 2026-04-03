from typing import Any, Dict
import time

class AIMonitoring:
    def __init__(self):
        self.logs = []

    def log_prediction(self, model_name: str, input_data: Any, output: Any, latency: float):
        entry = {
            "timestamp": time.time(),
            "model": model_name,
            "input": input_data,
            "output": output,
            "latency_ms": latency
        }
        self.logs.append(entry)
        # In production, this would send data to Prometheus/Grafana or a DB
        print(f"Logged prediction for {model_name}")

    def check_drift(self, current_distribution: Any, baseline_distribution: Any) -> float:
        # Simple KS test or similar for drift detection
        return 0.05
