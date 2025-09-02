// Constantes de configuración
const CONFIG = {
    FONT_SIZE: {
        MIN: 10,
        MAX: 30,
        DEFAULT: 14,
        STEP: 2
    },
    DECIMAL: {
        MIN: 0,
        MAX: 255
    },
    ASCII: {
        UPPERCASE_START: 65,
        UPPERCASE_END: 90,
        LOWERCASE_START: 97,
        LOWERCASE_END: 122,
        NUMBERS_START: 48,
        NUMBERS_END: 57
    },
    MESSAGES: {
        BINARY_PLACEHOLDER: 'El binario aparecerá aquí...',
        HEX_PLACEHOLDER: 'El hexadecimal aparecerá aquí...',
        OCTAL_PLACEHOLDER: 'El octal aparecerá aquí...',
        MODULO_PLACEHOLDER: 'El resultado aparecerá aquí...',
        DECIMAL_ERROR: 'Error: Ingresa un valor entre 0-255 o A-FF',
        OCTAL_ERROR: 'Error: Ingresa un número decimal válido entre 0-255',
        MODULO_ERROR: 'Error: Ingresa números válidos (el divisor no puede ser 0)',
        FORMAT_ERROR: 'Error: Formato inválido',
        NO_CHARS: 'No hay caracteres seleccionados'
    }
};

export { CONFIG };