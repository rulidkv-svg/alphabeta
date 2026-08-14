/**
 * Enterprise LMS - Assessment & Prerequisite Eligibility Engine
 * EdTech Core Business Logic with Stratified Question Sampling & Auto-Grading
 */

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean; // Stripped before sending to learner
}

export interface Question {
  id: string;
  bankId: string;
  text: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  options?: QuestionOption[];
  correctOptionId?: string; // For MCQ & True/False
  points: number;
  explanation?: string;
}

export interface DifficultyQuota {
  EASY: number;   // e.g., 8 questions (40%)
  MEDIUM: number; // e.g., 8 questions (40%)
  HARD: number;   // e.g., 4 questions (20%)
}

export interface ModulePrerequisite {
  moduleId: string;
  prerequisiteModuleId: string;
  prerequisiteTitle: string;
}

export interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
}

export interface QuizResult {
  quizId: string;
  isPassed: boolean;
  scorePercentage: number;
}

export interface AssignmentResult {
  assignmentId: string;
  status: 'graded' | 'pending' | 'not_submitted';
  scorePercentage?: number;
}

export interface DatabaseContext {
  getPrerequisites(targetModuleId: string): Promise<ModulePrerequisite[]>;
  getModuleLessons(moduleId: string): Promise<{ id: string }[]>;
  getStudentLessonProgress(userId: string, lessonIds: string[]): Promise<LessonProgress[]>;
  getStudentQuizResults(userId: string, moduleId: string): Promise<QuizResult[]>;
  getStudentAssignmentResults(userId: string, moduleId: string): Promise<AssignmentResult[]>;
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  missingPrerequisites: {
    moduleId: string;
    moduleTitle: string;
    incompleteLessonsCount: number;
    unpassedQuizzesCount: number;
    pendingAssignmentsCount: number;
  }[];
}

export interface UserResponse {
  questionId: string;
  selectedOptionId?: string;
  shortAnswerText?: string;
}

export interface QuestionGradeDetail {
  questionId: string;
  questionType: QuestionType;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
  explanation?: string;
  requiresManualGrading: boolean;
}

export interface QuizGradingResult {
  totalEarnedPoints: number;
  totalMaxPoints: number;
  scorePercentage: number;
  isPassed: boolean;
  requiresManualGrading: boolean;
  details: QuestionGradeDetail[];
}

// =============================================================================
// 1. QUESTION RANDOMIZATION ALGORITHM (Fisher-Yates + Stratified Sampling)
// =============================================================================

/**
 * Perform an unbiased in-place Fisher-Yates (Knuth) Shuffle on an array.
 * Time Complexity: O(N)
 * Space Complexity: O(1)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Selects a randomized, stratified subset of questions from a question bank.
 * Guarantees fair representation across difficulty levels (EASY, MEDIUM, HARD).
 * Automatically handles pool deficits by backfilling from remaining available questions.
 *
 * @param questionBank Pool of available questions (e.g. 50 items)
 * @param targetCount Total number of questions required for quiz (e.g. 20)
 * @param quotaTarget Desired breakdown per difficulty level (default: 40% Easy, 40% Medium, 20% Hard)
 */
export function selectRandomizedQuestions(
  questionBank: Question[],
  targetCount: number = 20,
  quotaTarget: DifficultyQuota = { EASY: 8, MEDIUM: 8, HARD: 4 }
): Question[] {
  if (!questionBank || questionBank.length === 0) {
    throw new Error('Question bank cannot be empty.');
  }

  if (questionBank.length < targetCount) {
    throw new Error(
      `Question bank size (${questionBank.length}) is insufficient for requested count (${targetCount}).`
    );
  }

  // Group questions by difficulty
  const grouped: Record<DifficultyLevel, Question[]> = {
    EASY: [],
    MEDIUM: [],
    HARD: []
  };

  questionBank.forEach((q) => {
    if (grouped[q.difficulty]) {
      grouped[q.difficulty].push(q);
    } else {
      grouped['MEDIUM'].push(q); // Fallback for unclassified difficulty
    }
  });

  // Shuffle each difficulty pool independently
  const shuffledPools: Record<DifficultyLevel, Question[]> = {
    EASY: shuffleArray(grouped.EASY),
    MEDIUM: shuffleArray(grouped.MEDIUM),
    HARD: shuffleArray(grouped.HARD)
  };

  const selectedQuestions: Question[] = [];
  const remainingPool: Question[] = [];

  // Step 1: Draw up to requested quota from each difficulty pool
  (Object.keys(quotaTarget) as DifficultyLevel[]).forEach((diff) => {
    const pool = shuffledPools[diff];
    const quota = quotaTarget[diff];

    const taken = pool.slice(0, quota);
    const leftOver = pool.slice(quota);

    selectedQuestions.push(...taken);
    remainingPool.push(...leftOver);
  });

  // Step 2: Backfill if any pool had fewer questions than its requested quota
  const deficit = targetCount - selectedQuestions.length;
  if (deficit > 0) {
    const shuffledRemaining = shuffleArray(remainingPool);
    const backfill = shuffledRemaining.slice(0, deficit);
    selectedQuestions.push(...backfill);
  }

  // Step 3: Final shuffle so questions are not grouped by difficulty in the test paper
  return shuffleArray(selectedQuestions.slice(0, targetCount));
}

