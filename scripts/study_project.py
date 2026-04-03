#!/usr/bin/env python3
"""
Study project: run agents, index docs into RAG, optional LLM analysis.
Usage: python -m scripts.study_project [--agents-only] [--index-only] [--llm]
"""
import argparse
import asyncio
import os
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, PROJECT_ROOT)
DOCS = [
    ("MASTER_PLAN.md", "Strategic plan and feature registry"),
    ("ARCHITECTURE.md", "Backend and frontend architecture"),
    (".ai_context/project_overview.md", "Project overview"),
    (".ai_context/coding_rules.md", "Coding rules and conventions"),
    (".ai_context/module_map.md", "Module mapping"),
    ("docs/NEXT_IMPROVEMENTS_PLAN.md", "Improvement plan"),
]


async def index_docs():
    """Index project docs into EmbeddingsSearch (RAG)."""
    from app.ai.embeddings_search import EmbeddingsSearch

    os.chdir(PROJECT_ROOT)
    search = EmbeddingsSearch()
    docs = []
    for path, desc in DOCS:
        full = os.path.join(PROJECT_ROOT, path)
        if os.path.exists(full):
            try:
                with open(full, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()[:15000]
                docs.append({"id": path, "text": f"{desc}\n\n{text}", "content": text})
            except Exception as e:
                print(f"  Skip {path}: {e}")
    if docs:
        ok = await search.add_documents(docs)
        print(f"Indexed {len(docs)} docs into RAG. FAISS built: {ok}")
    else:
        print("No docs found to index.")


async def run_llm_study():
    """Run orchestrator with study task (requires real LLM API)."""
    from app.agents.orchestrator_agent import orchestrator_agent
    from app.agents.context_loader import load_project_context

    ctx = load_project_context()
    task = """Study Synth-1 Fashion OS. From MASTER_PLAN and ARCHITECTURE:
1. Summarize main capabilities.
2. Name 3 high-priority improvements.
3. How can AI agents evolve the platform?"""
    result = await orchestrator_agent.run(task, context={"code_context": ctx[:4000]})
    print("Agent:", result.agent_name)
    print("Response:", result.changes_proposed or result.code_changes or "N/A")


def run_agents():
    """Run all report agents."""
    from app.agents.agent_runner import AgentRunner
    runner = AgentRunner()
    runner.run_all()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--agents-only", action="store_true", help="Only run report agents")
    ap.add_argument("--index-only", action="store_true", help="Only index docs into RAG")
    ap.add_argument("--llm", action="store_true", help="Run LLM study (needs API key)")
    args = ap.parse_args()

    os.chdir(PROJECT_ROOT)

    if args.agents_only:
        print("Running all agents...")
        run_agents()
        return
    if args.index_only:
        asyncio.run(index_docs())
        return

    print("1. Running report agents...")
    run_agents()
    print("2. Indexing project docs into RAG...")
    asyncio.run(index_docs())
    if args.llm:
        print("3. Running LLM study...")
        asyncio.run(run_llm_study())
    else:
        print("3. Skipping LLM (use --llm with GEMINI_API_KEY for real analysis).")


if __name__ == "__main__":
    main()
