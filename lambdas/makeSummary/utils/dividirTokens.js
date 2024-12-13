// utils/dividirTokens.js
const { encode, decode } = require('gpt-tokenizer');

function dividirEnBloques(text, maxTokens) {
    const tokens = encode(text);
    const bloques = [];
    for (let i = 0; i < tokens.length; i += maxTokens) {
        const segmento = tokens.slice(i, i + maxTokens);
        bloques.push(decode(segmento));
    }
    return bloques;
}

module.exports = dividirEnBloques; // Exportando la función

