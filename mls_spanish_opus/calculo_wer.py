import os
import pandas as pd
from jiwer import compute_measures

# Configuración de rutas
transcripciones_oficiales = "seleccionados/transcripciones_seleccionadas.txt"  # Archivo con las transcripciones oficiales
transcripciones_whisper = "transcripciones/"  # Carpeta con las transcripciones de Whisper
resultado_csv = "resultado_wer.csv"  # Archivo de salida para los resultados

# Función para calcular el WER y detalles de inserciones, sustituciones y errores
def calcular_wer(oficial_file, whisper_folder, output_csv):
    # Cargar las transcripciones oficiales desde el archivo
    transcripciones_oficiales = {}
    with open(oficial_file, "r", encoding="utf-8") as f:
        for line in f:
            # Suponemos que el archivo tiene formato 'nombre_audio<TAB>transcripción'
            nombre_audio, transcripcion = line.strip().split('\t', 1)
            transcripciones_oficiales[nombre_audio] = transcripcion

    resultados = []
    total_wer = 0
    cantidad_archivos = 0

    # Iterar sobre los archivos de transcripciones de Whisper
    for file in os.listdir(whisper_folder):
        if file.endswith(".txt"):
            whisper_path = os.path.join(whisper_folder, file)
            
            # Comparar sin la extensión '.txt' en el nombre del archivo
            nombre_audio_sin_extension = os.path.splitext(file)[0]

            if nombre_audio_sin_extension in transcripciones_oficiales:
                # Leer la transcripción de Whisper
                with open(whisper_path, "r", encoding="utf-8") as f:
                    hipotesis = f.read().strip()

                # Obtener la transcripción oficial
                referencia = transcripciones_oficiales[nombre_audio_sin_extension]

                # Calcular WER y detalles
                medidas = compute_measures(referencia, hipotesis)
                error_rate = medidas["wer"]
                inserciones = medidas["insertions"]
                sustituciones = medidas["substitutions"]
                eliminaciones = medidas["deletions"]

                # Agregar a los resultados
                resultados.append({
                    "Archivo": file,
                    "WER": error_rate,
                    "Inserciones": inserciones,
                    "Sustituciones": sustituciones,
                    "Eliminaciones": eliminaciones,
                    "Transcripción Oficial": referencia,
                    "Transcripción Whisper": hipotesis
                })

                # Sumar al WER total y contar los archivos procesados
                total_wer += error_rate
                cantidad_archivos += 1

    # Calcular el WER promedio
    if cantidad_archivos > 0:
        wer_promedio = total_wer / cantidad_archivos
    else:
        wer_promedio = 0

    # Mostrar el WER total promedio
    print(f"WER promedio total de la prueba: {wer_promedio:.4f}")

    # Crear un DataFrame y guardar como CSV
    df = pd.DataFrame(resultados)
    df.to_csv(output_csv, index=False, encoding="utf-8")
    print(f"Resultados guardados en {output_csv}")

# Ejecutar la comparación
calcular_wer(transcripciones_oficiales, transcripciones_whisper, resultado_csv)
