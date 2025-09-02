class TextToBinaryConverter {
            constructor() {
                this.textInput = document.getElementById('textInput');
                this.binaryOutput = document.getElementById('binaryOutput');
                this.textInputHex = document.getElementById('textInputHex');
                this.hexOutput = document.getElementById('hexOutput');
                this.decimalInput = document.getElementById('decimalInput');
                this.decimalBinaryOutput = document.getElementById('decimalBinaryOutput');
                this.dictionary = document.getElementById('dictionary');
                this.showLowercase = document.getElementById('showLowercase');
                this.showNumbers = document.getElementById('showNumbers');
                this.showSpace = document.getElementById('showSpace');
                this.specialCharsGrid = document.getElementById('specialCharsGrid');
                this.selectedSpecialChars = new Set();
                
                this.initializeEventListeners();
                this.updateDictionary();
            }

            initializeEventListeners() {
                // Conversión en tiempo real - Binario
                this.textInput.addEventListener('input', () => {
                    this.convertToBinary();
                });

                // Conversión en tiempo real - Hexadecimal
                this.textInputHex.addEventListener('input', () => {
                    this.convertToHex();
                });

                // Conversión en tiempo real - Decimal a Binario
                this.decimalInput.addEventListener('input', () => {
                    this.convertDecimalToBinary();
                });

                // Actualizar diccionario cuando cambien los controles
                this.showLowercase.addEventListener('change', () => this.updateDictionary());
                this.showNumbers.addEventListener('change', () => this.updateDictionary());
                this.showSpace.addEventListener('change', () => this.updateDictionary());
                this.initializeSpecialCharsEvents();

                // Controles de tamaño de fuente
                this.initializeFontSizeControls();
                
                // Botones de copiar
                this.initializeCopyButtons();
            }

            initializeSpecialCharsEvents() {
                const specialCharElements = this.specialCharsGrid.querySelectorAll('.special-char');
                
                specialCharElements.forEach(charElement => {
                    // Click para seleccionar
                    charElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        const char = charElement.dataset.char;
                        
                        if (!this.selectedSpecialChars.has(char)) {
                            this.selectedSpecialChars.add(char);
                            charElement.classList.add('selected');
                            this.updateDictionary();
                        }
                    });
                    
                    // Doble click para deseleccionar
                    charElement.addEventListener('dblclick', (e) => {
                        e.preventDefault();
                        const char = charElement.dataset.char;
                        
                        if (this.selectedSpecialChars.has(char)) {
                            this.selectedSpecialChars.delete(char);
                            charElement.classList.remove('selected');
                            this.updateDictionary();
                        }
                    });
                });
            }

            initializeFontSizeControls() {
                const increaseDictBtn = document.getElementById('increaseDictFont');
                const decreaseDictBtn = document.getElementById('decreaseDictFont');
                const increaseBinaryBtn = document.getElementById('increaseBinaryFont');
                const decreaseBinaryBtn = document.getElementById('decreaseBinaryFont');
                const increaseHexBtn = document.getElementById('increaseHexFont');
                const decreaseHexBtn = document.getElementById('decreaseHexFont');
                const increaseDecimalBinaryBtn = document.getElementById('increaseDecimalBinaryFont');
                const decreaseDecimalBinaryBtn = document.getElementById('decreaseDecimalBinaryFont');

                let dictFontSize = 14; // Tamaño inicial del diccionario
                let binaryFontSize = 14; // Tamaño inicial del binario
                let hexFontSize = 14; // Tamaño inicial del hexadecimal
                let decimalBinaryFontSize = 14; // Tamaño inicial del decimal a binario

                // Controles del diccionario
                increaseDictBtn.addEventListener('click', () => {
                    dictFontSize = Math.min(dictFontSize + 2, 24);
                    this.updateDictionaryFontSize(dictFontSize);
                });

                decreaseDictBtn.addEventListener('click', () => {
                    dictFontSize = Math.max(dictFontSize - 2, 10);
                    this.updateDictionaryFontSize(dictFontSize);
                });

                // Controles del binario
                increaseBinaryBtn.addEventListener('click', () => {
                    binaryFontSize = Math.min(binaryFontSize + 2, 24);
                    this.updateBinaryFontSize(binaryFontSize);
                });

                decreaseBinaryBtn.addEventListener('click', () => {
                    binaryFontSize = Math.max(binaryFontSize - 2, 10);
                    this.updateBinaryFontSize(binaryFontSize);
                });

                // Controles del hexadecimal
                increaseHexBtn.addEventListener('click', () => {
                    hexFontSize = Math.min(hexFontSize + 2, 24);
                    this.updateHexFontSize(hexFontSize);
                });

                decreaseHexBtn.addEventListener('click', () => {
                    hexFontSize = Math.max(hexFontSize - 2, 10);
                    this.updateHexFontSize(hexFontSize);
                });

                // Controles del decimal a binario
                increaseDecimalBinaryBtn.addEventListener('click', () => {
                    decimalBinaryFontSize = Math.min(decimalBinaryFontSize + 2, 24);
                    this.updateDecimalBinaryFontSize(decimalBinaryFontSize);
                });

                decreaseDecimalBinaryBtn.addEventListener('click', () => {
                    decimalBinaryFontSize = Math.max(decimalBinaryFontSize - 2, 10);
                    this.updateDecimalBinaryFontSize(decimalBinaryFontSize);
                });
            }

            updateDictionaryFontSize(size) {
                const dictionaryItems = document.querySelectorAll('.dictionary-item');
                dictionaryItems.forEach(item => {
                    item.style.fontSize = size + 'px';
                });
            }

            updateBinaryFontSize(size) {
                this.binaryOutput.style.fontSize = size + 'px';
            }

            updateHexFontSize(size) {
                this.hexOutput.style.fontSize = size + 'px';
            }

            updateDecimalBinaryFontSize(size) {
                this.decimalBinaryOutput.style.fontSize = size + 'px';
            }

            initializeCopyButtons() {
                // Botón para copiar texto de entrada binario
                const copyTextInputBtn = document.getElementById('copyTextInput');
                copyTextInputBtn.addEventListener('click', () => {
                    this.copyToClipboard(this.textInput.value, copyTextInputBtn);
                });

                // Botón para copiar resultado binario
                const copyBinaryOutputBtn = document.getElementById('copyBinaryOutput');
                copyBinaryOutputBtn.addEventListener('click', () => {
                    const binaryText = this.binaryOutput.textContent;
                    if (binaryText && binaryText !== 'El binario aparecerá aquí...') {
                        this.copyToClipboard(binaryText, copyBinaryOutputBtn);
                    }
                });

                // Botón para copiar texto de entrada hexadecimal
                const copyTextInputHexBtn = document.getElementById('copyTextInputHex');
                copyTextInputHexBtn.addEventListener('click', () => {
                    this.copyToClipboard(this.textInputHex.value, copyTextInputHexBtn);
                });

                // Botón para copiar resultado hexadecimal
                const copyHexOutputBtn = document.getElementById('copyHexOutput');
                copyHexOutputBtn.addEventListener('click', () => {
                    const hexText = this.hexOutput.textContent;
                    if (hexText && hexText !== 'El hexadecimal aparecerá aquí...') {
                        this.copyToClipboard(hexText, copyHexOutputBtn);
                    }
                });

                // Botón para copiar entrada decimal
                const copyDecimalInputBtn = document.getElementById('copyDecimalInput');
                copyDecimalInputBtn.addEventListener('click', () => {
                    this.copyToClipboard(this.decimalInput.value, copyDecimalInputBtn);
                });

                // Botón para copiar resultado decimal a binario
                const copyDecimalBinaryOutputBtn = document.getElementById('copyDecimalBinaryOutput');
                copyDecimalBinaryOutputBtn.addEventListener('click', () => {
                    const decimalBinaryText = this.decimalBinaryOutput.textContent;
                    if (decimalBinaryText && decimalBinaryText !== 'El binario aparecerá aquí...') {
                        this.copyToClipboard(decimalBinaryText, copyDecimalBinaryOutputBtn);
                    }
                });
            }

            async copyToClipboard(text, button) {
                try {
                    await navigator.clipboard.writeText(text);
                    
                    // Cambiar el estilo del botón temporalmente
                    button.classList.add('copied');
                    const originalText = button.innerHTML;
                    button.innerHTML = '✓';
                    
                    setTimeout(() => {
                        button.classList.remove('copied');
                        button.innerHTML = originalText;
                    }, 1000);
                    
                } catch (err) {
                    // Fallback para navegadores que no soportan clipboard API
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    // Cambiar el estilo del botón temporalmente
                    button.classList.add('copied');
                    const originalText = button.innerHTML;
                    button.innerHTML = '✓';
                    
                    setTimeout(() => {
                        button.classList.remove('copied');
                        button.innerHTML = originalText;
                    }, 1000);
                }
            }

            convertToBinary() {
                const text = this.textInput.value;
                if (!text) {
                    this.binaryOutput.textContent = 'El binario aparecerá aquí...';
                    return;
                }

                const binaryResult = text.split('').map(char => {
                    const binary = char.charCodeAt(0).toString(2).padStart(8, '0');
                    return binary;
                }).join(' ');

                this.binaryOutput.textContent = binaryResult;
            }

            convertToHex() {
                const text = this.textInputHex.value;
                if (!text) {
                    this.hexOutput.textContent = 'El hexadecimal aparecerá aquí...';
                    return;
                }

                const hexResult = text.split('').map(char => {
                    const hex = char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0');
                    return hex;
                }).join(' ');

                this.hexOutput.textContent = hexResult;
            }

            convertDecimalToBinary() {
                const input = this.decimalInput.value.trim().toUpperCase();
                if (!input) {
                    this.decimalBinaryOutput.textContent = 'El binario aparecerá aquí...';
                    return;
                }

                try {
                    let decimalValue;
                    
                    // Verificar si es un número hexadecimal (contiene A-F)
                    if (/[A-F]/.test(input)) {
                        // Es hexadecimal
                        decimalValue = parseInt(input, 16);
                    } else {
                        // Es decimal
                        decimalValue = parseInt(input, 10);
                    }

                    // Validar rango (0-255 para 8 bits)
                    if (isNaN(decimalValue) || decimalValue < 0 || decimalValue > 255) {
                        this.decimalBinaryOutput.textContent = 'Error: Ingresa un valor entre 0-255 o A-FF';
                        return;
                    }

                    // Convertir a binario de 8 bits con espacios cada 4 bits
                    const binaryString = decimalValue.toString(2).padStart(8, '0');
                    const formattedBinary = binaryString.substring(0, 4) + ' ' + binaryString.substring(4);
                    
                    this.decimalBinaryOutput.textContent = formattedBinary;
                    
                } catch (error) {
                    this.decimalBinaryOutput.textContent = 'Error: Formato inválido';
                }
            }

            generateCharacterDictionary() {
                const dictionary = new Map();
                let index = 0;

                // Alfabeto en mayúsculas (A=0, B=1, ..., Z=25)
                for (let i = 65; i <= 90; i++) {
                    const char = String.fromCharCode(i);
                    if (char !== 'Ñ') { // Excluir la Ñ
                        dictionary.set(char, index++);
                    }
                }

                // Alfabeto en minúsculas (a=26, b=27, ..., z=51) - excluyendo ñ
                if (this.showLowercase.checked) {
                    for (let i = 97; i <= 122; i++) {
                        const char = String.fromCharCode(i);
                        if (char !== 'ñ') { // Excluir la ñ
                            dictionary.set(char, index++);
                        }
                    }
                }

                // Números (0=52, 1=53, ..., 9=61)
                if (this.showNumbers.checked) {
                    for (let i = 48; i <= 57; i++) {
                        dictionary.set(String.fromCharCode(i), index++);
                    }
                }

                // Espacio ( =62)
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

            updateDictionary() {
                const dictionary = this.generateCharacterDictionary();
                this.renderDictionary(dictionary);
            }

            renderDictionary(dictionary) {
                this.dictionary.innerHTML = '';
                
                if (dictionary.size === 0) {
                    this.dictionary.innerHTML = '<p style="text-align: center; color: #666;">No hay caracteres seleccionados</p>';
                    return;
                }

                // Convertir Map a array y ordenar por valor numérico
                const sortedEntries = Array.from(dictionary.entries())
                    .sort((a, b) => a[1] - b[1]);

                sortedEntries.forEach(([char, number]) => {
                    const item = document.createElement('div');
                    item.className = 'dictionary-item';
                    
                    const displayChar = char === ' ' ? '(espacio)' : char;
                    
                    item.innerHTML = `
                        <span class="char">${displayChar}</span>
                        <span class="number">${number}</span>
                    `;
                    
                    this.dictionary.appendChild(item);
                });
            }
        }

        // Inicializar la aplicación cuando se carga la página
        document.addEventListener('DOMContentLoaded', () => {
            new TextToBinaryConverter();
        });