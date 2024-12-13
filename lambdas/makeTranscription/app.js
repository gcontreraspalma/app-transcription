
const jwt = require('jsonwebtoken');
const Groq = require("groq-sdk");
const Transcription = require('./models/Transcription');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
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

        const { file, prompt, projectId } = JSON.parse(event.body);

        if (!projectId || !transcription) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'projectId y transcription son requeridos' }),
            };
        }



        
        const base64Data = file.split(',')[1];  // Eliminar el encabezado data URI (data:audio/...)
        const fileBuffer = Buffer.from(base64Data, 'base64');  // Crear un buffer con los datos del archivo

        
        //Realizar la transcripción usando la API de Groq
        const transcription = await groq.audio.transcriptions.create({
          file: fileBuffer,  // El archivo que se pasa ahora como buffer
          model: "whisper-large-v3-turbo",  // Modelo de transcripción
          prompt: prompt || "Transcripción de clase",  // Prompt opcional
          response_format: "json",  // Formato de respuesta
          language: "es",  // Idioma
          temperature: 0.0,  // Parámetro opcional para la creatividad de la respuesta
        });

        const transcriptionNew = new Transcription({
            text: transcription.text,
            userId: decoded.id,
            projectId: projectId,
        });
        // Guardar la transcripción en la base de datos
        await transcriptionNew.save();

        // Realizar la llamada a la API externa con fetch
        const response = await fetch('https://pfz12kuoq3.execute-api.us-east-2.amazonaws.com/prod/summary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Incluir el token en los encabezados
            },
            body: JSON.stringify({
                projectId: projectId,
                transcription: transcription.text,
            }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Error al llamar a la API externa:', responseData);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error al procesar el resumen' }),
            };
        }

        console.log('Resumen obtenido:', responseData);

        return {
            statusCode: 200,
            body: JSON.stringify({ transcriptionNew, summary: responseData }),
        };

    } catch (error) {
        console.error('Error al obtener transcripciones:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
};
