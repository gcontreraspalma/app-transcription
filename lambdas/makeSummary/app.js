// getProjects.js
const connectToDatabase = require('./utils/mongooseClient');
const Summary = require('./models/Summary');
const jwt = require('jsonwebtoken');
const Groq = require("groq-sdk");
const { encode, decode } = require('gpt-tokenizer');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
}); 

function dividirEnBloques(text, maxTokens) {
    const tokens = encode(text);
    const bloques = [];
    for (let i = 0; i < tokens.length; i += maxTokens) {
        const segmento = tokens.slice(i, i + maxTokens);
        bloques.push(decode(segmento));
    }
    return bloques;
}
exports.handler = async (event) => {
    
    try {
        // Verificar que el token JWT esté presente
        const token = event.headers.authorization?.split(' ')[1];
        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Token no proporcionado' }),
            };
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Token inválido o expirado' }),
            };
        }
        
        const {projectId, transcription} = JSON.parse(event.body)
        console.log(projectId)
        console.log(transcription)
        if(!projectId || !transcription){
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'input no proporcionado' }),
            };
        }
        // Conectar a la base de datos
        await connectToDatabase(process.env.MONGODB_URI);
        const newSummary = new Summary({
            summary: transcription,
            projectId: projectId,
            userId: decoded.id,
            inProgress: true
        });
        await newSummary.save();


        const tokens = encode(transcription);
        console.log("Cantidad total de tokens en la transcripción:", tokens.length);
        // Parámetros del modelo
        const maxSequenceTokens = 8192; // Límite de tokens por solicitud
        const espacioParaRespuesta = 1024; // Tokens reservados para el resumen
        const maxTokensPorBloque = maxSequenceTokens - espacioParaRespuesta; // Tokens permitidos para la transcripción

        // Dividir transcripción en bloques si excede el límite
        const bloques = dividirEnBloques(transcription, maxTokensPorBloque, encode);
        console.log(`Cantidad de bloques generados: ${bloques.length}`);

        let resumenFinal = "";
        //Procesar cada bloque
        for (let i = 0; i < bloques.length; i++) {
            console.log(`Procesando bloque ${i + 1} de ${bloques.length}`);
            const summary = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Eres un asistente experto en resumir contenido educativo. Tu objetivo es leer la transcripción de una clase y generar un resumen claro, conciso y bien estructurado que incluya los puntos principales, conceptos clave y cualquier ejemplo importante mencionado. Usa un tono profesional y organizado.",
                    },
                    {
                        role: "user",
                        content: bloques[i],
                    },
                ],
                model: "llama3-8b-8192",
                temperature: 0.3,
                max_tokens: espacioParaRespuesta,
                top_p: 1,
                stream: false,
            });

            resumenFinal += summary.choices[0].message.content + "\n";
            newSummary.summary = resumenFinal;
            newSummary.inProgress = false;
            await newSummary.save()
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ newSummary }),
        };
    } catch (error) {
        console.error('Error al obtener transcripciones:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};