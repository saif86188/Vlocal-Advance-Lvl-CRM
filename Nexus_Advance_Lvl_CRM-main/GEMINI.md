# [NEXUS APEX v4.0] AI System Memory & Orchestrator Instruction

> **AI INSTRUCTION:** This file is the `00_CORE` initialization memory for this workspace. You are operating within the **NEXUS APEX v4.0** framework. You must strictly adhere to this exact operational loop for every prompt you receive. 

## THE ENGINE LOOP (Mandatory Operational Procedure)

When the user gives you a prompt, do **NOT** immediately start writing code or guessing the solution. You must execute the following 3-step loop:

### Step 1: Analyze Intent (Short Analysis)
- Read the user's prompt.
- Identify the target domains (e.g., UI, Database, Deployment, Security).
- Output a very brief (1-2 sentence) analysis acknowledging the intent.

### Step 2: Select Engine & Resource (Memory Retrieval)
- Based on your analysis, map the intent to the corresponding Engine Layer from the **Engine Routing Matrix** below.
- You **MUST** read the specific `NEXUS_v4_APEX/[ENGINE_NAME]/SKILL.md` file using your file reading tools. 
- You **MUST** also read the `NEXUS_v4_APEX/ENGINE_CHEATSHEET.md` and `NEXUS_v4_APEX/CONVENTIONS.md` if making structural changes.
- Do not proceed until you have ingested the L1/L2 instructions from those specific engine files.

### Step 3: Execute & Output Contract
- Execute the task strictly following the rules discovered in Step 2.
- Adhere to the "Contract-First Rule": Do not hand-wave. Ensure all code and structural changes output typed, schema-validated artifacts as required by the framework.
- Always apply the `0A_ANTISLOP` (Quality/Security guardrails) before finalizing your output.

---

## ENGINE ROUTING MATRIX (Source Selection)

*Use this matrix to dynamically select which files/resources to read before executing.*

### META & INTELLIGENCE (Always Active / Routing)
* `00_CORE`: Routing, contract validation, verify-work UAT.
* `0A_ANTISLOP`: Guardrails, hard-blocks, reviewer rules.
* `0H_HERMES`: Proposal approval, audit tracking.
* `01_FORGE`: Architecture, PRD/AC artifacts.
* `02_INSIGHT`: Analytics, telemetry, A/B testing.

### DESIGN SYSTEM & INTERFACE (UX/UI Tasks)
* `03_PALETTE`: OKLCH palettes, theming, elevation, data-viz colors.
* `04_TYPE`: Typography, modular scale, fluid type, readability.
* `05_MOTION`: View Transitions, choreography, reduced motion.
* `06_LAYOUT`: Responsive layout zones (svh/lvh/dvh/cqw), structural grid.
* `07_COMPONENTS`: Component anatomy, state trees, loading/error states.
* `08_A11Y`: WCAG 2.2, ARIA patterns, keyboard focus.

### ENGINE IMPLEMENTATION (Code / Backend / Logic)
* `09_BUILD`: Next.js 15 App Router/RSC, monorepo guidance.
* `10_API`: REST/GraphQL/tRPC, versioning, auth patterns.
* `11_DATA`: Schema design, N+1 mitigation, ORMs.
* `12_SYNC`: Realtime, WebSockets, offline queues, background jobs.
* `13_AI`: RAG, tool contracts, cost routing.
* `14_EVAL`: LLM-as-judge, regression tracking.

### HARDENING & DELIVERY (DevOps / Sec / Prod)
* `15_SECURE`: 11-layer security model, CSP, encryption.
* `16_PERFORM`: CWV (LCP/INP/CLS), caching layers, edge, bundle budgets.
* `17_GOVERN`: Compliance-as-code, linting.
* `18_TEST`: Testing trophy, visual regression, E2E.
* `19_SHIP`: CI/CD, canary, IaC, secrets.
* `20_OBSERVE`: OTel, incident loops.
* `21_SEO` & `22_GEO`: Search indexing, crawler strategy, localization.

## CRITICAL RULES:
1. **Never bypass the matrix.** If you need to build a UI component, read `07_COMPONENTS/SKILL.md` first. If you need to add an API route, read `10_API/SKILL.md` first.
2. **Progressive Disclosure:** Stick to the L1 (core rules) and L2 (standard operating instructions) of the specific engines. Only dive into L3 (examples/templates) if explicitly requested or needed.
3. **No Cross-Engine Internal References:** Do not mix up the rules. Engines only interact via contracts.

*(END OF INITIALIZATION MEMORY - System Ready)*