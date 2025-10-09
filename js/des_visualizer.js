// Archivo: des_visualizer.js

// Función para convertir texto a binario
function textToBinary(text) {
    return text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
}

// Función para dividir el texto en bloques de 64 bits
function divideIntoBlocks(binaryText) {
    const blocks = [];
    for (let i = 0; i < binaryText.length; i += 64) {
        blocks.push(binaryText.slice(i, i + 64).padEnd(64, '0'));
    }
    return blocks;
}

// Función para realizar la permutación inicial
function initialPermutation(block) {
    const permutationOrder = [
        58, 50, 42, 34, 26, 18, 10, 2,
        60, 52, 44, 36, 28, 20, 12, 4,
        62, 54, 46, 38, 30, 22, 14, 6,
        64, 56, 48, 40, 32, 24, 16, 8,
        57, 49, 41, 33, 25, 17, 9, 1,
        59, 51, 43, 35, 27, 19, 11, 3,
        61, 53, 45, 37, 29, 21, 13, 5,
        63, 55, 47, 39, 31, 23, 15, 7
    ];
    return permutationOrder.map(pos => block[pos - 1]).join('');
}

// Permutación PC1 para la clave
function pc1Permutation(key) {
    console.log('PC1 input:', key, 'Length:', key.length); // Debug
    
    if (key.length !== 64) {
        console.error('PC1 expects 64 bits, got:', key.length);
        // Pad or truncate to 64 bits
        key = key.padEnd(64, '0').slice(0, 64);
        console.log('Adjusted key:', key, 'Length:', key.length);
    }
    
    const result = PC1_ORDER.map(pos => key[pos - 1]).join('');
    console.log('PC1 output:', result, 'Length:', result.length); // Debug
    return result;
}

// Tabla PC-1 (constante global para visualización y uso)
const PC1_ORDER = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4
];

// Horarios de desplazamiento por ronda (1..16)
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

// Calcula los valores Cn, Dn y K_n para cada ronda a partir de la clave (binary 64)
function getRoundDetails(key64) {
    const pc1 = pc1Permutation(key64); // 56 bits
    let C = pc1.slice(0, 28);
    let D = pc1.slice(28);
    const rounds = [];

    // C0/D0 primero
    rounds.push({ round: 0, shift: 0, C: C, D: D, K: null });

    for (let i = 0; i < 16; i++) {
        C = leftShift(C, SHIFTS[i]);
        D = leftShift(D, SHIFTS[i]);
        const combined = C + D;
        const Kn = pc2Permutation(combined);
        rounds.push({ round: i + 1, shift: SHIFTS[i], C: C, D: D, K: Kn });
    }
    return rounds;
}

// Visualizador de PC1: muestra la matriz original 8x8 con índices y la matriz PC1 8x7
function visualizePC1(binaryKey) {
    // Asegurar 64 bits
    const key64 = (binaryKey || '').padEnd(64, '0').slice(0, 64);

    // Matriz original 8x8 con números de posición — versión mejorada
    let originalHTML = '<div class="pc1-visual"><h4>Matriz original de clave (8×8) y posiciones</h4>';
    // Cabecera con índices de columna
    originalHTML += '<table class="pc1-original">';
    originalHTML += '<thead><tr><th></th>';
    for (let c = 0; c < 8; c++) {
        originalHTML += `<th class="col-header">Col ${c + 1}</th>`;
    }
    originalHTML += '</tr></thead><tbody>';

    for (let r = 0; r < 8; r++) {
        originalHTML += `<tr><th class="row-header">Fila ${r + 1}</th>`;
        for (let c = 0; c < 8; c++) {
            const pos = r * 8 + c + 1; // 1-indexed
            const bit = key64[pos - 1];
            const pc1Index = PC1_ORDER.indexOf(pos);
            const isSelected = pc1Index >= 0;
            const cellClass = isSelected ? 'pc1-selected' : 'pc1-parity';
            const badge = isSelected ? `<span class="pc1-badge">${pc1Index + 1}</span>` : `<span class="parity-label">P</span>`;

            originalHTML += `
                <td class="${cellClass}">
                    <div class="cell-top">
                        ${badge}
                        <span class="pos-num">${pos}</span>
                    </div>
                    <div class="bit-val">${bit}</div>
                </td>`;
        }
        originalHTML += '</tr>';
    }
    originalHTML += '</tbody></table></div>';

    // Resultado PC1 en 8x7
    const pc1Result = pc1Permutation(key64);
    const pc1MatrixHTML = '<div class="pc1-result"><h4>Resultado PC1 (8×7)</h4>' + formatAs7x8Matrix(pc1Result) + '</div>';

    // Calcular C0 y D0 (28 bits cada uno) y formatearlos en bloques de 7 bits
    const C0 = pc1Result.slice(0, 28);
    const D0 = pc1Result.slice(28);
    function formatAs7Blocks(bits28) {
        const parts = [];
        for (let i = 0; i < 28; i += 7) {
            parts.push(bits28.slice(i, i + 7));
        }
        return parts.join(' - ');
    }
    const C0Formatted = formatAs7Blocks(C0);
    const D0Formatted = formatAs7Blocks(D0);
    const cdHTML = `
        <div class="pc1-cd">
            <h4>C0 y D0 (28 bits cada uno)</h4>
            <p><strong>C0:</strong> ${C0Formatted}</p>
            <p><strong>D0:</strong> ${D0Formatted}</p>
        </div>`;

    // Explicación breve
    const legend = '<div class="pc1-legend"><p><small>La etiqueta junto a cada bit en la matriz original indica el orden en que PC-1 toma ese bit (1..56). Los bits sin etiqueta son bits de paridad descartados.</small></p></div>';

    return originalHTML + pc1MatrixHTML + cdHTML + legend;
}

