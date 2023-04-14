import './style.css';
import { Operations } from './operations.enum';
import { CalculatorDom } from './calculator-dom.model';
import { Equation } from './equation.model';

export class Main {
  private readonly MAX_CHARACTERS: number = 12;
  private readonly calculatorDOM: CalculatorDom = {
    htmlMain: <HTMLElement>document.querySelector('html'),
    themeToggle: <HTMLElement>document.querySelector('.theme-toggle'),
    buttonContainer: <HTMLElement>document.getElementById('calc-buttons'),
    currentValue: <HTMLElement>document.querySelector('.current-value'),
    previousValue: <HTMLElement>document.querySelector('.previous-value'),
  };

  private firstPressAfterEnter: boolean = true;
  private activeEquation: Equation = {
    currentTotal: 0,
    currentOperation: null,
    leftOperator: '0',
    rightOperator: '0',
  };

  constructor() {
    this.setInitialTheme();
    this.assignEventListeners();
  }

  private setInitialTheme(): void {
    if (localStorage.getItem('css-theme')) {
      this.setTheme(<'light' | 'dark'>localStorage.getItem('css-theme'));
      return;
    }
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      this.setTheme('dark');
    }
  }

  private toggleTheme(): void {
    const theme: 'light' | 'dark' =
      <'dark' | 'light'>this.calculatorDOM.htmlMain.dataset['theme'] || 'light';
    if (theme === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  private setTheme(theme: 'light' | 'dark'): void {
    this.calculatorDOM.htmlMain.setAttribute('data-theme', theme);
    this.calculatorDOM.themeToggle
      .querySelector('i')
      ?.setAttribute('class', theme === 'light' ? 'fa fa-sun' : 'fa fa-moon');
    localStorage.setItem('css-theme', theme);
  }

  private assignEventListeners(): void {
    this.calculatorDOM.buttonContainer?.addEventListener('click', (event) => {
      const element: HTMLElement = <HTMLElement>event.target;
      const operation: Operations = <Operations>(
        element.closest('button')?.dataset['operation']
      );
      this.handleOperationEvent(operation, element.innerText);
    });

    this.calculatorDOM.themeToggle?.addEventListener('click', () => {
      this.toggleTheme();
    });

    window.addEventListener('keydown', (event) => {
      event.preventDefault();
      if (event.repeat) return;
      this.handleKeyPress(event);
    });
  }

  private handleKeyPress(event: KeyboardEvent) {
    if (!isNaN(parseInt(event.key))) {
      this.handleOperationEvent(Operations.APPEND_NUMBER, event.key);
    }

    switch (event.key) {
      case '+':
        this.handleOperationEvent(Operations.ADD);
        break;
      case '-':
        this.handleOperationEvent(Operations.SUBTRACT);
        break;
      case '*':
        this.handleOperationEvent(Operations.MULTIPLY);
        break;
      case '/':
        this.handleOperationEvent(Operations.DIVIDE);
        break;
      case '.':
        this.handleOperationEvent(Operations.APPEND_POINT);
        break;
      case 'Enter':
        this.handleOperationEvent(Operations.CALCULATE);
        break;
      case 'Backspace':
        this.handleOperationEvent(Operations.DELETE);
        break;
    }
  }

  private handleOperationEvent(operation: Operations, buttonText: string = '') {
    switch (operation) {
      case Operations.ADD:
      case Operations.SUBTRACT:
      case Operations.MULTIPLY:
      case Operations.DIVIDE:
        this.operandSelect(operation);
        break;
      case Operations.CLEAR:
        this.calcClearSelect();
        break;
      case Operations.DELETE:
        this.calcDeleteSelect();
        break;
      case Operations.APPEND_NUMBER:
        this.calcNumberSelect(buttonText);
        break;
      case Operations.APPEND_POINT:
        this.calcPointSelect();
        break;
      case Operations.CALCULATE:
        this.calculateFinal();
        break;
    }
  }

  private operandSelect(operationType: Operations): void {
    if (this.firstPressAfterEnter)
      this.activeEquation.leftOperator =
        this.calculatorDOM.currentValue.innerText;
    if (
      this.activeEquation.leftOperator &&
      this.activeEquation.rightOperator &&
      this.activeEquation.currentOperation
    ) {
      this.calculateTotal();
      this.activeEquation.currentOperation = operationType;
      this.assignPreviousValue(this.activeEquation.currentTotal.toString());
    } else if (this.activeEquation.rightOperator) {
      this.activeEquation.currentOperation = operationType;
      this.activeEquation.leftOperator = this.activeEquation.rightOperator;
      this.activeEquation.currentTotal = parseInt(
        this.activeEquation.leftOperator
      );
      this.assignPreviousValue(this.activeEquation.currentTotal.toString());
    }
    this.activeEquation.currentOperation = operationType;
    this.assignPreviousValue(this.activeEquation.currentTotal.toString());
    this.activeEquation.rightOperator = '';
    this.firstPressAfterEnter = false;
  }

  private calcClearSelect(): void {
    this.activeEquation.currentTotal = 0;
    this.assignCurrentValue('');
    this.assignPreviousValue('');
    this.activeEquation.currentOperation = null;
    this.activeEquation.leftOperator = '0';
    this.activeEquation.rightOperator = '';
    this.firstPressAfterEnter = false;
  }

  private calcDeleteSelect(): void {
    if (this.firstPressAfterEnter) this.calcClearSelect();
    if (!this.activeEquation.rightOperator) return;
    this.activeEquation.rightOperator =
      this.activeEquation.rightOperator.substring(
        0,
        this.activeEquation.rightOperator.length - 1
      );
    this.assignCurrentValue(this.activeEquation.rightOperator);
    this.firstPressAfterEnter = false;
  }

  private calcNumberSelect(value: string): void {
    if (this.activeEquation.rightOperator.length >= this.MAX_CHARACTERS) return;
    this.activeEquation.rightOperator =
      this.activeEquation.rightOperator === '0'
        ? ''
        : this.activeEquation.rightOperator;
    this.activeEquation.rightOperator += value;
    this.assignCurrentValue(this.activeEquation.rightOperator);
    this.firstPressAfterEnter = false;
  }

  private calcPointSelect(): void {
    if (this.activeEquation.rightOperator.includes('.')) return;
    this.activeEquation.rightOperator += '.';
    this.assignCurrentValue(this.activeEquation.rightOperator);
    this.firstPressAfterEnter = false;
  }

  private assignCurrentValue(value: string): void {
    this.calculatorDOM.currentValue.innerText = value;
  }

  private assignPreviousValue(
    value: string,
    isFinalAssignment: boolean = false
  ): void {
    this.calculatorDOM.previousValue.innerHTML = '';
    if (!value) return;

    //If the trailing character is a period, remove it.
    if (value[value.length - 1] === '.')
      value = value.substring(0, value.length - 1);

    const lefthandNumber: HTMLElement = document.createElement('span');
    lefthandNumber.innerText = value;
    this.calculatorDOM.previousValue.appendChild(lefthandNumber);
    this.calculatorDOM.previousValue.appendChild(
      this.getSymbolForCurrentOperation()
    );

    //If this is the final calculation, add the right operator and an equals symbol.
    if (isFinalAssignment) {
      const righthandNumber: HTMLElement = document.createElement('span');
      righthandNumber.innerText = this.activeEquation.rightOperator;
      const equalsSymbol: HTMLElement = document.createElement('i');
      equalsSymbol.className = 'fa fa-equals';
      this.calculatorDOM.previousValue.appendChild(righthandNumber);
      this.calculatorDOM.previousValue.appendChild(equalsSymbol);
    }
  }

  private getSymbolForCurrentOperation(): HTMLElement {
    const symbol: HTMLElement = document.createElement('i');
    symbol.classList.add('fa');

    switch (this.activeEquation.currentOperation) {
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

  private calculateTotal(): void {
    if (
      this.activeEquation.currentOperation &&
      this.activeEquation.leftOperator
    ) {
      const left: number = parseFloat(this.activeEquation.leftOperator) || 0;
      const right: number = parseFloat(this.activeEquation.rightOperator);
      switch (this.activeEquation.currentOperation) {
        case Operations.ADD:
          this.activeEquation.currentTotal = left + right;
          break;
        case Operations.SUBTRACT:
          this.activeEquation.currentTotal = left - right;
          break;
        case Operations.MULTIPLY:
          this.activeEquation.currentTotal = left * right;
          break;
        case Operations.DIVIDE:
          if (right === 0) {
            this.calcClearSelect();
            this.assignCurrentValue('Cannot divide by 0.');
            return;
          } else {
            this.activeEquation.currentTotal = left / right;
          }
          break;
      }
      this.assignCurrentValue(this.activeEquation.currentTotal.toString());
      this.activeEquation.leftOperator =
        this.activeEquation.currentTotal.toString();
    } else if (
      this.activeEquation.currentOperation &&
      !this.activeEquation.leftOperator
    ) {
      this.activeEquation.leftOperator =
        this.activeEquation.rightOperator.toString();
    }
  }

  private calculateFinal(): void {
    if (this.firstPressAfterEnter || !this.activeEquation.currentOperation)
      return;
    this.activeEquation.rightOperator =
      this.activeEquation.rightOperator || '0';
    this.assignPreviousValue(this.activeEquation.leftOperator, true);
    this.calculateTotal();
    this.activeEquation.currentOperation = null;
    this.activeEquation.leftOperator = '0';
    this.activeEquation.rightOperator = '';
    this.firstPressAfterEnter = true;
  }
}

new Main();
