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
}

export { ConversionUtils };
