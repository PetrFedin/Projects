import os
import sys
from datetime import datetime

# Import all agents
from app.agents.code_quality_agent import CodeQualityAgent
from app.agents.architecture_guard_agent import ArchitectureGuardAgent
from app.agents.feature_suggestion_agent import FeatureSuggestionAgent
from app.agents.ui_improvement_agent import UIImprovementAgent
from app.agents.ai_module_curator_agent import AIModuleCuratorAgent
from app.agents.tech_debt_agent import TechDebtAgent

class AgentRunner:
    def __init__(self, output_dir: str = ".ai_reports"):
        self.output_dir = output_dir
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def run_all(self):
        print(f"[{datetime.now()}] Starting Autonomous Improvement System...")
        
        agents = [
            (CodeQualityAgent(), "code_quality_report.md"),
            (ArchitectureGuardAgent(), "architecture_report.md"),
            (FeatureSuggestionAgent(), "feature_suggestions.md"),
            (UIImprovementAgent(), "ui_improvement_suggestions.md"),
            (AIModuleCuratorAgent(), "ai_intelligence_report.md"),
            (TechDebtAgent(), "tech_debt_report.md"),
        ]

        for agent, filename in agents:
            try:
                print(f"Running {agent.__class__.__name__}...")
                path = os.path.join(self.output_dir, filename)
                agent.generate_report(path)
                print(f"Report generated: {path}")
            except Exception as e:
                print(f"Error running {agent.__class__.__name__}: {str(e)}")

        print(f"[{datetime.now()}] All agents completed. Check {self.output_dir} for results.")

if __name__ == "__main__":
    runner = AgentRunner()
    runner.run_all()
