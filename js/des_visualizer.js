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

// Permutación P (32 bits)
function pPermutation(bits32) {
    const pOrder = [
        16, 7, 20, 21,
        29, 12, 28, 17,
        1, 15, 23, 26,
        5, 18, 31, 10,
        2, 8, 24, 14,
        32, 27, 3, 9,
        19, 13, 30, 6,
        22, 11, 4, 25
    ];
    return pOrder.map(pos => bits32[pos - 1]).join('');
}

// Permutación final (IP^-1)
function finalPermutation(bits64) {
    const ipInv = [
        40, 8, 48, 16, 56, 24, 64, 32,
        39, 7, 47, 15, 55, 23, 63, 31,
        38, 6, 46, 14, 54, 22, 62, 30,
        37, 5, 45, 13, 53, 21, 61, 29,
        36, 4, 44, 12, 52, 20, 60, 28,
        35, 3, 43, 11, 51, 19, 59, 27,
        34, 2, 42, 10, 50, 18, 58, 26,
        33, 1, 41, 9, 49, 17, 57, 25
    ];
    return ipInv.map(pos => bits64[pos - 1]).join('');
}

// Función Feistel: toma R (32 bits) y subclave (48 bits) y devuelve 32 bits
function feistelFunction(R32, subkey48) {
    const expanded = expansionE(R32); // 48 bits
    const xored = xorBinary(expanded, subkey48);
    const groups = divideInto6BitGroups(xored);
    const sresults = applySBoxes(groups).join(''); // 32 bits (8*4)
    const permuted = pPermutation(sresults);
    return permuted;
}

// Encriptar un bloque de 64 bits con la clave (binary 64). Devuelve 64 bits.
function desBlockEncrypt(block64, key64) {
    // Generar subclaves
    const subkeys = generateSubkeys(key64);

    // IP inicial
    const permuted = initialPermutation(block64);
    let L = permuted.slice(0, 32);
    let R = permuted.slice(32);

    for (let i = 0; i < 16; i++) {
        const previousL = L;
        L = R;
        const f = feistelFunction(R, subkeys[i]);
        R = xorBinary(previousL, f);
    }

    // Al finalizar las 16 rondas, combinar R16 + L16 (swap final)
    const preoutput = R + L;
    const cipher64 = finalPermutation(preoutput);
    return cipher64;
}

// Convertir 64-bit binary a hex de 16 dígitos
function binaryToHex(bin64) {
    let hex = '';
    for (let i = 0; i < 64; i += 4) {
        const nibble = bin64.slice(i, i + 4);
        hex += parseInt(nibble, 2).toString(16).padStart(1, '0');
    }
    return hex.toUpperCase();
}

// Dividir texto en bloques de 8 bytes con PKCS#7 (retorna array de 64-bit binary strings)
function divideIntoBlocksPKCS7(text) {
    const encoder = new TextEncoder();
    const bytes = Array.from(encoder.encode(text));
    const padLen = 8 - (bytes.length % 8) || 8;
    for (let i = 0; i < padLen; i++) bytes.push(padLen);
    const blocks = [];
    for (let i = 0; i < bytes.length; i += 8) {
        const chunk = bytes.slice(i, i + 8);
        blocks.push(chunk.map(b => b.toString(2).padStart(8, '0')).join(''));
    }
    return blocks;
}

// CBC encrypt: recibe array de bloques (64-bit binary), clave (64-bit binary), devuelve { ivHex, cipherHexBlocks }
function cbcEncryptBlocks(blocks64, key64) {
    // Generar IV de 8 bytes aleatorio
    const ivBytes = new Uint8Array(8);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(ivBytes);
    } else {
        // Fallback: Math.random
        for (let i = 0; i < 8; i++) ivBytes[i] = Math.floor(Math.random() * 256);
    }
    const ivBin = Array.from(ivBytes).map(b => b.toString(2).padStart(8, '0')).join('');

    const cipherHexBlocks = [];
    const cipherBinBlocks = [];
    let prev = ivBin;
    for (const plain of blocks64) {
        const xored = xorBinary(plain, prev);
        const cipherBin = desBlockEncrypt(xored, key64);
        cipherHexBlocks.push(binaryToHex(cipherBin));
        cipherBinBlocks.push(cipherBin);
        prev = cipherBin;
    }

    return { ivHex: binaryToHex(ivBin), ivBin, cipherHexBlocks, cipherBinBlocks };
}

