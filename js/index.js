import { CONFIG } from './const.js';
import { DOMUtils } from './utils/dom_utils.js';
import { ConversionUtils } from './utils/conversion_utils.js';
import { ClipboardUtils } from './utils/clipboard_utils.js';
import { FontSizeController } from './controllers/fontsize_controller.js';

// Generador de diccionario de caracteres
class CharacterDictionary {
    constructor(showLowercase, showNumbers, showSpace, selectedSpecialChars) {
        this.showLowercase = showLowercase;
        this.showNumbers = showNumbers;
        this.showSpace = showSpace;
        this.selectedSpecialChars = selectedSpecialChars;
    }

    generate() {
        const dictionary = new Map();
        let index = 0;

        // Mayúsculas (A-Z, excluyendo Ñ)
        index = this.addCharacterRange(dictionary, CONFIG.ASCII.UPPERCASE_START, CONFIG.ASCII.UPPERCASE_END, index, ['Ñ']);

        // Minúsculas (a-z, excluyendo ñ)
        if (this.showLowercase.checked) {
            index = this.addCharacterRange(dictionary, CONFIG.ASCII.LOWERCASE_START, CONFIG.ASCII.LOWERCASE_END, index, ['ñ']);
        }

        // Números (0-9)
        if (this.showNumbers.checked) {
            index = this.addCharacterRange(dictionary, CONFIG.ASCII.NUMBERS_START, CONFIG.ASCII.NUMBERS_END, index);
        }

        // Espacio
        if (this.showSpace.checked) {
            dictionary.set(' ', index++);
        }

        // Caracteres especiales seleccionados
        for (const char of this.selectedSpecialChars) {
            if (!dictionary.has(char)) {
                dictionary.set(char, index++);
            }
        }

        return dictionary;
    }

    addCharacterRange(dictionary, start, end, index, exclude = []) {
        for (let i = start; i <= end; i++) {
            const char = String.fromCharCode(i);
            if (!exclude.includes(char)) {
                dictionary.set(char, index++);
            }
        }
        return index;
    }
}

// Renderizador de diccionario
class DictionaryRenderer {
    constructor(container) {
        this.container = container;
    }

    render(dictionary) {
        this.container.innerHTML = '';
        
        if (dictionary.size === 0) {
            this.renderEmptyMessage();
            return;
        }

        const sortedEntries = Array.from(dictionary.entries())
            .sort((a, b) => a[1] - b[1]);

        sortedEntries.forEach(([char, number]) => {
            this.renderDictionaryItem(char, number);
        });
    }

    renderEmptyMessage() {
        const message = DOMUtils.createElement('p', '', CONFIG.MESSAGES.NO_CHARS);
        message.style.textAlign = 'center';
        message.style.color = '#666';
        this.container.appendChild(message);
    }

    renderDictionaryItem(char, number) {
        const displayChar = char === ' ' ? '(espacio)' : char;
        
        const item = DOMUtils.createElement('div', 'dictionary-item', `
            <span class="char">${displayChar}</span>
            <span class="number">${number}</span>
        `);
        
        this.container.appendChild(item);
    }
}

// Manejador de caracteres especiales
class SpecialCharactersHandler {
    constructor(container, selectedChars, onUpdate) {
        this.container = container;
        this.selectedChars = selectedChars;
        this.onUpdate = onUpdate;
        this.initializeEvents();
    }

    initializeEvents() {
        const charElements = this.container.querySelectorAll('.special-char');
        
        charElements.forEach(charElement => {
            charElement.addEventListener('click', (e) => this.handleClick(e, charElement));
            charElement.addEventListener('dblclick', (e) => this.handleDoubleClick(e, charElement));
        });
    }

    handleClick(e, charElement) {
        e.preventDefault();
        const char = charElement.dataset.char;
        
        if (!this.selectedChars.has(char)) {
            this.selectedChars.add(char);
            charElement.classList.add('selected');
            this.onUpdate();
        }
    }

