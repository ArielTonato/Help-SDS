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
}

export { ConversionUtils };
