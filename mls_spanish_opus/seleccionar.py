import os
import random
import shutil

# Configuración de rutas
test_audio_folder = "test/audio/"  # Ruta raíz de los audios
output_folder = "seleccionados/"
reference_file = "test/transcripts.txt"

def seleccionar_y_copiar_audios(audio_folder, ref_file, output_folder, n=180):
    # Leer las transcripciones y extraer los nombres de archivo
    with open(ref_file, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    referencias = {}
    for line in lines:
        parts = line.strip().split("\t")
        if len(parts) == 2:  # Validar formato esperado
            audio_id, transcription = parts
            referencias[audio_id] = transcription

    # Asegurar que haya suficientes audios disponibles
    total_audios = len(referencias)
    if n > total_audios:
        raise ValueError(f"No hay suficientes archivos disponibles ({total_audios}) para seleccionar {n}.")

    # Seleccionar archivos al azar
    seleccionados = random.sample(list(referencias.keys()), n)

    # Crear carpeta de salida si no existe
    os.makedirs(output_folder, exist_ok=True)

    # Copiar archivos seleccionados y guardar sus transcripciones
    transcripciones_seleccionadas = []
    for audio_id in seleccionados:
        folder, subfolder, file_name = audio_id.split("_")
        src_path = os.path.join(audio_folder, folder, subfolder, f"{audio_id}.opus")
        dest_path = os.path.join(output_folder, f"{audio_id}.opus")
        
        # Copiar archivo de audio
        shutil.copy2(src_path, dest_path)
        
        # Guardar transcripción
        transcripciones_seleccionadas.append(f"{audio_id}\t{referencias[audio_id]}\n")

    # Guardar transcripciones seleccionadas en un archivo
    with open(os.path.join(output_folder, "transcripciones_seleccionadas.txt"), "w", encoding="utf-8") as f:
        f.writelines(transcripciones_seleccionadas)

# Ejecutar la función
seleccionar_y_copiar_audios(test_audio_folder, reference_file, output_folder)
