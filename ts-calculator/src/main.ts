import './style.css'
import { Operations } from './operations.enum'
import { CalculatorDom } from './calculator-dom.model';

export class Main {
  private readonly calculatorDOM: CalculatorDom = {
    buttonContainer: <HTMLElement> document.getElementById('calc-buttons'),
    currentValue: <HTMLElement> document.querySelector('.current-value'),
    previousValue: <HTMLElement> document.querySelector('.previous-value'),
  }

  private currentTotal: number = 0;
  private finalEquation: string = '';
  private currentOperation: Operations | null = null;
  private leftOperator: string = '';
  private rightOperator: string = '';

  constructor(){
    this.assignEventListeners();
  }

  private assignEventListeners(): void{
    this.calculatorDOM.buttonContainer?.addEventListener('click', (event)=>{
      const element: HTMLElement = <HTMLElement> event.target;
      const operation: Operations = <Operations> element.closest('button')?.dataset['operation']
      switch(operation){
        case Operations.ADD:
        case Operations.SUBTRACT:
        case Operations.MULTIPLY:
        case Operations.DIVIDE:
          this.operandClick(operation)
          break;
        case Operations.CLEAR:
          this.calcClearClick();
          break;
        case Operations.DELETE:
          this.calcDeleteClick();
          break;
        case Operations.APPEND_NUMBER:
          this.calcNumberClick(element.innerText);
          break;
        case Operations.CALCULATE:
          this.calculateFinal();
      }
    })
  }
  
  private operandClick(operationType: Operations): void{
    if(this.leftOperator && this.rightOperator && this.currentOperation){
      this.calculateTotal();
      this.currentOperation = operationType;
      this.assignPreviousValue(this.currentTotal.toString());
    } else if(this.rightOperator){
      this.currentOperation = operationType;
      this.leftOperator = this.rightOperator;
      this.currentTotal = parseInt(this.leftOperator);
      this.assignPreviousValue(this.currentTotal.toString());
    }
    this.currentOperation = operationType;
    this.assignPreviousValue(this.currentTotal.toString())
    this.rightOperator = '';
  }
  
  private calcClearClick(): void {
    this.currentTotal = 0;
    this.assignCurrentValue('');
    this.assignPreviousValue('');
    this.currentOperation = null;
    this.leftOperator = '';
    this.rightOperator = '';
    this.finalEquation = '';
  }
  
  private calcDeleteClick(): void {
    const currentValue:string = this.calculatorDOM.currentValue.innerText;
    this.assignCurrentValue(currentValue.substring(0, currentValue.length - 1));
  }
  
  private calcNumberClick(value: string): void {
    this.rightOperator += value;
    this.finalEquation += value;
    this.assignCurrentValue(this.rightOperator);
  }
  
  private assignCurrentValue(value: string): void {
    this.calculatorDOM.currentValue.innerText = value;
  };

  private assignPreviousValue(value: string): void {
    this.calculatorDOM.previousValue.innerHTML = "";
    if(!value){
      return;
    }
    const lefthandNumber: HTMLElement = document.createElement('span');
    lefthandNumber.innerText = value;
    this.calculatorDOM.previousValue.appendChild(lefthandNumber);
    this.calculatorDOM.previousValue.appendChild(this.getSymbolForCurrentOperation());
  }

  private getSymbolForCurrentOperation(): HTMLElement{
    const symbol: HTMLElement = document.createElement('i');
    symbol.classList.add('fa');

    switch(this.currentOperation){
      case Operations.ADD:
        symbol.classList.add('fa-plus');
        break;
      case Operations.SUBTRACT:
        symbol.classList.add('fa-minus');
        break;
      case Operations.MULTIPLY:
        symbol.classList.add('fa-times');
        break;
      case Operations.DIVIDE:
        symbol.classList.add('fa-divide');
        break;
      case Operations.CALCULATE:
        symbol.classList.add('fa-equals');
        break;
    }

    return symbol;
  }

  private calculateTotal(): void{
    if(this.currentOperation && this.leftOperator){
      const left: number = parseFloat(this.leftOperator) || 0;
      const right: number = parseFloat(this.rightOperator);
      switch(this.currentOperation){
        case Operations.ADD:
          this.currentTotal = left + right;
          break;
        case Operations.SUBTRACT:
          this.currentTotal = left - right;
          break;
        case Operations.MULTIPLY:
          this.currentTotal = left * right;
          break;
        case Operations.DIVIDE:
          if(right === 0){
            this.calcClearClick();
            this.assignCurrentValue("Cannot divide by 0.");
          } else {
            this.currentTotal = left / right;
          }
          break; 
      }
      this.assignCurrentValue(this.currentTotal.toString())
      this.leftOperator = this.currentTotal.toString();
    } else if(this.currentOperation && !this.leftOperator){
      this.leftOperator = this.rightOperator.toString();
    }
  }

  private calculateFinal(): void {
    this.calculateTotal();
    this.currentOperation = Operations.CALCULATE;
    this.assignPreviousValue(this.finalEquation.toString());
    this.finalEquation = '';
  }
}

new Main();