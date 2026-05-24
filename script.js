let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;
let memoryValue = 0;
let isScientific = false;

const currentDisplay = document.getElementById('currentInput');
const historyDisplay = document.getElementById('expressionHistory');
const keypadContainer = document.getElementById('keypad');

const standardButtons = [
    { label: '(', type: 'func', action: 'addParenthesis', value: '(' },
    { label: ')', type: 'func', action: 'addParenthesis', value: ')' },
    { label: 'C', type: 'clear', action: 'clear', value: 'C' },
    { label: '⌫', type: 'clear', action: 'backspace', value: '⌫' },
    { label: '÷', type: 'operator', action: 'setOperation', value: '/' },
    { label: '7', type: 'number', action: 'appendNumber', value: '7' },
    { label: '8', type: 'number', action: 'appendNumber', value: '8' },
    { label: '9', type: 'number', action: 'appendNumber', value: '9' },
    { label: '×', type: 'operator', action: 'setOperation', value: '*' },
    { label: '4', type: 'number', action: 'appendNumber', value: '4' },
    { label: '5', type: 'number', action: 'appendNumber', value: '5' },
    { label: '6', type: 'number', action: 'appendNumber', value: '6' },
    { label: '-', type: 'operator', action: 'setOperation', value: '-' },
    { label: '1', type: 'number', action: 'appendNumber', value: '1' },
    { label: '2', type: 'number', action: 'appendNumber', value: '2' },
    { label: '3', type: 'number', action: 'appendNumber', value: '3' },
    { label: '+', type: 'operator', action: 'setOperation', value: '+' },
    { label: '+/-', type: 'func', action: 'toggleSign', value: '+/-' },
    { label: '0', type: 'number', action: 'appendNumber', value: '0' },
    { label: '.', type: 'decimal', action: 'appendDecimal', value: '.' },
    { label: '=', type: 'equal', action: 'calculate', value: '=' }
];

const scientificButtons = [
    { label: '(', type: 'func', action: 'addParenthesis', value: '(' },
    { label: ')', type: 'func', action: 'addParenthesis', value: ')' },
    { label: 'C', type: 'clear', action: 'clear', value: 'C' },
    { label: '⌫', type: 'clear', action: 'backspace', value: '⌫' },
    { label: '÷', type: 'operator', action: 'setOperation', value: '/' },
    { label: 'sin', type: 'scientific', action: 'scientificFunc', value: 'sin' },
    { label: 'cos', type: 'scientific', action: 'scientificFunc', value: 'cos' },
    { label: 'tan', type: 'scientific', action: 'scientificFunc', value: 'tan' },
    { label: '×', type: 'operator', action: 'setOperation', value: '*' },
    { label: '√', type: 'scientific', action: 'scientificFunc', value: 'sqrt' },
    { label: 'x²', type: 'scientific', action: 'scientificFunc', value: 'square' },
    { label: 'x³', type: 'scientific', action: 'scientificFunc', value: 'cube' },
    { label: '-', type: 'operator', action: 'setOperation', value: '-' },
    { label: '7', type: 'number', action: 'appendNumber', value: '7' },
    { label: '8', type: 'number', action: 'appendNumber', value: '8' },
    { label: '9', type: 'number', action: 'appendNumber', value: '9' },
    { label: '+', type: 'operator', action: 'setOperation', value: '+' },
    { label: '4', type: 'number', action: 'appendNumber', value: '4' },
    { label: '5', type: 'number', action: 'appendNumber', value: '5' },
    { label: '6', type: 'number', action: 'appendNumber', value: '6' },
    { label: '1/x', type: 'scientific', action: 'scientificFunc', value: 'reciprocal' },
    { label: '1', type: 'number', action: 'appendNumber', value: '1' },
    { label: '2', type: 'number', action: 'appendNumber', value: '2' },
    { label: '3', type: 'number', action: 'appendNumber', value: '3' },
    { label: 'log', type: 'scientific', action: 'scientificFunc', value: 'log' },
    { label: '+/-', type: 'func', action: 'toggleSign', value: '+/-' },
    { label: '0', type: 'number', action: 'appendNumber', value: '0' },
    { label: '.', type: 'decimal', action: 'appendDecimal', value: '.' },
    { label: '=', type: 'equal', action: 'calculate', value: '=' }
];

