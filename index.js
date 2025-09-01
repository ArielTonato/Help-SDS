        class TextToBinaryConverter {
            constructor() {
                this.textInput = document.getElementById('textInput');
                this.binaryOutput = document.getElementById('binaryOutput');
                this.textInputHex = document.getElementById('textInputHex');
                this.hexOutput = document.getElementById('hexOutput');
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

                // Actualizar diccionario cuando cambien los controles
                this.showLowercase.addEventListener('change', () => this.updateDictionary());
                this.showNumbers.addEventListener('change', () => this.updateDictionary());
                this.showSpace.addEventListener('change', () => this.updateDictionary());
                this.initializeSpecialCharsEvents();

                // Controles de tamaño de fuente
                this.initializeFontSizeControls();
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

                let dictFontSize = 14; // Tamaño inicial del diccionario
                let binaryFontSize = 14; // Tamaño inicial del binario
                let hexFontSize = 14; // Tamaño inicial del hexadecimal

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