    handleDoubleClick(e, charElement) {
        e.preventDefault();
        const char = charElement.dataset.char;
        
        if (this.selectedChars.has(char)) {
            this.selectedChars.delete(char);
            charElement.classList.remove('selected');
            this.onUpdate();
        }
    }
}

// Clase principal refactorizada
class TextToBinaryConverter {
    constructor() {
        this.initializeElements();
        this.selectedSpecialChars = new Set();
        this.fontController = new FontSizeController();
        this.dictionaryRenderer = new DictionaryRenderer(this.dictionary);
        
        this.initializeEventListeners();
        this.updateDictionary();
    }

    initializeElements() {
        // Elementos de conversión
        this.textInput = DOMUtils.getElementById('textInput');
        this.binaryOutput = DOMUtils.getElementById('binaryOutput');
        this.textInputHex = DOMUtils.getElementById('textInputHex');
        this.hexOutput = DOMUtils.getElementById('hexOutput');
        this.decimalInput = DOMUtils.getElementById('decimalInput');
        this.decimalBinaryOutput = DOMUtils.getElementById('decimalBinaryOutput');
        
        // Nuevos elementos para octal
        this.decimalOctalInput = DOMUtils.getElementById('decimalOctalInput');
        this.decimalOctalOutput = DOMUtils.getElementById('decimalOctalOutput');
        
        // Nuevos elementos para módulo
        this.dividendInput = DOMUtils.getElementById('dividendInput');
        this.divisorInput = DOMUtils.getElementById('divisorInput');
        this.moduloOutput = DOMUtils.getElementById('moduloOutput');
        
        // Nuevos elementos para decimal fraccionario a binario
        this.fractionalDecimalInput = DOMUtils.getElementById('fractionalDecimalInput');
        this.fractionalDecimalBinaryOutput = DOMUtils.getElementById('fractionalDecimalBinaryOutput');
        
        // Elementos del diccionario
        this.dictionary = DOMUtils.getElementById('dictionary');
        this.showLowercase = DOMUtils.getElementById('showLowercase');
        this.showNumbers = DOMUtils.getElementById('showNumbers');
        this.showSpace = DOMUtils.getElementById('showSpace');
        this.specialCharsGrid = DOMUtils.getElementById('specialCharsGrid');
    }

    initializeEventListeners() {
        // Conversiones en tiempo real
        this.textInput?.addEventListener('input', () => this.convertToBinary());
        this.textInputHex?.addEventListener('input', () => this.convertToHex());
        this.decimalInput?.addEventListener('input', () => this.convertDecimalToBinary());
        
        // Nuevas conversiones
        this.decimalOctalInput?.addEventListener('input', () => this.convertDecimalToOctal());
        this.dividendInput?.addEventListener('input', () => this.calculateModulo());
        this.divisorInput?.addEventListener('input', () => this.calculateModulo());
        this.fractionalDecimalInput?.addEventListener('input', () => this.convertFractionalDecimalToBinary());

        // Controles del diccionario
        this.showLowercase?.addEventListener('change', () => this.updateDictionary());
        this.showNumbers?.addEventListener('change', () => this.updateDictionary());
        this.showSpace?.addEventListener('change', () => this.updateDictionary());

        // Inicializar manejadores
        this.initializeSpecialCharsHandler();
        this.fontController.initializeControls();
        this.initializeCopyButtons();
    }

    initializeSpecialCharsHandler() {
        if (this.specialCharsGrid) {
            this.specialCharsHandler = new SpecialCharactersHandler(
                this.specialCharsGrid,
                this.selectedSpecialChars,
                () => this.updateDictionary()
            );
        }
    }

