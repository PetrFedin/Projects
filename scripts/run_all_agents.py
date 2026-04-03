#!/usr/bin/env python3
"""Run all agents: report agents + orchestrator smoke test."""
import asyncio
import os
import sys

# Add project root
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime


def run_report_agents():
    from app.agents.agent_runner import AgentRunner
    print("\n=== REPORT AGENTS ===\n")
    runner = AgentRunner()
    runner.run_all()


async def run_orchestrator_agents():
    from app.agents.orchestrator_agent import orchestrator_agent

    print("\n=== ORCHESTRATOR AGENTS (smoke test) ===\n")
    tasks = [
        ("Explain project structure", "DocsAgent"),
        ("Suggest a loyalty feature", "ProductArchitectAgent"),
        ("Review the auth module", "ReviewAgent"),
    ]
    for task, expected in tasks:
        try:
            result = await orchestrator_agent.run(task)
            ok = "OK" if expected in result.agent_name else "?"
            print(f"  [{ok}] {task[:40]}... -> {result.agent_name}")
        except Exception as e:
            print(f"  [ERR] {task[:40]}... -> {e}")


def main():
    print(f"\n{'='*50}")
    print(f"  Synth-1 Agent Suite — {datetime.now()}")
    print(f"{'='*50}")

    run_report_agents()

    try:
        asyncio.run(run_orchestrator_agents())
    except Exception as e:
        print(f"  Orchestrator smoke test failed: {e}")

    print(f"\n{'='*50}")
    print("  Done. Reports in .ai_reports/")
    print(f"{'='*50}\n")


if __name__ == "__main__":
    main()
