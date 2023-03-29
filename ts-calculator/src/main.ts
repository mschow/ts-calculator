import './style.css'
import { Operations } from './operations.enum'
import { CalculatorDom } from './calculator-dom.model';

export class Main {
  private readonly calculatorDOM: CalculatorDom = {
    buttonContainer: <HTMLElement> document.getElementById('calc-buttons'),
    currentOperand: <HTMLElement> document.querySelector('.current-operand'),
    previousOperand: <HTMLElement> document.querySelector('.previous-operand'),
  }

  constructor(){
    this.assignEventListeners();
  }

  private assignEventListeners(): void{
    this.calculatorDOM.buttonContainer?.addEventListener('click', (event)=>{
      const element: HTMLElement = <HTMLElement> event.target;
      switch(<Operations> element.dataset['operation']){
        case Operations.ADD:
          this.calcAdd(element.innerText);
          break;
        case Operations.SUBTRACT:
          this.calcSubtract(element.innerText);
          break;
        case Operations.MULTIPLY:
          this.calcMultiply(element.innerText);
          break;
        case Operations.DIVIDE:
          this.calcDivide(element.innerText);
          break;
        case Operations.CLEAR:
          this.calcClear();
          break;
        case Operations.DELETE:
          this.calcDelete();
          break;
        case Operations.APPEND_NUMBER:
          this.calcAppend(element.innerText);
          break;
      }
    })
  }
  
  private calcAdd(value: string): void {}
  
  private calcSubtract(value: string): void {}
  
  private calcMultiply(value: string): void {}
  
  private calcDivide(value: string): void {}
  
  private calcClear(): void {}
  
  private calcDelete(): void {}
  
  private calcAppend(value: string): void {
    this.assignCurrentOperand(value);
  }
  
  private getNumberFromCurrentOperand():number{
    return parseInt(this.calculatorDOM.currentOperand.innerText);
  }
  
  private assignCurrentOperand(value: string): void{
    this.calculatorDOM.currentOperand.innerText = value;
  };
  
  private setCurrentOperandToPrevious(endingCharacter: '+' | '-' | '%' | '*' | '' = ''): void {
    // const currentOperandElem:HTMLElement = <HTMLElement> document.querySelector('.current-operand');
    // const previousOperand
  }
}

new Main();