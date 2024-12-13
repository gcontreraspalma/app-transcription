import os
from groq import Groq

# Configuración de rutas
input_folder = "seleccionados/"  # Carpeta donde están los archivos convertidos
output_folder = "transcripciones/"  # Carpeta donde guardaremos las transcripciones generadas
os.makedirs(output_folder, exist_ok=True)

# Inicializar cliente de Groq
client = Groq(api_key="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")

# Función para transcribir audios
def transcribir_audios(input_folder, output_folder):
    for file in os.listdir(input_folder):
        if file.endswith(".wav") or file.endswith(".mp3"):
            input_path = os.path.join(input_folder, file)
            output_path = os.path.join(output_folder, os.path.splitext(file)[0] + ".txt")

            print(f"Transcribiendo: {file}...")

            try:
                # Abrir el archivo de audio
                with open(input_path, "rb") as audio_file:
                    transcription = client.audio.transcriptions.create(
                        file=(file, audio_file.read()),
                        model="whisper-large-v3",
                        prompt="Eres un asistente experto en resumir contenido educativo. Tu objetivo es leer la transcripción de una clase y generar un resumen claro, conciso y bien estructurado que incluya los puntos principales, conceptos clave y cualquier ejemplo importante mencionado. Usa un tono profesional y organizado.",
                        language="es",
                    )

                # Guardar transcripción en un archivo de texto
                with open(output_path, "w", encoding="utf-8") as f:
                    f.write(transcription.text)

                print(f"Transcripción guardada: {output_path}")

            except Exception as e:
                print(f"Error al transcribir {file}: {e}")

# Ejecutar el proceso de transcripción
transcribir_audios(input_folder, output_folder)
