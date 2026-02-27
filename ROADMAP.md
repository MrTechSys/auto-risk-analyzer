# Auto Risk Analyzer Roadmap

I want to refine the plan to match the full vision of the Auto Risk Analyzer. This is a cinematic, premium, AI-assisted insurance analysis tool with document ingestion, OCR extraction, coverage normalization, and automated gap analysis.

## Phase 1: Architecture & Data Modeling
- Use Zustand for global wizard state (more scalable than React Context).
- Define TypeScript models for: Policy, CoverageSet, Limits, Deductibles, Endorsements, Exclusions, Vehicle, StateRules, and RiskReport.
- Build a modular Risk Engine that compares extracted coverages against recommended baseline standards (liability, PD, UM/UIM, PIP/MedPay, collision, comprehensive, rental, roadside). Include placeholders for state-specific logic.
- Create an Ingestion Pipeline interface for future OCR/AI extraction.

## Phase 2: UI Implementation (Cinematic Wizard)
- Build a parallax, full-screen, step-by-step wizard with deep black backgrounds, metallic shiny gold accents, and crisp white text.
- Each step is a full-screen section with smooth transitions and a persistent bottom-right “Back to Top” widget.
- Steps:
  1. Upload or manually enter policy data.
  2. Extracted coverages review (AI/OCR placeholder).
  3. Vehicle and driver details.
  4. Coverage confirmation and adjustments.
  5. Automated gap analysis results with clear risk indicators.

## Phase 3: Analysis & Reporting
- Implement the Risk Engine logic with clear scoring, gap detection, and recommendations.
- Generate a user-friendly, visually rich risk report with gold-highlighted warnings and safe/unsafe indicators.

## Phase 4: Refinement & UX Polish
- Apply the MrTechSys design language across all components.
- Add validation, animations, and smooth parallax motion.
- Prepare the architecture for future AI integration (OCR, LLM-based extraction, recommendation tuning).