// Función de expansión E
function expansionE(block) {
    const eOrder = [
        32, 1, 2, 3, 4, 5,
        4, 5, 6, 7, 8, 9,
        8, 9, 10, 11, 12, 13,
        12, 13, 14, 15, 16, 17,
        16, 17, 18, 19, 20, 21,
        20, 21, 22, 23, 24, 25,
        24, 25, 26, 27, 28, 29,
        28, 29, 30, 31, 32, 1
    ];
    return eOrder.map(pos => block[pos - 1]).join('');
}

// Permutación PC2 para generar subclaves de 48 bits
function pc2Permutation(key56) {
    const pc2Order = [
        14, 17, 11, 24, 1, 5,
        3, 28, 15, 6, 21, 10,
        23, 19, 12, 4, 26, 8,
        16, 7, 27, 20, 13, 2,
        41, 52, 31, 37, 47, 55,
        30, 40, 51, 45, 33, 48,
        44, 49, 39, 56, 34, 53,
        46, 42, 50, 36, 29, 32
    ];
    return pc2Order.map(pos => key56[pos - 1]).join('');
}

// Generar las 16 subclaves
function generateSubkeys(key) {
    console.log('Input key for subkeys:', key, 'Length:', key.length); // Debug
    const pc1Key = pc1Permutation(key);
    console.log('PC1 result:', pc1Key, 'Length:', pc1Key.length); // Debug
    
    if (pc1Key.length !== 56) {
        console.error('PC1 should produce 56 bits, got:', pc1Key.length);
        return [];
    }
    
    const left = pc1Key.slice(0, 28);
    const right = pc1Key.slice(28);
    
    const subkeys = [];
    let currentLeft = left;
    let currentRight = right;
    
    const shifts = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
    
    for (let i = 0; i < 16; i++) {
        currentLeft = leftShift(currentLeft, shifts[i]);
        currentRight = leftShift(currentRight, shifts[i]);
        const combined = currentLeft + currentRight;
        const subkey48 = pc2Permutation(combined); // Aplicar PC2 para obtener 48 bits
        subkeys.push(subkey48);
    }
    
    console.log('Generated subkeys:', subkeys.length); // Debug
    return subkeys;
}

// Función para desplazamiento a la izquierda
function leftShift(bits, positions) {
    return bits.slice(positions) + bits.slice(0, positions);
}

// S-boxes del DES
const sBoxes = [
    // S1
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    // S2
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    // S3
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    // S4
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    // S5
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    // S6
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    // S7
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    // S8
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
];

// Función para aplicar las S-boxes
function applySBoxes(sixBitGroups) {
    const results = [];
    for (let i = 0; i < 8; i++) {
        const group = sixBitGroups[i];
        const row = parseInt(group[0] + group[5], 2); // Primer y último bit
        const col = parseInt(group.slice(1, 5), 2); // Bits del medio
        const sBoxValue = sBoxes[i][row][col];
        results.push(sBoxValue.toString(2).padStart(4, '0'));
    }
    return results;
}

