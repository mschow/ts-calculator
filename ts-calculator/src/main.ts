import './style.css'
import { Operations } from './operations.enum'
import { CalculatorDom } from './calculator-dom.model';

let calculatorDOM: CalculatorDom = {
  buttonContainer: <HTMLElement> document.getElementById('calc-buttons'),
  currentOperand: <HTMLElement> document.querySelector('.current-operand'),
  previousOperand: <HTMLElement> document.querySelector('.previous-operand'),
}

function initializeCalculator(): void{
  assignEventListeners();
}

function assignEventListeners(): void{
  calculatorDOM.buttonContainer?.addEventListener('click', (event)=>{
    const element: HTMLElement = <HTMLElement> event.target;
    switch(<Operations> element.dataset['operation']){
      case Operations.ADD:
        calcAdd(element.innerText);
        break;
      case Operations.SUBTRACT:
        calcSubtract(element.innerText);
        break;
      case Operations.MULTIPLY:
        calcMultiply(element.innerText);
        break;
      case Operations.DIVIDE:
        calcDivide(element.innerText);
        break;
      case Operations.CLEAR:
        calcClear();
        break;
      case Operations.DELETE:
        calcDelete();
        break;
      case Operations.APPEND_NUMBER:
        calcAppend(element.innerText);
        break;
    }
  })
}

function calcAdd(value: string): void {}

function calcSubtract(value: string): void {}

function calcMultiply(value: string): void {}

function calcDivide(value: string): void {}

function calcClear(): void {}

function calcDelete(): void {}

function calcAppend(value: string): void {
  assignCurrentOperand(value);
}

function getNumberFromCurrentOperand():number{
  return parseInt(calculatorDOM.currentOperand.innerText);
}

function assignCurrentOperand(value: string): void{
  calculatorDOM.currentOperand.innerText = value;
};

function setCurrentOperandToPrevious(endingCharacter: '+' | '-' | '%' | '*' | '' = ''): void {
  // const currentOperandElem:HTMLElement = <HTMLElement> document.querySelector('.current-operand');
  // const previousOperand
}

initializeCalculator();