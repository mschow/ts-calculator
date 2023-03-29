import './style.css'
import { Operations } from './operations.enum'

function initializeCalculator(){
  const calculatorButtons: HTMLElement | null = document.getElementById('calc-buttons');
  
  calculatorButtons?.addEventListener('click', (event)=>{
    const element: HTMLElement = <HTMLElement> event.target;
    switch(<Operations> element.dataset['operation']){
      case Operations.ADD:
        console.log("Add");
        break;
      case Operations.SUBTRACT:
        console.log("Subtract");
        break;
      case Operations.MULTIPLY:
        console.log("Multiply");
        break;
      case Operations.DIVIDE:
        console.log("Divide");
        break;
      case Operations.CLEAR:
        console.log("Clear");
        break;
      case Operations.DELETE:
        console.log("Delete");
        break;
      case Operations.APPEND_NUMBER:
        console.log("Append");
        break;
    }
  })
}

initializeCalculator();