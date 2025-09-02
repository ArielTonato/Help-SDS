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
}

export { ConversionUtils };
