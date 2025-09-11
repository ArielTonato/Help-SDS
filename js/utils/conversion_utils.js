// Utilidades para conversiones
import { CONFIG } from '../const.js';

class ConversionUtils {
    static textToBinary(text) {
        if (!text) return CONFIG.MESS            // Paso 4: Calcular rangos
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
        // Para números muy cercanos a fracciones simples, mostrar la representación exacta
        const tolerance = 1e-12;

        // Buscar fracciones comunes
        const commonFractions = [
            { num: 1, den: 2, str: '0.5' },
            { num: 1, den: 3, str: '0.3333333333333333' },
            { num: 2, den: 3, str: '0.6666666666666666' },
            { num: 1, den: 4, str: '0.25' },
            { num: 3, den: 4, str: '0.75' },
            { num: 1, den: 5, str: '0.2' },
            { num: 2, den: 5, str: '0.4' },
            { num: 3, den: 5, str: '0.6' },
            { num: 4, den: 5, str: '0.8' },
            { num: 1, den: 6, str: '0.16666666666666666' },
            { num: 5, den: 6, str: '0.8333333333333334' },
            { num: 1, den: 7, str: '0.14285714285714285' },
            { num: 2, den: 7, str: '0.2857142857142857' },
            { num: 3, den: 7, str: '0.42857142857142855' },
            { num: 4, den: 7, str: '0.5714285714285714' },
            { num: 5, den: 7, str: '0.7142857142857143' },
            { num: 6, den: 7, str: '0.8571428571428571' },
            { num: 1, den: 8, str: '0.125' },
            { num: 3, den: 8, str: '0.375' },
            { num: 5, den: 8, str: '0.625' },
            { num: 7, den: 8, str: '0.875' },
            { num: 1, den: 9, str: '0.1111111111111111' },
            { num: 2, den: 9, str: '0.2222222222222222' },
            { num: 4, den: 9, str: '0.4444444444444444' },
            { num: 5, den: 9, str: '0.5555555555555556' },
            { num: 7, den: 9, str: '0.7777777777777778' },
            { num: 8, den: 9, str: '0.8888888888888888' },
            { num: 1, den: 10, str: '0.1' },
            { num: 1, den: 11, str: '0.09090909090909091' },
            { num: 2, den: 11, str: '0.18181818181818182' },
            { num: 3, den: 11, str: '0.2727272727272727' },
            { num: 4, den: 11, str: '0.36363636363636365' },
            { num: 5, den: 11, str: '0.45454545454545453' },
            { num: 6, den: 11, str: '0.5454545454545454' },
            { num: 7, den: 11, str: '0.6363636363636364' },
            { num: 8, den: 11, str: '0.7272727272727273' },
            { num: 9, den: 11, str: '0.8181818181818182' },
            { num: 10, den: 11, str: '0.9090909090909091' }
        ];

        for (const fraction of commonFractions) {
            if (Math.abs((fraction.num / fraction.den) - number) < tolerance) {
                return fraction.str;
            }
        }

        // Para otros casos, usar toFixed con precisión limitada
        let str = number.toFixed(Math.min(maxDecimals, 15));

        // Remover ceros finales
        str = str.replace(/\.?0+$/, '');

        // Si no hay parte decimal, agregar .0
        if (!str.includes('.')) {
            str += '.0';
        }

        return str;
    }
}

export { ConversionUtils };
