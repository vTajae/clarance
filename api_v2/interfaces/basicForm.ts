type QuestionType = 'text' | 'number' | 'select';

interface FormSection {
  id: string;
  questions: Question[];
}

interface Question {
  id: string;
  type: QuestionType;
  label: string;
  options?: Array<string>;
  condition?: Condition | null;
}

interface Condition {
  questionId: string;
  operator: ConditionOperator;
  value: string | number;
}

type ConditionOperator = 'equals' | 'greaterThan' | 'lessThan';

interface FormConfig {
  formSections: FormSection[];
}

// Enhance with a specific type for form answers, assuming a flat structure for simplicity
interface FormAnswers {
  [key: string]: string | number;
}

export default { FormConfig, FormAnswer }