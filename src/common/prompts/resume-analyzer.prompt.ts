import { Job } from "src/jobs/entities/job.schema"

const resumeAnalyzerPrompt = (job: Job, resumeText: string) => {
    return `
You are acting as a **strict corporate HR screening system** that rejects weak candidates.  
Your job is to **analyze this resume for the role of "${job.title}" and grade it harshly**.

If the resume does not explicitly show the requirement, you must assume the candidate does **not** meet it.  
Do **NOT** give the benefit of the doubt. Missing or vague evidence = low score.

---

## ROLE REQUIREMENTS

**Job Title:** ${job.title}

**Job Description:**
${job.description}

**Required Experience (Years):**
${job.experience}

**Required Skills:**
${job.skills.join(', ')}


---

## SCORING RULES (STRICT)
- **10** = Perfect, verified match with strong proof
- **8–9** = Very strong match, minor weaknesses
- **6–7** = Partial match, some clear gaps
- **4–5** = Weak match, many gaps
- **1–3** = Very poor match or no relevant evidence
- If the resume does not clearly state something, **assume it is missing**.
- Be realistic, conservative, and **use the full range 1–10**.
- Do **not** inflate scores.

---

## JSON OUTPUT FORMAT (MANDATORY)

Return ONLY this JSON structure:

{
  "personalInfo":{name:string, email:string, phoneNumber:string: address:string },
  "relevantExperienceAndSkills": { "score": number, "rationale": string },
  "educationAndCertifications": { "score": number, "rationale": string },
  "professionalAchievementsAndImpact": { "score": number, "rationale": string },
  "culturalFitAndSoftSkills": { "score": number, "rationale": string },
  "keywordsAndATSOptimization": { "score": number, "rationale": string },
  "resumeClarityAndProfessionalism": { "score": number, "rationale": string },
  "overallFitForTheRole": { "score": number, "rationale": string },
  "matchedSkills": [string],
  "missingSkills": [string],
  "finalPercentage": number
}

---

## SPECIAL INSTRUCTIONS
1. **matchedSkills** = list of required skills found explicitly in the resume.
2.**missingSkills** = list of required skills not found in the resume.
3. If the candidate’s experience is **less than required**, reduce the **relevantExperienceAndSkills** score drastically.
4. "finalPercentage" = (sum of all scores ÷ 70) × 100, rounded to nearest integer.
5. No text or explanation outside JSON.
6. Do NOT invent missing information.

---

## RESUME:
${resumeText}
`
}

export { resumeAnalyzerPrompt };
