// Utilidades para conversiones
import { CONFIG } from '../const.js';

class ConversionUtils {
    static textToBinary(text) {
        if (!text) return CONFIG.MESSAGES.BINARY_PLACEHOLDER;
        
        return text.split('').map(char => 
            char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join(' ');
    }

    static textToHex(text) {
        if (!text) return CONFIG.MESSAGES.HEX_PLACEHOLDER;
        
        return text.split('').map(char => 
            char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')
        ).join(' ');
    }

    static decimalToBinary(input) {
        if (!input) return CONFIG.MESSAGES.BINARY_PLACEHOLDER;

        try {
            const upperInput = input.trim().toUpperCase();
            const isHex = /[A-F]/.test(upperInput);
            const decimalValue = parseInt(upperInput, isHex ? 16 : 10);

            if (isNaN(decimalValue) || decimalValue < CONFIG.DECIMAL.MIN || decimalValue > CONFIG.DECIMAL.MAX) {
                return CONFIG.MESSAGES.DECIMAL_ERROR;
            }

            const binaryString = decimalValue.toString(2).padStart(8, '0');
            return `${binaryString.substring(0, 4)} ${binaryString.substring(4)}`;
        } catch (error) {
            return CONFIG.MESSAGES.FORMAT_ERROR;
        }
    }

    static decimalToOctal(input) {
        if (!input) return CONFIG.MESSAGES.OCTAL_PLACEHOLDER;

        try {
            const decimalValue = parseInt(input.trim(), 10);

            if (isNaN(decimalValue) || decimalValue < CONFIG.DECIMAL.MIN || decimalValue > CONFIG.DECIMAL.MAX) {
                return CONFIG.MESSAGES.OCTAL_ERROR;
            }

            return decimalValue.toString(8);
        } catch (error) {
            return CONFIG.MESSAGES.FORMAT_ERROR;
        }
    }

    static calculateModulo(dividend, divisor) {
        if (!dividend || !divisor) return CONFIG.MESSAGES.MODULO_PLACEHOLDER;

        try {
            const x = parseFloat(dividend.trim());
            const y = parseFloat(divisor.trim());

            if (isNaN(x) || isNaN(y) || y === 0) {
                return CONFIG.MESSAGES.MODULO_ERROR;
            }

            const result = x % y;
            return result.toString();
        } catch (error) {
            return CONFIG.MESSAGES.FORMAT_ERROR;
        }
    }

    static fractionalDecimalToBinary(input) {
        if (!input) return CONFIG.MESSAGES.FRACTIONAL_DECIMAL_BINARY_PLACEHOLDER;

        try {
            const decimal = parseFloat(input.trim());

            if (isNaN(decimal)) {
                return CONFIG.MESSAGES.FRACTIONAL_DECIMAL_ERROR;
            }

            // Separar parte entera y fraccionaria
            const integerPart = Math.floor(Math.abs(decimal));
            const fractionalPart = Math.abs(decimal) - integerPart;
            const isNegative = decimal < 0;

            // Convertir parte entera
            let binaryInteger = '';
            if (integerPart === 0) {
                binaryInteger = '0';
            } else {
                let tempInteger = integerPart;
                while (tempInteger > 0) {
                    binaryInteger = (tempInteger % 2) + binaryInteger;
                    tempInteger = Math.floor(tempInteger / 2);
                }
            }

            // Convertir parte fraccionaria
            let binaryFractional = '';
            let tempFractional = fractionalPart;
            let iteration = 0;
            const maxPrecision = CONFIG.FRACTIONAL_DECIMAL.MAX_PRECISION;

            while (tempFractional > 0 && iteration < maxPrecision) {
                tempFractional *= 2;
                iteration++;

                if (tempFractional >= 1) {
                    binaryFractional += '1';
                    tempFractional -= 1;
                } else {
                    binaryFractional += '0';
                }

                // Prevenir bucles infinitos con números muy pequeños
                if (tempFractional < 1e-15) break;
            }

            // Construir resultado final
            let result = binaryInteger;
            if (binaryFractional) {
                result += '.' + binaryFractional;
            }

            if (isNegative) {
                result = '-' + result;
            }

            return result;
        } catch (error) {
            return CONFIG.MESSAGES.FORMAT_ERROR;
        }
    }

    static generateArithmeticTable(message) {
        if (!message || message === '') {
            return '<div class="table-placeholder">Ingresa un mensaje para generar la tabla</div>';
        }

        try {
            const cleanMessage = message.toUpperCase();
            const totalChars = cleanMessage.length;

            // Paso 1: Obtener caracteres únicos en orden de aparición
            const uniqueChars = [];
            const seen = new Set();
            
            for (const char of cleanMessage) {
                if (!seen.has(char)) {
                    seen.add(char);
                    uniqueChars.push(char);
                }
            }

            // Paso 2: Calcular frecuencias
            const frequencies = {};
            for (const char of uniqueChars) {
                frequencies[char] = (cleanMessage.split(char).length - 1);
            }

            // Paso 3: Calcular probabilidades con precisión
            const probabilities = {};
            for (const char of uniqueChars) {
                probabilities[char] = frequencies[char] / totalChars;
            }

            // Paso 4: Calcular rangos
            const ranges = {};
            let cumulative = 0;

            for (const char of uniqueChars) {
                const start = cumulative;
                const end = cumulative + probabilities[char];
                ranges[char] = { start, end };
                cumulative = end;
            }

            // Paso 5: Calcular límites inferiores y superiores para codificación aritmética
            const arithmeticLimits = {};
            let currentLower = 0;
            let currentUpper = 1;

            for (const char of uniqueChars) {
                const range = ranges[char];
                const newLower = currentLower + (currentUpper - currentLower) * range.start;
                const newUpper = currentLower + (currentUpper - currentLower) * range.end;

                arithmeticLimits[char] = {
                    lower: newLower,
                    upper: newUpper
                };

                // Actualizar límites para el siguiente carácter
                currentLower = newLower;
                currentUpper = newUpper;
            }

            // Generar tabla HTML
            let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Carácter</th>
                            <th>Frecuencia</th>
                            <th>Probabilidad</th>
                            <th>Rango</th>
                            <th>Límite Inferior</th>
                            <th>Límite Superior</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            for (const char of uniqueChars) {
                const freq = frequencies[char];
                const prob = probabilities[char];
                const range = ranges[char];
                const limits = arithmeticLimits[char];

                // Formatear valores con máximo 4 decimales
                const probFormatted = ConversionUtils.formatDecimal(prob, CONFIG.ARITHMETIC.MAX_DECIMALS);
                const startFormatted = ConversionUtils.formatDecimal(range.start, CONFIG.ARITHMETIC.MAX_DECIMALS);
                const endFormatted = ConversionUtils.formatDecimal(range.end, CONFIG.ARITHMETIC.MAX_DECIMALS);
                const lowerFormatted = ConversionUtils.formatDecimal(limits.lower, CONFIG.ARITHMETIC.MAX_DECIMALS);
                const upperFormatted = ConversionUtils.formatDecimal(limits.upper, CONFIG.ARITHMETIC.MAX_DECIMALS);

                // Mostrar espacios como "(espacio)" para mejor legibilidad
                const displayChar = char === ' ' ? '(espacio)' : char;

                tableHTML += `
                    <tr>
                        <td>${displayChar}</td>
                        <td>${freq}</td>
                        <td>${probFormatted}</td>
                        <td>[${startFormatted} - ${endFormatted}]</td>
                        <td>${lowerFormatted}</td>
                        <td>${upperFormatted}</td>
                    </tr>
                `;
            }

            tableHTML += `
                    </tbody>
                </table>
            `;

            return tableHTML;
        } catch (error) {
            return '<div class="table-placeholder">Error al generar la tabla</div>';
        }
    }

    static formatDecimal(number, maxDecimals) {
        // Intentar convertir a fracción exacta
        const fraction = this.decimalToFraction(number);
        if (fraction) {
            return fraction;
        }

        // Si no se puede convertir a fracción simple, usar decimal
        const tolerance = 1e-12;

        // Buscar fracciones comunes
        const commonFractions = [
            { num: 1, den: 2, str: '1/2' },
            { num: 1, den: 3, str: '1/3' },
            { num: 2, den: 3, str: '2/3' },
            { num: 1, den: 4, str: '1/4' },
            { num: 3, den: 4, str: '3/4' },
            { num: 1, den: 5, str: '1/5' },
            { num: 2, den: 5, str: '2/5' },
            { num: 3, den: 5, str: '3/5' },
            { num: 4, den: 5, str: '4/5' },
            { num: 1, den: 6, str: '1/6' },
            { num: 5, den: 6, str: '5/6' },
            { num: 1, den: 7, str: '1/7' },
            { num: 2, den: 7, str: '2/7' },
            { num: 3, den: 7, str: '3/7' },
            { num: 4, den: 7, str: '4/7' },
            { num: 5, den: 7, str: '5/7' },
            { num: 6, den: 7, str: '6/7' },
            { num: 1, den: 8, str: '1/8' },
            { num: 3, den: 8, str: '3/8' },
            { num: 5, den: 8, str: '5/8' },
            { num: 7, den: 8, str: '7/8' },
            { num: 1, den: 9, str: '1/9' },
            { num: 2, den: 9, str: '2/9' },
            { num: 4, den: 9, str: '4/9' },
            { num: 5, den: 9, str: '5/9' },
            { num: 7, den: 9, str: '7/9' },
            { num: 8, den: 9, str: '8/9' },
            { num: 1, den: 10, str: '1/10' },
            { num: 3, den: 10, str: '3/10' },
            { num: 7, den: 10, str: '7/10' },
            { num: 9, den: 10, str: '9/10' }
        ];

        for (const fraction of commonFractions) {
            if (Math.abs((fraction.num / fraction.den) - number) < tolerance) {
                return fraction.str;
            }
        }

        // Para otros casos, usar decimal limitado
        let str = number.toFixed(Math.min(maxDecimals, 15));
        str = str.replace(/\.?0+$/, '');
        if (!str.includes('.')) {
            str += '.0';
        }
        return str;
    }

    static decimalToFraction(decimal) {
        if (decimal === 0) return '0';
        if (decimal === 1) return '1';

        const tolerance = 1e-6;
        let numerator = 1;
        let denominator = 1;

        // Buscar fracción simple usando el algoritmo de fracciones continuas
        for (let d = 1; d <= 1000; d++) {
            for (let n = 1; n < d; n++) {
                if (Math.abs(n / d - decimal) < tolerance) {
                    // Simplificar la fracción
                    const gcd = this.gcd(n, d);
                    const simplifiedNum = n / gcd;
                    const simplifiedDen = d / gcd;
                    
                    if (simplifiedDen <= 100) { // Solo mostrar fracciones con denominador pequeño
                        return `${simplifiedNum}/${simplifiedDen}`;
                    }
                }
            }
        }

        return null; // No se encontró fracción simple
    }

    static gcd(a, b) {
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    static generateAffinArithmeticTable(message) {
        if (!message || message === '') {
            return '<div class="table-placeholder">Ingresa un mensaje para generar la tabla</div>';
        }

        try {
            const cleanMessage = message.toUpperCase();
            const totalChars = cleanMessage.length;

            // Paso 1: Obtener caracteres únicos
            const uniqueChars = [...new Set(cleanMessage.split(''))];

            // Paso 2: Calcular frecuencias
            const frequencies = {};
            for (const char of uniqueChars) {
                frequencies[char] = (cleanMessage.split(char).length - 1);
            }

            // Paso 3: Calcular probabilidades
            const probabilities = {};
            for (const char of uniqueChars) {
                probabilities[char] = frequencies[char] / totalChars;
            }

            // Paso 4: Ordenar alfabéticamente y calcular rangos
            // Separar letras normales de espacios y caracteres especiales
            const normalChars = uniqueChars.filter(char => /^[A-Z]$/.test(char));
            const specialChars = uniqueChars.filter(char => !/^[A-Z]$/.test(char));
            
            // Ordenar letras alfabéticamente, luego agregar espacios y caracteres especiales
            const sortedChars = [...normalChars.sort(), ...specialChars];
            const ranges = {};
            let cumulative = 0;

            for (const char of sortedChars) {
                const start = cumulative;
                const end = cumulative + probabilities[char];
                ranges[char] = { start, end };
                cumulative = end;
            }

            // Generar tabla HTML para frecuencias y rangos
            let tableHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Carácter</th>
                            <th>Frecuencia</th>
                            <th>Probabilidad</th>
                            <th>Rango</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            for (const char of sortedChars) {
                const freq = frequencies[char];
                const prob = probabilities[char];
                const range = ranges[char];

                const probFormatted = this.formatDecimal(prob, CONFIG.ARITHMETIC.MAX_DECIMALS);
                const startFormatted = this.formatDecimal(range.start, CONFIG.ARITHMETIC.MAX_DECIMALS);
                const endFormatted = this.formatDecimal(range.end, CONFIG.ARITHMETIC.MAX_DECIMALS);

                const displayChar = char === ' ' ? '(espacio)' : char;

                tableHTML += `
                    <tr>
                        <td>${displayChar}</td>
                        <td>${freq}</td>
                        <td>${probFormatted}</td>
                        <td>[${startFormatted} - ${endFormatted}]</td>
                    </tr>
                `;
            }

            tableHTML += `
                    </tbody>
                </table>
            `;

            return { tableHTML, ranges, sortedChars };
        } catch (error) {
            return '<div class="table-placeholder">Error al generar la tabla</div>';
        }
    }

    static generateAffinSequenceTable(message) {
        if (!message || message === '') {
            return '<div class="table-placeholder">Ingresa un mensaje para generar la tabla</div>';
        }

        try {
            // Obtener la tabla de rangos
            const tableData = this.generateAffinArithmeticTable(message);
            if (typeof tableData === 'string') {
                return tableData; // Error
            }

            const { ranges } = tableData;
            const cleanMessage = message.toUpperCase();

            // Generar tabla de secuencia
            let sequenceHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Carácter</th>
                            <th>Rango Inicial</th>
                            <th>Rango</th>
                            <th>Nuevo Inferior</th>
                            <th>Nuevo Superior</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            let currentLower = 0;
            let currentUpper = 1;

            for (let i = 0; i < cleanMessage.length; i++) {
                const char = cleanMessage[i];
                const charRange = ranges[char];
                const rangeSize = currentUpper - currentLower;

                const newLower = currentLower + (rangeSize * charRange.start);
                const newUpper = currentLower + (rangeSize * charRange.end);

                const displayChar = char === ' ' ? '(espacio)' : char;
                const initialRangeFormatted = `[${this.formatDecimal(currentLower, CONFIG.ARITHMETIC.MAX_DECIMALS)} - ${this.formatDecimal(currentUpper, CONFIG.ARITHMETIC.MAX_DECIMALS)}]`;
                const rangeSizeFormatted = this.formatDecimal(rangeSize, CONFIG.ARITHMETIC.MAX_DECIMALS);
                const newLowerFormatted = this.formatDecimal(newLower, CONFIG.ARITHMETIC.MAX_DECIMALS);
                const newUpperFormatted = this.formatDecimal(newUpper, CONFIG.ARITHMETIC.MAX_DECIMALS);

                sequenceHTML += `
                    <tr>
                        <td>${displayChar}</td>
                        <td>${initialRangeFormatted}</td>
                        <td>${rangeSizeFormatted}</td>
                        <td>${newLowerFormatted}</td>
                        <td>${newUpperFormatted}</td>
                    </tr>
                `;

                // Actualizar para el siguiente carácter
                currentLower = newLower;
                currentUpper = newUpper;
            }

            sequenceHTML += `
                    </tbody>
                </table>
            `;

            // Calcular el resultado final
            const finalDifference = currentUpper - currentLower;
            const finalValue = (currentUpper + currentLower) / 2;

            const result = {
                sequenceHTML,
                finalLower: currentLower,
                finalUpper: currentUpper,
                finalDifference,
                finalValue
            };

            return result;
        } catch (error) {
            return '<div class="table-placeholder">Error al generar la tabla</div>';
        }
    }

    static generateAffinResult(message) {
        if (!message || message === '') {
            return CONFIG.MESSAGES.AFFIN_RESULT_PLACEHOLDER;
        }

        try {
            const sequenceData = this.generateAffinSequenceTable(message);
            if (typeof sequenceData === 'string') {
                return 'Error al calcular el resultado';
            }

            const { finalLower, finalUpper, finalDifference, finalValue } = sequenceData;

            const finalLowerFormatted = this.formatDecimal(finalLower, CONFIG.ARITHMETIC.MAX_DECIMALS);
            const finalUpperFormatted = this.formatDecimal(finalUpper, CONFIG.ARITHMETIC.MAX_DECIMALS);
            const finalDifferenceFormatted = this.formatDecimal(finalDifference, CONFIG.ARITHMETIC.MAX_DECIMALS);
            const finalValueFormatted = this.formatDecimal(finalValue, CONFIG.ARITHMETIC.MAX_DECIMALS);

            return `
                <div class="result-summary">
                    <h4>Resultado Final de la Codificación:</h4>
                    <p><strong>Nuevo Inferior Final:</strong> ${finalLowerFormatted}</p>
                    <p><strong>Nuevo Superior Final:</strong> ${finalUpperFormatted}</p>
                    <p><strong>Diferencia:</strong> ${finalDifferenceFormatted}</p>
                    <p><strong>Valor para Decodificar:</strong> ${finalValueFormatted}</p>
                </div>
            `;
        } catch (error) {
            return 'Error al calcular el resultado';
        }
    }
}

export { ConversionUtils };