// ECB encrypt: cifra cada bloque independientemente con DES usando key64
function ecbEncryptBlocks(blocks64, key64) {
    const cipherHexBlocks = [];
    const cipherBinBlocks = [];
    for (const plain of blocks64) {
        const cipherBin = desBlockEncrypt(plain, key64);
        cipherHexBlocks.push(binaryToHex(cipherBin));
        cipherBinBlocks.push(cipherBin);
    }
    return { cipherHexBlocks, cipherBinBlocks };
}

// Convierte un bloque binario de 64 bits en 8 caracteres usando getSpecialCharacter
function binary64ToAsciiString(bin64) {
    const chars = [];
    for (let i = 0; i < 64; i += 8) {
        const byte = bin64.slice(i, i + 8);
        const code = parseInt(byte, 2);
        chars.push(getSpecialCharacter(code));
    }
    return chars.join('');
}

// Convierte un bloque binario de 64 bits a una fila de emojis (uno por byte).
function binary64ToEmojiRow(bin64) {
    const parts = [];
    for (let i = 0; i < 64; i += 8) {
        const byte = bin64.slice(i, i + 8);
        const code = parseInt(byte, 2);
        const rep = getSpecialCharacter(code);
        // extraer emoji si la representación incluye '(char)'
        let emoji = rep;
        const parenIndex = rep.indexOf(' (');
        if (parenIndex !== -1) emoji = rep.slice(0, parenIndex);
        // si la representación es más larga que 2 caracteres, tomar el primer glifo
        if (emoji.length > 2) emoji = emoji[0];
        parts.push(`<span class="emoji-byte">${emoji}</span>`);
    }
    return parts.join(' ');
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
        120: 'x', 121: 'y', 122: 'z', 123: '{', 124: '|', 125: '}', 126: '~', 127: '⌂', 128: 'Ç',
        129: 'ü', 130: 'é', 131: 'â', 132: 'ä', 133: 'à', 134: 'å', 135: 'ç', 136: 'ê', 137: 'ë', 138: 'è',
        139: 'ï', 140: 'î', 141: 'ì', 142: 'Ä', 143: 'Å', 144: 'É', 145: 'æ', 146: 'Æ', 147: 'ô', 148: 'ö',
        149: 'ò', 150: 'û', 151: 'ù', 152: 'ÿ', 153: 'Ö', 154: 'Ü', 155: 'ø', 156: '£', 157: 'Ø', 158: '×',
        159: 'ƒ', 160: 'á', 161: 'í', 162: 'ó', 163: 'ú', 164: 'ñ', 165: 'Ñ', 166: 'ª', 167: 'º', 168: '¿',
        169: '®', 170: '¬', 171: '½', 172: '¼', 173: '¡', 174: '«', 175: '»', 176: '░', 177: '▒', 178: '▓',
        179: '│', 180: '┤', 181: 'Á', 182: 'Â', 183: 'À', 184: '©', 185: '╣', 186: '║', 187: '╗', 188: '╝',
        189: '¢', 190: '¥', 191: '┐', 192: '└', 193: '┴', 194: '┬', 195: '├', 196: '─', 197: '┼', 198: 'ã',
        199: 'Ã', 200: '╚', 201: '╔', 202: '╩', 203: '╦', 204: '╠', 205: '═', 206: '╬', 207: '¤', 208: 'ð',
        209: 'Ð', 210: 'Ê', 211: 'Ë', 212: 'È', 213: 'ı', 214: 'Í', 215: 'Î', 216: 'Ï', 217: '┘', 218: '┌',
        219: '█', 220: '▄', 221: '¦', 222: 'Ì', 223: '▀', 224: 'Ó', 225: 'ß', 226: 'Ô', 227: 'Ò', 228: 'õ',
        229: 'Õ', 230: 'µ', 231: 'þ', 232: 'Þ', 233: 'Ú', 234: 'Û', 235: 'Ù', 236: 'ý', 237: 'Ý', 238: '¯',
        239: '´', 240: '­', 241: '±', 242: '‗', 243: '¾', 244: '¶', 245: '§', 246: '÷', 247: '¸', 248: '°',
        249: '¨', 250: '·', 251: '¹', 252: '³', 253: '²', 254: '■', 255: ' '
    };
    // Si existe una entrada directa, devolverla
    if (Object.hasOwn(specialChars, charCode)) return specialChars[charCode];

    // Para códigos extendidos (128..255) devolvemos un emoji determinístico y, si existe, el carácter CP437 entre paréntesis
    if (charCode >= 128 && charCode <= 255) {
        const cpChar = specialChars[charCode] || '';
        return cpChar
    }

    return `[${charCode}]`;
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