function renderKeypad() {
    const buttons = isScientific ? scientificButtons : standardButtons;
    keypadContainer.innerHTML = '';
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.label;
        button.classList.add('calc-btn');
        
        if (btn.type === 'operator') button.classList.add('operator-btn');
        if (btn.type === 'equal') button.classList.add('equal-btn');
        if (btn.label === 'C' || btn.label === '⌫') button.classList.add('clear-btn');
        if (btn.type === 'scientific') button.classList.add('func-btn');
        
        button.addEventListener('click', () => {
            if (btn.action === 'appendNumber') appendNumber(btn.value);
            else if (btn.action === 'appendDecimal') appendDecimal();
            else if (btn.action === 'setOperation') setOperation(btn.value);
            else if (btn.action === 'calculate') calculate();
            else if (btn.action === 'clear') clear();
            else if (btn.action === 'backspace') backspace();
            else if (btn.action === 'toggleSign') toggleSign();
            else if (btn.action === 'addParenthesis') addParenthesis(btn.value);
            else if (btn.action === 'scientificFunc') scientificFunc(btn.value);
        });
        
        keypadContainer.appendChild(button);
    });
}

function appendNumber(number) {
    if (shouldResetScreen) {
        currentInput = '';
        shouldResetScreen = false;
    }
    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetScreen) {
        currentInput = '0';
        shouldResetScreen = false;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function setOperation(op) {
    if (operation !== null && !shouldResetScreen) {
        calculate();
    }
    previousInput = currentInput;
    operation = op;
    shouldResetScreen = true;
    updateHistory();
}

function calculate() {
    if (operation === null || shouldResetScreen) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero');
                clear();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    operation = null;
    previousInput = '';
    shouldResetScreen = true;
    updateDisplay();
    updateHistory(true);
}

function clear() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetScreen = false;
    updateDisplay();
    historyDisplay.textContent = '';
}

function backspace() {
    if (shouldResetScreen) {
        clear();
        return;
    }
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function toggleSign() {
    let num = parseFloat(currentInput);
    if (isNaN(num)) return;
    num = -num;
    currentInput = num.toString();
    updateDisplay();
}

function addParenthesis(paren) {
    if (shouldResetScreen) {
        currentInput = '';
        shouldResetScreen = false;
    }
    currentInput += paren;
    updateDisplay();
}

function scientificFunc(func) {
    let num = parseFloat(currentInput);
    if (isNaN(num)) return;
    let result;
    
    switch (func) {
        case 'sin':
            result = Math.sin(num * Math.PI / 180);
            break;
        case 'cos':
            result = Math.cos(num * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(num * Math.PI / 180);
            break;
        case 'sqrt':
            if (num < 0) {
                alert('Cannot take square root of negative number');
                return;
            }
            result = Math.sqrt(num);
            break;
        case 'square':
            result = num * num;
            break;
        case 'cube':
            result = num * num * num;
            break;
        case 'reciprocal':
            if (num === 0) {
                alert('Cannot divide by zero');
                return;
            }
            result = 1 / num;
            break;
        case 'log':
            if (num <= 0) {
                alert('Logarithm only defined for positive numbers');
                return;
            }
            result = Math.log10(num);
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    shouldResetScreen = true;
    operation = null;
    previousInput = '';
    updateDisplay();
    historyDisplay.textContent = `${func}(${num}) =`;
}

function updateDisplay() {
    if (currentInput.length > 18) {
        currentInput = parseFloat(currentInput).toExponential(10);
    }
    currentDisplay.textContent = currentInput;
}

function updateHistory(resetAfterEqual = false) {
    if (operation && previousInput) {
        let opSymbol = '';
        switch (operation) {
            case '+': opSymbol = '+'; break;
            case '-': opSymbol = '-'; break;
            case '*': opSymbol = '×'; break;
            case '/': opSymbol = '÷'; break;
        }
        historyDisplay.textContent = `${previousInput} ${opSymbol}`;
    } else if (resetAfterEqual && previousInput && operation) {
        historyDisplay.textContent = '';
    }
}

document.getElementById('standardModeBtn').addEventListener('click', () => {
    isScientific = false;
    document.getElementById('standardModeBtn').classList.add('active-mode');
    document.getElementById('scientificModeBtn').classList.remove('active-mode');
    clear();
    renderKeypad();
});

document.getElementById('scientificModeBtn').addEventListener('click', () => {
    isScientific = true;
    document.getElementById('scientificModeBtn').classList.add('active-mode');
    document.getElementById('standardModeBtn').classList.remove('active-mode');
    clear();
    renderKeypad();
});

document.getElementById('clearMemoryBtn').addEventListener('click', () => {
    memoryValue = 0;
    alert('Memory cleared');
});

renderKeypad();