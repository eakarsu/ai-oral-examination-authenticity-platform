// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const database = new URL(process.env.DATABASE_URL || "").pathname.slice(1);
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true" || !/^(demo_|inspection_test_)/.test(database)) throw new Error("Demo seeding requires ALLOW_DEMO_SEED=true and a dedicated demo_ or inspection_test_ database");
  if (!process.env.DEMO_PASSWORD || process.env.DEMO_PASSWORD.length < 16) throw new Error("Set DEMO_PASSWORD to at least 16 characters");
  const passwordHash = await bcrypt.hash(process.env.DEMO_PASSWORD!, 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-oral-examination-authenticity-platform.local", "Demo Admin", "ADMIN"],
    ["manager@ai-oral-examination-authenticity-platform.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-oral-examination-authenticity-platform.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_Examinee = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.examinee.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.examinee.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      email: `contact${i}@example.com`,
      program: `Program ${String(i + 1).padStart(3, "0")}`,
      institution: `Institution ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Examinee, i),
      registeredAt: daysAgo(i)
      },
    });
  }

  const examineeRefs = await prisma.examinee.findMany({ select: { id: true } });

  const STATUSES_ExamSession = ["SCHEDULED", "LIVE", "SCORED", "FLAGGED"];
  await prisma.examSession.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.examSession.create({
      data: {
      subject: `Subject ${String(i + 1).padStart(3, "0")}`,
      examiner: `Examiner ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ExamSession, i),
      scheduledAt: daysAgo(i),
      durationMinutes: 5 + ((i * 13) % 95),
      authenticityScore: amount(i, 250),
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  const STATUSES_Question = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.question.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.question.create({
      data: {
      body: `Body ${String(i + 1).padStart(3, "0")}`,
      topic: `Topic ${String(i + 1).padStart(3, "0")}`,
      difficulty: `Difficulty ${String(i + 1).padStart(3, "0")}`,
      probingDepth: `ProbingDepth ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Question, i),
      askedAt: daysAgo(i),
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  const STATUSES_VerbalResponse = ["UNSCORED", "SCORED", "DISPUTED"];
  await prisma.verbalResponse.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.verbalResponse.create({
      data: {
      questionRef: `QuestionRef ${String(i + 1).padStart(3, "0")}`,
      transcript: `Transcript ${String(i + 1).padStart(3, "0")}`,
      score: amount(i, 250),
      confidence: `Confidence ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_VerbalResponse, i),
      latencySeconds: 5 + ((i * 13) % 95),
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  const STATUSES_AuthenticityFinding = ["OPEN", "REVIEWED", "CLEARED", "VIOLATION"];
  await prisma.authenticityFinding.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.authenticityFinding.create({
      data: {
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      evidence: `Evidence ${String(i + 1).padStart(3, "0")}`,
      severity: `Severity ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_AuthenticityFinding, i),
      submissionRef: `SubmissionRef ${String(i + 1).padStart(3, "0")}`,
      raisedAt: daysAgo(i),
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  const STATUSES_SubmissionRecord = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.submissionRecord.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.submissionRecord.create({
      data: {
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      storageRef: `StorageRef ${String(i + 1).padStart(3, "0")}`,
      authoredClaim: `AuthoredClaim ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_SubmissionRecord, i),
      submittedAt: daysAgo(i),
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  const STATUSES_InconsistencyFlag = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.inconsistencyFlag.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.inconsistencyFlag.create({
      data: {
      submissionRef: `SubmissionRef ${String(i + 1).padStart(3, "0")}`,
      verbalClaim: `VerbalClaim ${String(i + 1).padStart(3, "0")}`,
      writtenClaim: `WrittenClaim ${String(i + 1).padStart(3, "0")}`,
      severity: `Severity ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_InconsistencyFlag, i),
      detail: `Detail ${String(i + 1).padStart(3, "0")}`,
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  const STATUSES_ProctorNote = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.proctorNote.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.proctorNote.create({
      data: {
      proctor: `Proctor ${String(i + 1).padStart(3, "0")}`,
      observation: `Observation ${String(i + 1).padStart(3, "0")}`,
      sessionRef: `SessionRef ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ProctorNote, i),
      loggedAt: daysAgo(i),
      action: `Action ${String(i + 1).padStart(3, "0")}`,
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  const STATUSES_ScoreReport = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.scoreReport.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.scoreReport.create({
      data: {
      sessionRef: `SessionRef ${String(i + 1).padStart(3, "0")}`,
      overallScore: amount(i, 250),
      authenticityScore: amount(i, 250),
      grade: `Grade ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ScoreReport, i),
      publishedAt: daysAgo(i),
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  const STATUSES_Appeal = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.appeal.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.appeal.create({
      data: {
      ground: `Ground ${String(i + 1).padStart(3, "0")}`,
      explanation: `Explanation ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Appeal, i),
      filedAt: daysAgo(i),
      outcome: `Outcome ${String(i + 1).padStart(3, "0")}`,
      reviewedBy: `ReviewedBy ${String(i + 1).padStart(3, "0")}`,
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  const STATUSES_ExamBlueprint = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.examBlueprint.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.examBlueprint.create({
      data: {
      subject: `Subject ${String(i + 1).padStart(3, "0")}`,
      topics: `Topics ${String(i + 1).padStart(3, "0")}`,
      difficultyMix: `DifficultyMix ${String(i + 1).padStart(3, "0")}`,
      passMark: `PassMark ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ExamBlueprint, i),
      questionCount: 5 + ((i * 13) % 95),
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  const STATUSES_InstitutionProgram = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.institutionProgram.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.institutionProgram.create({
      data: {
      institution: `Institution ${String(i + 1).padStart(3, "0")}`,
      program: `Program ${String(i + 1).padStart(3, "0")}`,
      modality: `Modality ${String(i + 1).padStart(3, "0")}`,
      examPolicy: `ExamPolicy ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_InstitutionProgram, i),
      contact: `Contact ${String(i + 1).padStart(3, "0")}`,
      examinee: { connect: { id: examineeRefs[i % examineeRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
