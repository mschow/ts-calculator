import './style.css'
import { Operations } from './operations.enum'
import { CalculatorDom } from './calculator-dom.model';

export class Main {
  private readonly MAX_CHARACTERS: number = 15;
  private readonly calculatorDOM: CalculatorDom = {
    buttonContainer: <HTMLElement> document.getElementById('calc-buttons'),
    currentValue: <HTMLElement> document.querySelector('.current-value'),
    previousValue: <HTMLElement> document.querySelector('.previous-value'),
  }

  private currentTotal: number = 0;
  private currentOperation: Operations | null = null;
  private leftOperator: string = '0';
  private rightOperator: string = '0';

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
        case Operations.APPEND_POINT:
          this.calcPointClick();
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
    this.leftOperator = '0';
    this.rightOperator = '';
  }
  
  private calcDeleteClick(): void {
    if(!this.rightOperator) return;
    this.rightOperator = this.rightOperator.substring(0, this.rightOperator.length - 1);
    this.assignCurrentValue(this.rightOperator);
  }
  
  private calcNumberClick(value: string): void {
    if(this.rightOperator.length >= this.MAX_CHARACTERS) return;
    this.rightOperator = this.rightOperator === '0' ? '': this.rightOperator;
    this.rightOperator += value;
    this.assignCurrentValue(this.rightOperator);
  }
  
  private calcPointClick():void{
    if(this.rightOperator.includes('.')) return;
    this.rightOperator+= '.';
    this.assignCurrentValue(this.rightOperator);
  }

  private assignCurrentValue(value: string): void {
    this.calculatorDOM.currentValue.innerText = value;
  };

  private assignPreviousValue(value: string, isFinalAssignment: boolean = false): void {
    this.calculatorDOM.previousValue.innerHTML = "";
    if(!value) return;

    //If the trailing character is a period, remove it.
    if(value[value.length - 1] === '.') value = value.substring(0, value.length - 1);
    const lefthandNumber: HTMLElement = document.createElement('span');
    lefthandNumber.innerText = value;
    this.calculatorDOM.previousValue.appendChild(lefthandNumber);
    this.calculatorDOM.previousValue.appendChild(this.getSymbolForCurrentOperation());

    //If this is the final calculation, add the right operator and an equals symbol.
    if(isFinalAssignment){
      const righthandNumber: HTMLElement = document.createElement('span');
      righthandNumber.innerText = this.rightOperator;
      const equalsSymbol: HTMLElement = document.createElement('i');
      equalsSymbol.className = 'fa fa-equals';
      this.calculatorDOM.previousValue.appendChild(righthandNumber);
      this.calculatorDOM.previousValue.appendChild(equalsSymbol);
    }
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
            return;
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
    this.rightOperator = this.rightOperator || '0';
    this.assignPreviousValue(this.leftOperator, true);
    this.calculateTotal();
    this.currentOperation = null;
    this.leftOperator = '0';
    this.rightOperator = '';
  }
}

new Main();