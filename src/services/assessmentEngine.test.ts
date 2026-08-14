import {
  selectRandomizedQuestions,
  Question,
  DifficultyQuota
} from './assessmentEngine';

/**
 * UNIT TESTS FOR QUESTION RANDOMIZATION ALGORITHM
 */

// Helper to generate a mock question bank of size N
function createMockQuestionBank(totalCount: number = 50): Question[] {
  const bank: Question[] = [];

  for (let i = 1; i <= totalCount; i++) {
    let difficulty: Question['difficulty'] = 'EASY';
    if (i > 20 && i <= 40) difficulty = 'MEDIUM';
    if (i > 40) difficulty = 'HARD';

    bank.push({
      id: `q_${i}`,
      bankId: 'bank_101',
      text: `Mock Question Item ${i}`,
      type: 'MCQ',
      difficulty,
      points: 5.0,
      correctOptionId: `opt_${i}_a`
    });
  }

  return bank;
}

export function runAssessmentEngineUnitTests(): { passed: boolean; logs: string[] } {
  const logs: string[] = [];
  let passed = true;

  function log(msg: string) {
    logs.push(msg);
  }

  function assert(condition: boolean, testName: string) {
    if (condition) {
      log(`[PASS] ${testName}`);
    } else {
      passed = false;
      log(`[FAIL] ${testName}`);
    }
  }

  log('--- STARTING ASSESSMENT ENGINE UNIT TESTS ---');

  // Test 1: Exactly 20 questions selected out of 50
  try {
    const bank50 = createMockQuestionBank(50);
    const selected = selectRandomizedQuestions(bank50, 20);

    assert(selected.length === 20, 'Test 1: Selects exactly 20 questions out of 50');
    assert(
      new Set(selected.map((q) => q.id)).size === 20,
      'Test 1b: All selected questions are unique (no duplicates)'
    );
  } catch (err: any) {
    assert(false, `Test 1 Exception: ${err.message}`);
  }

  // Test 2: Difficulty Stratification Ratio (8 Easy, 8 Medium, 4 Hard)
  try {
    const bank50 = createMockQuestionBank(50); // Has 20 Easy, 20 Medium, 10 Hard
    const quota: DifficultyQuota = { EASY: 8, MEDIUM: 8, HARD: 4 };
    const selected = selectRandomizedQuestions(bank50, 20, quota);

    const easyCount = selected.filter((q) => q.difficulty === 'EASY').length;
    const mediumCount = selected.filter((q) => q.difficulty === 'MEDIUM').length;
    const hardCount = selected.filter((q) => q.difficulty === 'HARD').length;

    assert(
      easyCount === 8 && mediumCount === 8 && hardCount === 4,
      `Test 2: Stratified difficulty quota strictly matched (Easy: ${easyCount}/8, Med: ${mediumCount}/8, Hard: ${hardCount}/4)`
    );
  } catch (err: any) {
    assert(false, `Test 2 Exception: ${err.message}`);
  }

  // Test 3: Deficit Backfilling (When Hard questions pool has fewer items than requested quota)
  try {
    // Bank with only 2 Hard questions, but quota demands 5
    const bankCustom: Question[] = [
      ...createMockQuestionBank(30), // 20 Easy, 10 Medium
      {
        id: 'q_h1',
        bankId: 'b1',
        text: 'Hard 1',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 5
      },
      {
        id: 'q_h2',
        bankId: 'b1',
        text: 'Hard 2',
        type: 'MCQ',
        difficulty: 'HARD',
        points: 5
      }
    ];

    const quotaDeficit: DifficultyQuota = { EASY: 8, MEDIUM: 7, HARD: 5 };
    const selected = selectRandomizedQuestions(bankCustom, 20, quotaDeficit);

    assert(
      selected.length === 20,
      'Test 3: Total count equals 20 even when one difficulty pool has a deficit'
    );
  } catch (err: any) {
    assert(false, `Test 3 Exception: ${err.message}`);
  }

  // Test 4: Insufficient Bank Exception
  try {
    const bankSmall = createMockQuestionBank(10);
    let threwError = false;

    try {
      selectRandomizedQuestions(bankSmall, 20);
    } catch {
      threwError = true;
    }

    assert(
      threwError,
      'Test 4: Throws error when question bank size (10) is less than target count (20)'
    );
  } catch (err: any) {
    assert(false, `Test 4 Exception: ${err.message}`);
  }

  log('--- COMPLETED ASSESSMENT ENGINE UNIT TESTS ---');
  return { passed, logs };
}