// Helper: formatea 28 bits en cuatro bloques de 7, unidos con ' - '
function formatAs7BlocksLine(bits28) {
    const parts = [];
    for (let i = 0; i < bits28.length; i += 7) parts.push(bits28.slice(i, i + 7));
    return parts.join(' - ');
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
function desEncryptionProcess(text, key, mode) {
    const stepsContainer = document.getElementById('encryptionSteps');
    stepsContainer.innerHTML = '';

    // Detectar modo si no fue provisto: si existe selector en DOM, usarlo; sino, inferir por longitud
    if (!mode) {
        const selectEl = document.getElementById('modeSelectDES');
        if (selectEl) mode = selectEl.value;
        else mode = (text.length > 8) ? 'cbc' : 'single';
    }

    // Si el modo es CBC (multi-bloques) realizamos el flujo recomendado: PKCS#7 + CBC
    if (mode === 'cbc') {
        // Validaciones
        if (!key || key.length !== 8) {
            alert('Para modo CBC la clave debe tener 8 caracteres.');
            return;
        }

        // Dividir con PKCS#7 (devuelve array de 64-bit binary strings)
        const blocks64 = divideIntoBlocksPKCS7(text);
        const keyBinary = textToBinary(key);

        // Mostrar resumen de bloques de entrada
        let html = `<div class="step-container"><div class="step-title">Modo: PKCS#7 + CBC — Bloques a cifrar (${blocks64.length})</div>`;
        blocks64.forEach((blk, idx) => {
            const chars = binary64ToAsciiString(blk);
            html += `<p><strong>Bloque ${idx + 1} (bin):</strong> <span class="mono">${blk}</span> — <strong>hex:</strong> ${binaryToHex(blk)}</p>`;
            html += `<p><strong>Caracteres (8):</strong> <span class="mono">${chars}</span></p>`;
        });
        html += '</div>';
        stepsContainer.innerHTML += html;

        // Mostrar visualización de clave (PC1, C0/D0, rotaciones y subclaves) una sola vez
        stepsContainer.innerHTML += `
            <div class="step-container">
                <div class="step-title">Clave y Agenda (PC1, C0/D0, Rotaciones, Subclaves)</div>
                ${visualizePC1(keyBinary)}
            </div>
        `;

        const roundDetailsAll = getRoundDetails(keyBinary);
        const onlyRoundsAll = roundDetailsAll.filter(d => d.round > 0);
        let cdHTML = '<div class="step-container"><div class="step-title">Rotaciones (C1..C16 y D1..D16)</div>';
        cdHTML += '<div class="cd-grid">';
        onlyRoundsAll.forEach(d => {
            cdHTML += `<div class="cd-item"><p class="cd-line"><strong>C${d.round}:</strong> ${formatAs7BlocksLine(d.C)}</p><p class="cd-line"><strong>D${d.round}:</strong> ${formatAs7BlocksLine(d.D)}</p></div>`;
        });
        cdHTML += '</div></div>';
        stepsContainer.innerHTML += cdHTML;

        // Mostrar subclaves (texto) una sola vez
        const subkeysAll = generateSubkeys(keyBinary);
        let subkeysHTML = '<div class="step-container"><div class="step-title">Subclaves K1..K16</div>';
        subkeysAll.forEach((subkey, index) => {
            const blocks6 = [];
            for (let j = 0; j < subkey.length; j += 6) blocks6.push(subkey.slice(j, j + 6));
            subkeysHTML += `<p><strong>K${index + 1}:</strong> ${blocks6.join(' - ')}</p>`;
        });
        subkeysHTML += '</div>';
        stepsContainer.innerHTML += subkeysHTML;

    // Función auxiliar que renderiza el proceso completo (similar al modo single) para un bloque dado
    function renderBlockProcess(blk, blkIndex) {
            const permutedBlock = initialPermutation(blk);
            const L0b = permutedBlock.slice(0, 32);
            const R0b = permutedBlock.slice(32);
            const expandedR0b = expansionE(R0b);

            const subkeys = subkeysAll; // ya calculadas

            // Crear IDs únicos por bloque para el selector y display
            const selectorId = `subkeySelect_blk_${blkIndex}`;
            const displayId = `selectedSubkeyDisplay_blk_${blkIndex}`;

            let html = `<div class="step-container"><div class="step-title">Bloque ${blkIndex + 1} — Proceso detallado</div>`;
            html += `<p><strong>Bloque (bin):</strong> <span class="mono">${blk}</span> — <strong>hex:</strong> ${binaryToHex(blk)}</p>`;
            // Mostrar los 8 caracteres resultantes junto al binario
            html += `<p><strong>Caracteres (8):</strong> <span class="mono">${binary64ToAsciiString(blk)}</span></p>`;
            // Fila de emojis por byte (uno por cada octeto)
            html += `<div class="emoji-row" aria-hidden="true">${binary64ToEmojiRow(blk)}</div>`;
            html += `<p><strong>L0:</strong> ${L0b}</p><p><strong>R0:</strong> ${R0b}</p>`;
            html += `<div class="step-sub"><h4>Expansión E de R0</h4>${formatAs6x8Matrix(expandedR0b)}</div>`;

            // Selector y contenedor de resultados por bloque
            html += `<div class="step-container"><div class="step-title">Elección de subclave para Bloque ${blkIndex + 1}</div>`;
            html += `<div class="subkey-selector">`;
            html += `<label for="${selectorId}">Selecciona una subclave (1-16):</label>`;
            html += `<select id="${selectorId}">`;
            for (let s = 0; s < 16; s++) html += `<option value="${s}">Subclave ${s + 1}</option>`;
            html += `</select></div><div id="${displayId}"></div></div>`;

            html += '</div>'; // cierre bloque container
            return { html, selectorId, displayId, expandedR0b, subkeys };
        }
        // Añadir proceso detallado por bloque y enlazar selectores
        function attachBlockSelectorHandler(rendered) {
            setTimeout(() => {
                const sel = document.getElementById(rendered.selectorId);
                const disp = document.getElementById(rendered.displayId);
                if (!sel || !disp) return;

                sel.addEventListener('change', () => {
                    const selectedIndex = parseInt(sel.value);
                    const selectedSubkey = rendered.subkeys[selectedIndex];
                    const xorResult = xorBinary(rendered.expandedR0b, selectedSubkey);
                    const sixBitGroups = divideInto6BitGroups(xorResult);
                    const sBoxResults = applySBoxes(sixBitGroups);
                    const sBoxOutput = sBoxResults.join('');

                    // Formatear subclave en bloques de 6 separados por ' - '
                    const subkeyBlocks = [];
                    for (let i = 0; i < selectedSubkey.length; i += 6) subkeyBlocks.push(selectedSubkey.slice(i, i + 6));
                    const formattedSubkey = subkeyBlocks.join(' - ');

                    let groupsHtml = '';
                    for (let g = 0; g < sixBitGroups.length; g++) {
                        groupsHtml += `<div class="group-item"><strong>Grupo ${g + 1} (S${g + 1}):</strong> ${sixBitGroups[g]}</div>`;
                    }

                    disp.innerHTML = `
                        <p><strong>K${selectedIndex + 1}:</strong> ${formattedSubkey}</p>
                        <div class="step-container">
                            <div class="step-title">XOR (R0 expandido ⊕ Subclave)</div>
                            <p><strong>R0 Expandido (48 bits):</strong></p>
                            <div class="binary-output">${rendered.expandedR0b}</div>
                            <p><strong>Subclave K${selectedIndex + 1} (48 bits):</strong></p>
                            <div class="binary-output">${selectedSubkey}</div>
                            <p><strong>Resultado XOR (48 bits):</strong></p>
                            <div class="binary-output">${xorResult}</div>
                        </div>
                        <div class="step-container">
                            <div class="step-title">Division en 8 grupos de 6 bits</div>
                            <div class="groups-display">${groupsHtml}</div>
                        </div>
                        <div class="step-container">
                            <div class="step-title">Aplicación de S-boxes</div>
                            ${showSBoxApplication(sixBitGroups, sBoxResults)}
                            <p><strong>Resultado combinado (32 bits):</strong></p>
                            <div class="binary-output">${sBoxOutput}</div>
                            <p><strong>8 Caracteres ASCII resultantes:</strong></p>
                            <div class="ascii-output">${sBoxResultsToAscii(sBoxResults)}</div>
                        </div>
                    `;
                });

                // disparar cambio por defecto para mostrar K1
                sel.value = '0';
                sel.dispatchEvent(new Event('change'));
            }, 50);
        }

        // Renderizar todos los paneles de bloques en una grilla para verlos simultáneamente
        let gridHtml = '<div class="blocks-grid">';
        const renderedBlocks = [];
        blocks64.forEach((blk, idx) => {
            const rendered = renderBlockProcess(blk, idx);
            renderedBlocks.push(rendered);
            gridHtml += `<div class="block-panel" id="block_panel_${idx}">${rendered.html}</div>`;
        });
        gridHtml += '</div>';
        stepsContainer.innerHTML += gridHtml;
        // Enlazar selectores tras montar los paneles
        renderedBlocks.forEach(r => attachBlockSelectorHandler(r));

        // Cifrar en CBC y mostrar resumen final (IV + bloques cifrados)
        const result = cbcEncryptBlocks(blocks64, keyBinary);
        let outHtml = '<div class="step-container"><div class="step-title">Resultado CBC (resumen)</div>';
        outHtml += `<p><strong>IV (hex):</strong> ${result.ivHex}</p>`;
        // Mostrar IV también como 8 caracteres especiales
        outHtml += `<p><strong>IV (ASCII especial):</strong> <span class="mono">${binary64ToAsciiString(result.ivBin)}</span></p>`;
        outHtml += '<ol>';
        result.cipherHexBlocks.forEach((ch, i) => {
            const bin = result.cipherBinBlocks[i];
            const ascii = binary64ToAsciiString(bin);
            outHtml += `<li>Bloque ${i + 1}: <strong>hex:</strong> ${ch} — <strong>ASCII especial:</strong> <span class="mono">${ascii}</span></li>`;
        });
        outHtml += '</ol></div>';
        stepsContainer.innerHTML += outHtml;

        document.getElementById('encryptedOutput').innerText = `CBC: ${result.cipherHexBlocks.length} bloques cifrados; IV=${result.ivHex} — ASCII ejemplo: ${binary64ToAsciiString(result.cipherBinBlocks[0] || result.ivBin)}`;
        return;
    }

    // Si el modo es ECB (multi-bloques sin encadenamiento)
    if (mode === 'ecb') {
        if (!key || key.length !== 8) {
            alert('Para modo ECB la clave debe tener 8 caracteres.');
            return;
        }

        // Dividir con PKCS#7
        const blocks64 = divideIntoBlocksPKCS7(text);
        const keyBinary = textToBinary(key);

        // Mostrar resumen de bloques de entrada
        let html = `<div class="step-container"><div class="step-title">Modo: PKCS#7 + ECB — Bloques a cifrar (${blocks64.length})</div>`;
        blocks64.forEach((blk, idx) => {
            html += `<p><strong>Bloque ${idx + 1} (bin):</strong> <span class="mono">${blk}</span> — <strong>hex:</strong> ${binaryToHex(blk)}</p>`;
        });
        html += '</div>';
        stepsContainer.innerHTML += html;

        // Mostrar visualización de clave una sola vez
        stepsContainer.innerHTML += `
            <div class="step-container">
                <div class="step-title">Clave y Agenda (PC1, C0/D0, Rotaciones, Subclaves)</div>
                ${visualizePC1(keyBinary)}
            </div>
        `;

        const roundDetailsAll = getRoundDetails(keyBinary);
        const onlyRoundsAll = roundDetailsAll.filter(d => d.round > 0);
        let cdHTML = '<div class="step-container"><div class="step-title">Rotaciones (C1..C16 y D1..D16)</div>';
        cdHTML += '<div class="cd-grid">';
        onlyRoundsAll.forEach(d => {
            cdHTML += `<div class="cd-item"><p class="cd-line"><strong>C${d.round}:</strong> ${formatAs7BlocksLine(d.C)}</p><p class="cd-line"><strong>D${d.round}:</strong> ${formatAs7BlocksLine(d.D)}</p></div>`;
        });
        cdHTML += '</div></div>';
        stepsContainer.innerHTML += cdHTML;

        // Mostrar subclaves (texto)
        const subkeysAll = generateSubkeys(keyBinary);
        let subkeysHTML = '<div class="step-container"><div class="step-title">Subclaves K1..K16</div>';
        subkeysAll.forEach((subkey, index) => {
            const blocks6 = [];
            for (let j = 0; j < subkey.length; j += 6) blocks6.push(subkey.slice(j, j + 6));
            subkeysHTML += `<p><strong>K${index + 1}:</strong> ${blocks6.join(' - ')}</p>`;
        });
        subkeysHTML += '</div>';
        stepsContainer.innerHTML += subkeysHTML;

        // Renderizar grilla para ECB con detalle por bloque (binario, caracteres, emojis, y selector de subclave)
        let gridHtmlECB = '<div class="blocks-grid">';
        const renderedBlocksECB = [];
        blocks64.forEach((blk, idx) => {
            const permutedBlock = initialPermutation(blk);
            const L0b = permutedBlock.slice(0, 32);
            const R0b = permutedBlock.slice(32);
            const expandedR0b = expansionE(R0b);

            const selectorId = `subkeySelect_ecb_${idx}`;
            const displayId = `selectedSubkeyDisplay_ecb_${idx}`;

            // calcular cipher real para este bloque
            const cipherBin = desBlockEncrypt(blk, keyBinary);
            const cipherHex = binaryToHex(cipherBin);
            const cipherChars = binary64ToAsciiString(cipherBin);
            const cipherEmojiRow = binary64ToEmojiRow(cipherBin);

            let html = `<div class="step-container"><div class="step-title">Bloque ${idx + 1} — Proceso detallado (ECB)</div>`;
            html += `<p><strong>Bloque (bin):</strong> <span class="mono">${blk}</span> — <strong>hex:</strong> ${binaryToHex(blk)}</p>`;
            html += `<p><strong>Caracteres (8):</strong> <span class="mono">${binary64ToAsciiString(blk)}</span></p>`;
            html += `<div class="emoji-row" aria-hidden="true">${binary64ToEmojiRow(blk)}</div>`;
            html += `<p><strong>L0:</strong> ${L0b}</p><p><strong>R0:</strong> ${R0b}</p>`;
            html += `<div class="step-sub"><h4>Expansión E de R0</h4>${formatAs6x8Matrix(expandedR0b)}</div>`;

            // Selector y contenedor de resultados por bloque
            html += `<div class="step-container"><div class="step-title">Elección de subclave para Bloque ${idx + 1}</div>`;
            html += `<div class="subkey-selector">`;
            html += `<label for="${selectorId}">Selecciona una subclave (1-16):</label>`;
            html += `<select id="${selectorId}">`;
            for (let s = 0; s < 16; s++) html += `<option value="${s}">Subclave ${s + 1}</option>`;
            html += `</select></div><div id="${displayId}"></div></div>`;

            // Mostrar resultado final del cifrado del bloque
            html += `<div class="step-container"><h4>Resultado final (ECB)</h4>`;
            html += `<p><strong>Cipher (hex):</strong> ${cipherHex}</p>`;
            html += `<p><strong>Cipher (ASCII especial):</strong> <span class="mono">${cipherChars}</span></p>`;
            html += `<div class="emoji-row" aria-hidden="true">${cipherEmojiRow}</div>`;
            html += `</div>`;

            html += '</div>'; // cierre bloque container

            renderedBlocksECB.push({ html, selectorId, displayId, expandedR0b, subkeys: subkeysAll });
            gridHtmlECB += `<div class="block-panel" id="block_panel_ecb_${idx}">${html}</div>`;
        });
        gridHtmlECB += '</div>';
        stepsContainer.innerHTML += gridHtmlECB;

        // Handler local para mostrar XOR y S-box al seleccionar subclave (igual que CBC)
        function attachECBHandler(rendered) {
            setTimeout(() => {
                const sel = document.getElementById(rendered.selectorId);
                const disp = document.getElementById(rendered.displayId);
                if (!sel || !disp) return;

                sel.addEventListener('change', () => {
                    const selectedIndex = parseInt(sel.value);
                    const selectedSubkey = rendered.subkeys[selectedIndex];
                    const xorResult = xorBinary(rendered.expandedR0b, selectedSubkey);
                    const sixBitGroups = divideInto6BitGroups(xorResult);
                    const sBoxResults = applySBoxes(sixBitGroups);
                    const sBoxOutput = sBoxResults.join('');

                    // Formatear subclave en bloques de 6 separados por ' - '
                    const subkeyBlocks = [];
                    for (let i = 0; i < selectedSubkey.length; i += 6) subkeyBlocks.push(selectedSubkey.slice(i, i + 6));
                    const formattedSubkey = subkeyBlocks.join(' - ');

                    let groupsHtml = '';
                    for (let g = 0; g < sixBitGroups.length; g++) {
                        groupsHtml += `<div class="group-item"><strong>Grupo ${g + 1} (S${g + 1}):</strong> ${sixBitGroups[g]}</div>`;
                    }

                    disp.innerHTML = `
                        <p><strong>K${selectedIndex + 1}:</strong> ${formattedSubkey}</p>
                        <div class="step-container">
                            <div class="step-title">XOR (R0 expandido ⊕ Subclave)</div>
                            <p><strong>R0 Expandido (48 bits):</strong></p>
                            <div class="binary-output">${rendered.expandedR0b}</div>
                            <p><strong>Subclave K${selectedIndex + 1} (48 bits):</strong></p>
                            <div class="binary-output">${selectedSubkey}</div>
                            <p><strong>Resultado XOR (48 bits):</strong></p>
                            <div class="binary-output">${xorResult}</div>
                        </div>
                        <div class="step-container">
                            <div class="step-title">Division en 8 grupos de 6 bits</div>
                            <div class="groups-display">${groupsHtml}</div>
                        </div>
                        <div class="step-container">
                            <div class="step-title">Aplicación de S-boxes</div>
                            ${showSBoxApplication(sixBitGroups, sBoxResults)}
                            <p><strong>Resultado combinado (32 bits):</strong></p>
                            <div class="binary-output">${sBoxOutput}</div>
                            <p><strong>8 Caracteres ASCII resultantes:</strong></p>
                            <div class="ascii-output">${sBoxResultsToAscii(sBoxResults)}</div>
                        </div>
                    `;
                });

                // disparar cambio por defecto para mostrar K1
                sel.value = '0';
                sel.dispatchEvent(new Event('change'));
            }, 50);
        }

        renderedBlocksECB.forEach(r => attachECBHandler(r));

        // Cifrar en ECB
        const result = ecbEncryptBlocks(blocks64, keyBinary);
        let outHtml = '<div class="step-container"><div class="step-title">Resultado ECB (resumen)</div>';
        outHtml += '<ol>';
        result.cipherHexBlocks.forEach((ch, i) => {
            const bin = result.cipherBinBlocks[i];
            const ascii = binary64ToAsciiString(bin);
            const emojiRow = binary64ToEmojiRow(bin);
            outHtml += `
                <li>
                    <div><strong>Bloque ${i + 1} (bin):</strong> <span class="mono">${bin}</span></div>
                    <div class="emoji-row" aria-hidden="true">${emojiRow}</div>
                    <div><strong>hex:</strong> ${ch} — <strong>ASCII especial:</strong> <span class="mono">${ascii}</span></div>
                </li>`;
        });
        outHtml += '</ol></div>';
        stepsContainer.innerHTML += outHtml;

        // También mostrar el resumen ECB en el panel 'Resultado Final' del HTML
        const outSummaryContainer = document.getElementById('encryptedOutput');
        if (outSummaryContainer) {
            outSummaryContainer.innerHTML = outHtml;
        } else {
            document.getElementById('encryptedOutput').innerText = `ECB: ${result.cipherHexBlocks.length} bloques cifrados`;
        }
        return;
    }

    // Modo 'single' (comportamiento original — mostrar detalle paso a paso del primer bloque)
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

    let cdHTML = '<div class="step-container"><div class="step-title">Paso 3 Clave: Rotaciones (C1..C16 y D1..D16)</div>';
    cdHTML += '<div class="cd-grid">';
    onlyRounds.forEach(d => {
        cdHTML += `<div class="cd-item"><p class="cd-line"><strong>C${d.round}:</strong> ${formatAs7BlocksLine(d.C)}</p><p class="cd-line"><strong>D${d.round}:</strong> ${formatAs7BlocksLine(d.D)}</p></div>`;
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