    initializeCopyButtons() {
        const copyButtons = [
            { buttonId: 'copyTextInput', getValue: () => this.textInput?.value },
            { buttonId: 'copyBinaryOutput', getValue: () => this.getOutputText(this.binaryOutput, CONFIG.MESSAGES.BINARY_PLACEHOLDER) },
            { buttonId: 'copyTextInputHex', getValue: () => this.textInputHex?.value },
            { buttonId: 'copyHexOutput', getValue: () => this.getOutputText(this.hexOutput, CONFIG.MESSAGES.HEX_PLACEHOLDER) },
            { buttonId: 'copyDecimalInput', getValue: () => this.decimalInput?.value },
            { buttonId: 'copyDecimalBinaryOutput', getValue: () => this.getOutputText(this.decimalBinaryOutput, CONFIG.MESSAGES.BINARY_PLACEHOLDER) },
            
            // Nuevos botones de copia para octal
            { buttonId: 'copyDecimalOctalInput', getValue: () => this.decimalOctalInput?.value },
            { buttonId: 'copyDecimalOctalOutput', getValue: () => this.getOutputText(this.decimalOctalOutput, CONFIG.MESSAGES.OCTAL_PLACEHOLDER) },
            
            // Nuevos botones de copia para módulo
            { buttonId: 'copyDividendInput', getValue: () => this.dividendInput?.value },
            { buttonId: 'copyDivisorInput', getValue: () => this.divisorInput?.value },
            { buttonId: 'copyModuloOutput', getValue: () => this.getOutputText(this.moduloOutput, CONFIG.MESSAGES.MODULO_PLACEHOLDER) },
            
            // Nuevos botones de copia para decimal fraccionario
            { buttonId: 'copyFractionalDecimalInput', getValue: () => this.fractionalDecimalInput?.value },
            { buttonId: 'copyFractionalDecimalBinaryOutput', getValue: () => this.getOutputText(this.fractionalDecimalBinaryOutput, CONFIG.MESSAGES.FRACTIONAL_DECIMAL_BINARY_PLACEHOLDER) }
        ];

        copyButtons.forEach(({ buttonId, getValue }) => {
            const button = DOMUtils.getElementById(buttonId);
            button?.addEventListener('click', () => {
                const text = getValue();
                if (text) {
                    ClipboardUtils.copyText(text, button);
                }
            });
        });
    }

    getOutputText(element, placeholder) {
        const text = element?.textContent;
        return (text && text !== placeholder) ? text : null;
    }

    convertToBinary() {
        if (this.binaryOutput) {
            this.binaryOutput.textContent = ConversionUtils.textToBinary(this.textInput?.value || '');
        }
    }

    convertToHex() {
        if (this.hexOutput) {
            this.hexOutput.textContent = ConversionUtils.textToHex(this.textInputHex?.value || '');
        }
    }

    convertDecimalToBinary() {
        if (this.decimalBinaryOutput) {
            this.decimalBinaryOutput.textContent = ConversionUtils.decimalToBinary(this.decimalInput?.value || '');
        }
    }

    convertDecimalToOctal() {
        if (this.decimalOctalOutput) {
            this.decimalOctalOutput.textContent = ConversionUtils.decimalToOctal(this.decimalOctalInput?.value || '');
        }
    }

    calculateModulo() {
        if (this.moduloOutput) {
            this.moduloOutput.textContent = ConversionUtils.calculateModulo(
                this.dividendInput?.value || '',
                this.divisorInput?.value || ''
            );
        }
    }

    convertFractionalDecimalToBinary() {
        if (this.fractionalDecimalBinaryOutput) {
            this.fractionalDecimalBinaryOutput.textContent = ConversionUtils.fractionalDecimalToBinary(
                this.fractionalDecimalInput?.value || ''
            );
        }
    }

    updateDictionary() {
        const characterDictionary = new CharacterDictionary(
            this.showLowercase,
            this.showNumbers,
            this.showSpace,
            this.selectedSpecialChars
        );
        
        const dictionary = characterDictionary.generate();
        this.dictionaryRenderer.render(dictionary);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    new TextToBinaryConverter();
});