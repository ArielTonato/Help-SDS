// Prueba de la función generateArithmeticTable
import { ConversionUtils } from './js/utils/conversion_utils.js';

console.log('Probando generateArithmeticTable con "ALESSANDRO"');
try {
    const result = ConversionUtils.generateArithmeticTable('ALESSANDRO');
    console.log('Resultado:', result);
} catch (error) {
    console.error('Error:', error);
}
