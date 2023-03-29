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
          this.calcAdd();
          break;
        case Operations.SUBTRACT:
          this.calcSubtract();
          break;
        case Operations.MULTIPLY:
          this.calcMultiply();
          break;
        case Operations.DIVIDE:
          this.calcDivide();
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
  
  private calcAdd(): void {
    console.log("Add");
    const calculated: number = this.getNumberFromCurrentOperand() + this.getNumberFromPreviousOperand();
    this.setCurrentOperandToPrevious('+');
    this.assignCurrentOperand(calculated.toString());
  }
  
  private calcSubtract(): void {
    this.setCurrentOperandToPrevious('-');
  }
  
  private calcMultiply(): void {
    this.setCurrentOperandToPrevious('*');
  }
  
  private calcDivide(): void {
    this.setCurrentOperandToPrevious('/');
  }
  
  private calcClear(): void {
    this.assignCurrentOperand('');
    this.assignPreviousOperand('');
  }
  
  private calcDelete(): void {
    const currentValue:string = this.calculatorDOM.currentOperand.innerText;
    this.assignCurrentOperand(currentValue.substring(0, currentValue.length - 1));
  }
  
  private calcAppend(value: string): void {
    const currentValue:string = this.calculatorDOM.currentOperand.innerText;
    this.assignCurrentOperand(currentValue + value);
  }

  private getNumberFromPreviousOperand():number{
    const previousNumber:number = parseInt(this.calculatorDOM.previousOperand.innerText);
    return isNaN(previousNumber) ? 0 : previousNumber;
  }

  private getNumberFromCurrentOperand():number{
    const currentNumber:number = parseInt(this.calculatorDOM.currentOperand.innerText);
    return isNaN(currentNumber) ? 0 : currentNumber;
  }
  
  private assignCurrentOperand(value: string): void{
    this.calculatorDOM.currentOperand.innerText = value;
  };
  
  private setCurrentOperandToPrevious(endingCharacter: '+' | '-' | '/' | '*' | null = null): void {
    this.assignPreviousOperand(this.calculatorDOM.currentOperand.innerText + (endingCharacter ? ` ${endingCharacter}` : ''));
  }

  private assignPreviousOperand(value: string):void{
    this.calculatorDOM.previousOperand.innerText = value;
  }
}

new Main();