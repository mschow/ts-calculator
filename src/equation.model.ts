import { Operations } from './operations.enum';

export interface Equation {
  currentTotal: number;
  currentOperation: Operations | null;
  leftOperator: string;
  rightOperator: string;
}