// Función para dividir en grupos de 6 bits
function divideInto6BitGroups(binaryData) {
    const groups = [];
    for (let i = 0; i < binaryData.length; i += 6) {
        groups.push(binaryData.slice(i, i + 6));
    }
    return groups;
}

// Función para convertir cada resultado de S-box a ASCII
function sBoxResultsToAscii(sBoxResults) {
    let asciiChars = '';
    for (const fourBits of sBoxResults) {
        // Convertir 4 bits a 8 bits agregando padding
        const eightBits = fourBits.padStart(8, '0');
        const charCode = parseInt(eightBits, 2);
        // Usar caracteres especiales/emojis
        asciiChars += getSpecialCharacter(charCode);
    }
    return asciiChars;
}

// Función para mostrar las S-boxes y su aplicación con detalle visual
function showSBoxApplication(sixBitGroups, sBoxResults) {
    let html = '<div class="sbox-container">';
    html += '<h4>Aplicación detallada de S-boxes:</h4>';
    
    for (let i = 0; i < 8; i++) {
        const group = sixBitGroups[i];
        const row = parseInt(group[0] + group[5], 2);
        const col = parseInt(group.slice(1, 5), 2);
        const sBoxValue = sBoxes[i][row][col];
        const binaryResult = sBoxResults[i];
        
        // Convertir a ASCII individual
        const paddedBits = binaryResult.padStart(8, '0');
        const charCode = parseInt(paddedBits, 2);
        const asciiChar = getSpecialCharacter(charCode);
        
        html += `
            <div class="sbox-step">
                <h5>S-box ${i + 1}:</h5>
                <p><strong>Entrada (6 bits):</strong> ${group}</p>
                <p><strong>Fila:</strong> ${group[0]}${group[5]} = ${row} (decimal)</p>
                <p><strong>Columna:</strong> ${group.slice(1, 5)} = ${col} (decimal)</p>
                <p><strong>Valor en tabla S${i + 1}[${row}][${col}]:</strong> ${sBoxValue} (decimal)</p>
                <p><strong>Salida (4 bits):</strong> ${binaryResult}</p>
                <p><strong>Extendido a 8 bits:</strong> ${paddedBits}</p>
                <p><strong>Carácter ASCII:</strong> <span class="ascii-char">${asciiChar}</span> (código: ${charCode})</p>
                <div class="sbox-visual">
                    <span class="input-highlight">${group}</span> → 
                    <span class="row-highlight">Fila ${row}</span>, 
                    <span class="col-highlight">Col ${col}</span> → 
                    <span class="output-highlight">${binaryResult}</span> → 
                    <span class="ascii-highlight">${asciiChar}</span>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

// Función para obtener el emoji/carácter especial correspondiente al código ASCII
function getSpecialCharacter(charCode) {
    const specialChars = {
        0: '␀', 1: '☺', 2: '☻', 3: '♥', 4: '♦', 5: '♣', 6: '♠', 7: '•', 8: '◘', 9: '○',
        10: '◙', 11: '♂', 12: '♀', 13: '♪', 14: '♫', 15: '☼', 16: '►', 17: '◄', 18: '↕', 19: '‼',
        20: '¶', 21: '§', 22: '▬', 23: '↨', 24: '↑', 25: '↓', 26: '→', 27: '←', 28: '∟', 29: '↔',
        30: '▲', 31: '▼', 32: ' ', 33: '!', 34: '"', 35: '#', 36: '$', 37: '%', 38: '&', 39: "'",
        40: '(', 41: ')', 42: '*', 43: '+', 44: ',', 45: '-', 46: '.', 47: '/', 48: '0', 49: '1',
        50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9', 58: ':', 59: ';',
        60: '<', 61: '=', 62: '>', 63: '?', 64: '@', 65: 'A', 66: 'B', 67: 'C', 68: 'D', 69: 'E',
        70: 'F', 71: 'G', 72: 'H', 73: 'I', 74: 'J', 75: 'K', 76: 'L', 77: 'M', 78: 'N', 79: 'O',
        80: 'P', 81: 'Q', 82: 'R', 83: 'S', 84: 'T', 85: 'U', 86: 'V', 87: 'W', 88: 'X', 89: 'Y',
        90: 'Z', 91: '[', 92: '\\', 93: ']', 94: '^', 95: '_', 96: '`', 97: 'a', 98: 'b', 99: 'c',
        100: 'd', 101: 'e', 102: 'f', 103: 'g', 104: 'h', 105: 'i', 106: 'j', 107: 'k', 108: 'l', 109: 'm',
        110: 'n', 111: 'o', 112: 'p', 113: 'q', 114: 'r', 115: 's', 116: 't', 117: 'u', 118: 'v', 119: 'w',
        120: 'x', 121: 'y', 122: 'z', 123: '{', 124: '|', 125: '}', 126: '~', 127: '⌂'
    };
    
    return specialChars[charCode] || `[${charCode}]`;
}

