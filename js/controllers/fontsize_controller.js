import { CONFIG } from '../const.js';
import { DOMUtils } from '../utils/dom_utils.js';
// Manejador de tamaños de fuente
class FontSizeController {
    constructor() {
        this.fontSizes = {
            dictionary: CONFIG.FONT_SIZE.DEFAULT,
            binary: CONFIG.FONT_SIZE.DEFAULT,
            hex: CONFIG.FONT_SIZE.DEFAULT,
            decimalBinary: CONFIG.FONT_SIZE.DEFAULT,
            decimalOctal: CONFIG.FONT_SIZE.DEFAULT,
            modulo: CONFIG.FONT_SIZE.DEFAULT,
            fractionalDecimalBinary: CONFIG.FONT_SIZE.DEFAULT,
            arithmetic: CONFIG.FONT_SIZE.DEFAULT
        };
    }

    initializeControls() {
        this.setupFontControls('Dict', 'dictionary', () => DOMUtils.querySelectorAll('.dictionary-item'));
        this.setupFontControls('Binary', 'binary', () => [DOMUtils.getElementById('binaryOutput')]);
        this.setupFontControls('Hex', 'hex', () => [DOMUtils.getElementById('hexOutput')]);
        this.setupFontControls('DecimalBinary', 'decimalBinary', () => [DOMUtils.getElementById('decimalBinaryOutput')]);
        this.setupFontControls('DecimalOctal', 'decimalOctal', () => [DOMUtils.getElementById('decimalOctalOutput')]);
        this.setupFontControls('Modulo', 'modulo', () => [DOMUtils.getElementById('moduloOutput')]);
        this.setupFontControls('FractionalDecimalBinary', 'fractionalDecimalBinary', () => [DOMUtils.getElementById('fractionalDecimalBinaryOutput')]);
        this.setupFontControls('Arithmetic', 'arithmetic', () => [DOMUtils.getElementById('arithmeticTable')]);
    }

    setupFontControls(suffix, property, getElements) {
        const increaseBtn = DOMUtils.getElementById(`increase${suffix}Font`);
        const decreaseBtn = DOMUtils.getElementById(`decrease${suffix}Font`);

        increaseBtn?.addEventListener('click', () => {
            this.fontSizes[property] = Math.min(this.fontSizes[property] + CONFIG.FONT_SIZE.STEP, CONFIG.FONT_SIZE.MAX);
            DOMUtils.setFontSize(getElements(), this.fontSizes[property]);
        });

        decreaseBtn?.addEventListener('click', () => {
            this.fontSizes[property] = Math.max(this.fontSizes[property] - CONFIG.FONT_SIZE.STEP, CONFIG.FONT_SIZE.MIN);
            DOMUtils.setFontSize(getElements(), this.fontSizes[property]);
        });
    }
}

export { FontSizeController };