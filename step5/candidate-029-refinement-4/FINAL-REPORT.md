# 1. Executive Summary
This report documents a controlled experiment measuring the output consistency and refinement potential of **Gemini Code Assist** when tasked with generating a vanilla web-based slot machine.  

Over 50 baseline runs and 4 subsequent refinement rounds, our team observed significant fluctuations in UI/UX reliability, token consumption, and feature density.  

Our final candidate (**029**) represents a high-performing outlier that emerged through structured refinement, while our runner-up (**027**) demonstrated the *brittleness* of AI generation in late-stage development.

---

# 2. Experimental Setup

- **Model:** Gemini Code Assist (Standardized Version)  
- **Harness:** Gemini CLI / Clean Session Protocol  
- **Sample Size:** 50 Baseline Runs (Step 1)  
- **Refinement Strategy:** Single-turn, one-shot prompts (<200 words)

---

# 3. Data Analysis & Key Findings

## 3.1 Token Variability and API Interaction

We observed that token counts were highly non-deterministic despite identical inputs.



- **The API Factor:**  
  We noted a significant spike in both input and output tokens when the model attempted to call or integrate third-party APIs for styling or assets.  

  This suggests that as complexity increases, the *instruction overhead* for the AI scales non-linearly.

---

## 3.2 Model "Personality" and Coding Style

Gemini CLI demonstrated a highly consistent, albeit rigid, architectural style:

- **Structure:**  
  Extremely clean and well-formatted boilerplate.

- **Documentation:**  
  Paradoxically, while the code was syntactically clean, it was **poorly commented**.  
  The model prioritized structural layout over explanatory documentation, increasing cognitive load for human reviewers.

---

# 4. Candidate Evolution (The Final Two)

## Candidate 027: The "Audio" Specialist

- **Strengths:**  
  One of the few candidates to successfully integrate **Sound Effects (SFX)** without manual intervention.

- **The Failure:**  
  Eliminated in the final refinement round due to a **critical UI regression**.  

  Despite having superior features, a late-stage generation pushed the main UI buttons almost entirely off-screen, rendering the app unusable.  

  This highlights the *“rookie mistake” risk*—where an AI improves one feature while breaking a previously stable component.

---

## Candidate 029: The Winner

- **Strengths:**  
  - Creative dual-currency system (**Tokens vs. research funding**)  
  - Smooth money-earning animation  
  - Added “game feel” beyond the original prompt  

- **Outcome:**  
  Selected as the final candidate due to its **stability** and **superior UX polish** compared to the erratic drift seen in Candidate 027.

---

# 5. Conclusions & Learning Goals

- **Consistency:**  
  AI output is not a commodity; it is a **probability distribution**.  
  Running the same prompt 50 times demonstrates that quality is an *outlier*, not the mean.

- **The Ceiling:**  
  Simple prompting reaches a limit quickly. Refinement rounds often trade one bug for another  
  *(e.g., gaining SFX but losing UI alignment).*

- **Honest Appraisal:**  
  These tools should be viewed as **accelerators, not replacements**.  
  They are highly effective for generating many prototypes quickly, but require a human *editor-in-chief* to ensure quality.

---

# 6. Final Recommendation

The team recommends **Candidate 029** for final submission.  

It represents the best balance of the experiment’s goals:
- Functional code  
- Creative interpretation  
- Successful one-shot refinement  