// =============================================================================
// 2. PREREQUISITE CHECK ALGORITHM
// =============================================================================

/**
 * Verifies if a learner is eligible to access a module.
 * Requires 100% completion rate (read receipts) and passing grades on all prerequisite modules.
 *
 * @param userId Learner's UUID
 * @param targetModuleId Module the learner is attempting to access
 * @param db Data Access Abstraction Layer
 */
export async function checkModuleEligibility(
  userId: string,
  targetModuleId: string,
  db: DatabaseContext
): Promise<EligibilityResult> {
  const prerequisites = await db.getPrerequisites(targetModuleId);

  // If module has no prerequisites, user is immediately eligible
  if (!prerequisites || prerequisites.length === 0) {
    return { eligible: true, missingPrerequisites: [] };
  }

  const missingPrerequisites: EligibilityResult['missingPrerequisites'] = [];

  for (const prereq of prerequisites) {
    const preModuleId = prereq.prerequisiteModuleId;

    // 1. Verify Lesson Read-Receipt Completion (100% required)
    const lessons = await db.getModuleLessons(preModuleId);
    const lessonIds = lessons.map((l) => l.id);
    const lessonProgressList = await db.getStudentLessonProgress(userId, lessonIds);

    const completedLessonIds = new Set(
      lessonProgressList.filter((lp) => lp.isCompleted).map((lp) => lp.lessonId)
    );
    const incompleteLessonsCount = lessonIds.filter((id) => !completedLessonIds.has(id)).length;

    // 2. Verify Quizzes Passing Status
    const quizResults = await db.getStudentQuizResults(userId, preModuleId);
    const unpassedQuizzesCount = quizResults.filter((q) => !q.isPassed).length;

    // 3. Verify Assignments Graded Status
    const assignmentResults = await db.getStudentAssignmentResults(userId, preModuleId);
    const pendingAssignmentsCount = assignmentResults.filter(
      (a) => a.status !== 'graded' || (a.scorePercentage !== undefined && a.scorePercentage < 70)
    ).length;

    if (incompleteLessonsCount > 0 || unpassedQuizzesCount > 0 || pendingAssignmentsCount > 0) {
      missingPrerequisites.push({
        moduleId: preModuleId,
        moduleTitle: prereq.prerequisiteTitle || `Module ${preModuleId}`,
        incompleteLessonsCount,
        unpassedQuizzesCount,
        pendingAssignmentsCount
      });
    }
  }

  const eligible = missingPrerequisites.length === 0;

  return {
    eligible,
    reason: eligible
      ? 'Learner meets all prerequisite criteria.'
      : 'Access restricted: Prerequisite modules incomplete or unpassed.',
    missingPrerequisites
  };
}

// =============================================================================
// 3. AUTO-GRADING ENGINE ALGORITHM
// =============================================================================

/**
 * Auto-grades user responses against question master key.
 * Evaluates MCQ and True/False deterministically.
 * Flags Short Answer questions for manual instructor evaluation.
 *
 * @param userResponses Learner's answer payload
 * @param questionMasterKey Map of Question objects with correct answers
 * @param passingThresholdScore Default passing score percentage (70%)
 */
export function gradeQuizAttempt(
  userResponses: UserResponse[],
  questionMasterKey: Map<string, Question>,
  passingThresholdScore: number = 70.0
): QuizGradingResult {
  let totalEarnedPoints = 0;
  let totalMaxPoints = 0;
  let requiresManualGrading = false;

  const responseMap = new Map<string, UserResponse>();
  userResponses.forEach((r) => responseMap.set(r.questionId, r));

  const details: QuestionGradeDetail[] = [];

  questionMasterKey.forEach((question, questionId) => {
    const maxPoints = question.points || 1.0;
    totalMaxPoints += maxPoints;

    const userResp = responseMap.get(questionId);

    // Case 1: Short Answer Question (Requires Instructor Manual Evaluation)
    if (question.type === 'SHORT_ANSWER') {
      requiresManualGrading = true;
      details.push({
        questionId,
        questionType: 'SHORT_ANSWER',
        isCorrect: false,
        pointsEarned: 0,
        maxPoints,
        explanation: question.explanation || 'Requires instructor review.',
        requiresManualGrading: true
      });
      return;
    }

    // Case 2: MCQ or True/False Deterministic Auto-Grading
    let isCorrect = false;

    if (userResp && userResp.selectedOptionId && question.correctOptionId) {
      isCorrect = userResp.selectedOptionId === question.correctOptionId;
    }

    const pointsEarned = isCorrect ? maxPoints : 0;
    totalEarnedPoints += pointsEarned;

    details.push({
      questionId,
      questionType: question.type,
      isCorrect,
      pointsEarned,
      maxPoints,
      explanation: question.explanation,
      requiresManualGrading: false
    });
  });

  const scorePercentage =
    totalMaxPoints > 0 ? Number(((totalEarnedPoints / totalMaxPoints) * 100).toFixed(2)) : 0;

  const isPassed = !requiresManualGrading && scorePercentage >= passingThresholdScore;

  return {
    totalEarnedPoints,
    totalMaxPoints,
    scorePercentage,
    isPassed,
    requiresManualGrading,
    details
  };
}
