export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-oral-examination-authenticity-platform",
  title: "Oral Examination & Authenticity Platform",
  tagline: "Adaptive oral exams verifying genuine understanding",
  accent: "yellow",
};

export const pages: PageConfig[] = [
  {
    label: "Exams",
    href: "/exams",
    description: "Sessions, questions, responses.",
    entities: ["ExamSession", "Question", "VerbalResponse", "ExamBlueprint"],
    workflows: ["question-adapt"],
  },
  {
    label: "Authenticity",
    href: "/authenticity",
    description: "Findings, submissions, inconsistencies.",
    entities: ["AuthenticityFinding", "SubmissionRecord", "InconsistencyFlag"],
    workflows: ["authenticity-audit"],
  },
  {
    label: "Results",
    href: "/results",
    description: "Score reports, appeals, proctor notes.",
    entities: ["ScoreReport", "Appeal", "ProctorNote"],
    workflows: [],
  },
  {
    label: "Programs",
    href: "/programs",
    description: "Institutions and examinees.",
    entities: ["InstitutionProgram", "Examinee"],
    workflows: [],
  },
];

export const entities: Record<string, EntityConfig> = {
  Examinee: {
    name: "Examinee",
    label: "Examinee",
    fields: [{ name: "name", kind: "string" }, { name: "email", kind: "string" }, { name: "program", kind: "string" }, { name: "institution", kind: "string" }, { name: "status", kind: "string" }, { name: "registeredAt", kind: "date" }],
  },
  ExamSession: {
    name: "ExamSession",
    label: "Exam Session",
    fields: [{ name: "subject", kind: "string" }, { name: "examiner", kind: "string" }, { name: "status", kind: "string" }, { name: "scheduledAt", kind: "date" }, { name: "durationMinutes", kind: "number" }, { name: "authenticityScore", kind: "number" }],
  },
  Question: {
    name: "Question",
    label: "Question",
    fields: [{ name: "body", kind: "string" }, { name: "topic", kind: "string" }, { name: "difficulty", kind: "string" }, { name: "probingDepth", kind: "string" }, { name: "status", kind: "string" }, { name: "askedAt", kind: "date" }],
  },
  VerbalResponse: {
    name: "VerbalResponse",
    label: "Verbal Response",
    fields: [{ name: "questionRef", kind: "string" }, { name: "transcript", kind: "string" }, { name: "score", kind: "number" }, { name: "confidence", kind: "string" }, { name: "status", kind: "string" }, { name: "latencySeconds", kind: "number" }],
  },
  AuthenticityFinding: {
    name: "AuthenticityFinding",
    label: "Authenticity Finding",
    fields: [{ name: "kind", kind: "string" }, { name: "evidence", kind: "string" }, { name: "severity", kind: "string" }, { name: "status", kind: "string" }, { name: "submissionRef", kind: "string" }, { name: "raisedAt", kind: "date" }],
  },
  SubmissionRecord: {
    name: "SubmissionRecord",
    label: "Submission",
    fields: [{ name: "title", kind: "string" }, { name: "kind", kind: "string" }, { name: "storageRef", kind: "string" }, { name: "authoredClaim", kind: "string" }, { name: "status", kind: "string" }, { name: "submittedAt", kind: "date" }],
  },
  InconsistencyFlag: {
    name: "InconsistencyFlag",
    label: "Inconsistency",
    fields: [{ name: "submissionRef", kind: "string" }, { name: "verbalClaim", kind: "string" }, { name: "writtenClaim", kind: "string" }, { name: "severity", kind: "string" }, { name: "status", kind: "string" }, { name: "detail", kind: "string" }],
  },
  ProctorNote: {
    name: "ProctorNote",
    label: "Proctor Note",
    fields: [{ name: "proctor", kind: "string" }, { name: "observation", kind: "string" }, { name: "sessionRef", kind: "string" }, { name: "status", kind: "string" }, { name: "loggedAt", kind: "date" }, { name: "action", kind: "string" }],
  },
  ScoreReport: {
    name: "ScoreReport",
    label: "Score Report",
    fields: [{ name: "sessionRef", kind: "string" }, { name: "overallScore", kind: "number" }, { name: "authenticityScore", kind: "number" }, { name: "grade", kind: "string" }, { name: "status", kind: "string" }, { name: "publishedAt", kind: "date" }],
  },
  Appeal: {
    name: "Appeal",
    label: "Appeal",
    fields: [{ name: "ground", kind: "string" }, { name: "explanation", kind: "string" }, { name: "status", kind: "string" }, { name: "filedAt", kind: "date" }, { name: "outcome", kind: "string" }, { name: "reviewedBy", kind: "string" }],
  },
  ExamBlueprint: {
    name: "ExamBlueprint",
    label: "Exam Blueprint",
    fields: [{ name: "subject", kind: "string" }, { name: "topics", kind: "string" }, { name: "difficultyMix", kind: "string" }, { name: "passMark", kind: "string" }, { name: "status", kind: "string" }, { name: "questionCount", kind: "number" }],
  },
  InstitutionProgram: {
    name: "InstitutionProgram",
    label: "Program",
    fields: [{ name: "institution", kind: "string" }, { name: "program", kind: "string" }, { name: "modality", kind: "string" }, { name: "examPolicy", kind: "string" }, { name: "status", kind: "string" }, { name: "contact", kind: "string" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "question-adapt",
    title: "Adaptive Question Selector",
    description: "Choose the next oral exam question.",
    prompt: "You are an oral examiner. Given the answer history, pick the next adaptive question to maximize discrimination of genuine understanding.",
    fields: ["subject", "answersSummary", "currentDifficulty", "blueprint"],
  },
  {
    slug: "authenticity-audit",
    title: "Authenticity Auditor",
    description: "Compare written submission to verbal performance.",
    prompt: "You are an academic integrity officer. Compare the written submission claims to verbal responses; score the likelihood the candidate authored the work.",
    fields: ["submissionClaims", "verbalResponses", "latencyPatterns", "topicGaps"],
  },
  {
    slug: "score-justify",
    title: "Score Justifier",
    description: "Write the defensible score rationale.",
    prompt: "You are a chief examiner. Write a defensible rationale for the final score and authenticity finding, citing the evidence trail.",
    fields: ["scores", "findings", "blueprint", "appealRisk"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}