// Función para mostrar la comparación antes del XOR
function showXORComparison(expandedR0, selectedSubkey, xorResult) {
    let html = '<div class="xor-comparison">';
    html += '<h4>Comparación bit a bit del XOR:</h4>';
    html += '<div class="xor-table">';
    html += '<table class="comparison-table">';
    html += '<tr><th>Posición</th><th>R0 Expandido</th><th>Subclave</th><th>XOR Resultado</th></tr>';
    
    for (let i = 0; i < Math.min(expandedR0.length, 24); i++) { // Mostrar solo los primeros 24 bits para legibilidad
        html += `<tr>
            <td>${i + 1}</td>
            <td class="bit-0-${expandedR0[i]}">${expandedR0[i]}</td>
            <td class="bit-1-${selectedSubkey[i]}">${selectedSubkey[i]}</td>
            <td class="bit-result-${xorResult[i]}">${xorResult[i]}</td>
        </tr>`;
    }
    
    if (expandedR0.length > 24) {
        html += '<tr><td colspan="4">... (mostrando solo primeros 24 bits)</td></tr>';
    }
    
    html += '</table></div></div>';
    return html;
}

// Función para mostrar datos como matriz 8x8
function formatAs8x8Matrix(binaryData) {
    let matrixHTML = '<div class="matrix-container"><table class="binary-matrix">';
    for (let i = 0; i < 8; i++) {
        matrixHTML += '<tr>';
        for (let j = 0; j < 8; j++) {
            const index = i * 8 + j;
            matrixHTML += `<td>${binaryData[index] || '0'}</td>`;
        }
        matrixHTML += '</tr>';
    }
    matrixHTML += '</table></div>';
    return matrixHTML;
}

// Función para mostrar datos como matriz 8x6 (para expansión E - 48 bits: 8 filas × 6 columnas)
function formatAs6x8Matrix(binaryData) {
    let matrixHTML = '<div class="matrix-container"><table class="binary-matrix">';
    for (let i = 0; i < 8; i++) {
        matrixHTML += '<tr>';
        for (let j = 0; j < 6; j++) {
            const index = i * 6 + j;
            matrixHTML += `<td>${binaryData[index] || '0'}</td>`;
        }
        matrixHTML += '</tr>';
    }
    matrixHTML += '</table></div>';
    return matrixHTML;
}

// Función para mostrar datos como matriz 8x7 (para PC1 - 56 bits: 8 filas × 7 columnas)
function formatAs7x8Matrix(binaryData) {
    let matrixHTML = '<div class="matrix-container"><table class="binary-matrix">';
    for (let i = 0; i < 8; i++) {
        matrixHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            const index = i * 7 + j;
            matrixHTML += `<td>${binaryData[index] || '0'}</td>`;
        }
        matrixHTML += '</tr>';
    }
    matrixHTML += '</table></div>';
    return matrixHTML;
}

// Función para mostrar selección de subclave
function createSubkeySelector(subkeys) {
    let selectorHTML = '<div class="subkey-selector">';
    selectorHTML += '<label for="subkeySelect">Selecciona una subclave (1-16):</label>';
    selectorHTML += '<select id="subkeySelect">';
    for (let i = 0; i < 16; i++) {
        selectorHTML += `<option value="${i}">Subclave ${i + 1}</option>`;
    }
    selectorHTML += '</select></div>';
    return selectorHTML;
}

// Función principal del proceso de cifrado DES paso a paso
function desEncryptionProcess(text, key) {
    const stepsContainer = document.getElementById('encryptionSteps');
    stepsContainer.innerHTML = '';

    // Paso 1: Mensaje en binario
    const binaryText = textToBinary(text);
    const blocks = divideIntoBlocks(binaryText);
    const block = blocks[0]; // Trabajamos con el primer bloque
    
    stepsContainer.innerHTML += `
        <div class="step-container">
            <div class="step-title">Paso 1: Mensaje en binario</div>
            ${formatAs8x8Matrix(block)}
        </div>
    `;

    // Paso 2: Obtener L0 y R0
    const permutedBlock = initialPermutation(block);
    const L0 = permutedBlock.slice(0, 32);
    const R0 = permutedBlock.slice(32);
    
    stepsContainer.innerHTML += `
        <div class="step-container">
            <div class="step-title">Paso 2: Obtener L0 y R0</div>
            <p><strong>L0:</strong> ${L0}</p>
            <p><strong>R0:</strong> ${R0}</p>
        </div>
    `;

    // Paso 3: Permutación E
    const expandedR0 = expansionE(R0);
    stepsContainer.innerHTML += `
        <div class="step-container">
            <div class="step-title">Paso 3: Permutación E (expansión de R0)</div>
            ${formatAs6x8Matrix(expandedR0)}
        </div>
    `;

    // Paso 1 Clave: Clave en binario
    const binaryKey = textToBinary(key);
    stepsContainer.innerHTML += `
        <div class="step-container">
            <div class="step-title">Paso 1 Clave: Clave en binario</div>
            ${formatAs8x8Matrix(binaryKey)}
        </div>
    `;

    // Paso 2 Clave: Matriz PC1 (visualización detallada)
    stepsContainer.innerHTML += `
        <div class="step-container">
            <div class="step-title">Paso 2 Clave: Matriz PC1</div>
            ${visualizePC1(binaryKey)}
        </div>
    `;

    // Mostrar C1..C16 y D1..D16 (en bloques de 7) antes de la generación de subclaves (debe verse antes del Paso 4)
    const roundDetails = getRoundDetails(binaryKey);
    const onlyRounds = roundDetails.filter(d => d.round > 0); // excluir C0/D0
    // Formatear los 28 bits como una línea con guiones entre bloques de 7, y mostrar Cn y Dn en líneas separadas dentro de una caja
    const fmt7Inline = bits => {
        const parts = [];
        for (let i = 0; i < bits.length; i += 7) parts.push(bits.slice(i, i + 7));
        return parts.join(' - ');
    };

    let cdHTML = '<div class="step-container"><div class="step-title">Paso 3 Clave: Rotaciones (C1..C16 y D1..D16)</div>';
    cdHTML += '<div class="cd-grid">';
    onlyRounds.forEach(d => {
        cdHTML += `<div class="cd-item"><p class="cd-line"><strong>C${d.round}:</strong> ${fmt7Inline(d.C)}</p><p class="cd-line"><strong>D${d.round}:</strong> ${fmt7Inline(d.D)}</p></div>`;
    });
    cdHTML += '</div></div>';
    stepsContainer.innerHTML += cdHTML;

    // Paso 4: Generación de las 16 subclaves
    const subkeys = generateSubkeys(binaryKey);
    console.log('Subkeys generated:', subkeys); // Debug
    let subkeysHTML = '<div class="step-container"><div class="step-title">Paso 4: Generación de las 16 subclaves (48 bits cada una)</div>';
    if (subkeys && subkeys.length > 0) {
        subkeys.forEach((subkey, index) => {
            // Dividir la subclave en bloques de 6 bits (48 bits total = 8 bloques de 6)
            const blocks = [];
            for (let i = 0; i < subkey.length; i += 6) {
                blocks.push(subkey.slice(i, i + 6));
            }
            const formattedSubkey = blocks.join(' - ');
            subkeysHTML += `<p><strong>K${index + 1}:</strong> ${formattedSubkey}</p>`;
        });
    } else {
        subkeysHTML += '<p>Error generando subclaves</p>';
    }
    subkeysHTML += '</div>';
    stepsContainer.innerHTML += subkeysHTML;

    // (La visualización de C1..C16 y D1..D16 ya fue insertada anteriormente justo después de PC1)

    // Paso 5: Selección de subclave
    stepsContainer.innerHTML += `
        <div class="step-container">
            <div class="step-title">Paso 5: Elección de subclave</div>
            ${createSubkeySelector(subkeys)}
            <div id="selectedSubkeyDisplay"></div>
        </div>
    `;

    // Agregar evento para mostrar la subclave seleccionada
    setTimeout(() => {
        const selector = document.getElementById('subkeySelect');
        const display = document.getElementById('selectedSubkeyDisplay');
        
        if (!selector || !display) {
            console.error('Elementos no encontrados:', { selector, display });
            return;
        }
        
        selector.addEventListener('change', () => {
            const selectedIndex = parseInt(selector.value);
            const selectedSubkey = subkeys[selectedIndex];
            
            if (!selectedSubkey) {
                console.error('Subclave no encontrada:', selectedIndex);
                return;
            }
            
            console.log('Processing subclave:', selectedIndex, selectedSubkey); // Debug
            
            // Paso 6: XOR entre R0 expandido y subclave
            const xorResult = xorBinary(expandedR0, selectedSubkey);
            
            // Paso 7: División en grupos de 6 bits
            const sixBitGroups = divideInto6BitGroups(xorResult);
            
            // Paso 8: Aplicación de S-boxes
            const sBoxResults = applySBoxes(sixBitGroups);
            const sBoxOutput = sBoxResults.join('');
            
            // Formatear subclave en bloques de 6 separados por ' - '
            const subkeyBlocks = [];
            for (let i = 0; i < selectedSubkey.length; i += 6) {
                subkeyBlocks.push(selectedSubkey.slice(i, i + 6));
            }
            const formattedSubkey = subkeyBlocks.join(' - ');

            display.innerHTML = `
                <p><strong>K${selectedIndex + 1}:</strong> ${formattedSubkey}</p>
                <p><strong>Equivalencia:</strong> K${selectedIndex + 1}</p>
                
                <div class="step-container">
                    <div class="step-title">Paso 6: XOR (R0 expandido ⊕ Subclave)</div>
                    <p><strong>R0 Expandido (48 bits):</strong></p>
                    <div class="binary-output">${expandedR0}</div>
                    <p><strong>Subclave K${selectedIndex + 1} (48 bits):</strong></p>
                    <div class="binary-output">${selectedSubkey}</div>
                    <p><strong>Resultado XOR (48 bits):</strong></p>
                    <div class="binary-output">${xorResult}</div>
                </div>
                
                <div class="step-container">
                    <div class="step-title">Paso 7: División en 8 grupos de 6 bits</div>
                    <div class="groups-display">
                        ${sixBitGroups.map((group, index) => `
                            <div class="group-item">
                                <strong>Grupo ${index + 1} (para S${index + 1}):</strong> ${group}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="step-container">
                    <div class="step-title">Paso 8: Aplicación de S-boxes (S1 a S8)</div>
                    ${showSBoxApplication(sixBitGroups, sBoxResults)}
                    <p><strong>Resultado combinado (32 bits):</strong></p>
                    <div class="binary-output">${sBoxOutput}</div>
                    <p><strong>8 Caracteres ASCII resultantes:</strong></p>
                    <div class="ascii-output">${sBoxResultsToAscii(sBoxResults)}</div>
                    <div class="ascii-detail">
                        <h5>Detalle de cada carácter:</h5>
                        ${sBoxResults.map((result, index) => {
                            const paddedBits = result.padStart(8, '0');
                            const charCode = parseInt(paddedBits, 2);
                            const asciiChar = getSpecialCharacter(charCode);
                            return `<p><strong>S${index + 1}:</strong> ${result} → ${paddedBits} → ${asciiChar} (código ${charCode})</p>`;
                        }).join('')}
                    </div>
                </div>
            `;
        });
        
        // Mostrar la primera subclave por defecto
        selector.dispatchEvent(new Event('change'));
    }, 100);

    // Resultado final
    document.getElementById('encryptedOutput').innerText = 'Proceso DES con S-boxes completado - Selecciona diferentes subclaves para ver las variaciones';
}

// Función XOR entre dos cadenas binarias
function xorBinary(bin1, bin2) {
    let result = '';
    for (let i = 0; i < bin1.length; i++) {
        result += (parseInt(bin1[i]) ^ parseInt(bin2[i])).toString();
    }
    return result;
}

// Evento para iniciar el cifrado
document.getElementById('startEncryption').addEventListener('click', () => {
    const text = document.getElementById('textInput').value;
    const key = document.getElementById('keyInput').value;

    if (text && key.length === 8) {
        desEncryptionProcess(text, key);
    } else {
        alert('Por favor, ingresa un texto y una clave de 8 caracteres.');
    }
});