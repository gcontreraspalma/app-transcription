import os
from pydub import AudioSegment

# Configuración de rutas
input_folder = "seleccionados/"
output_folder = "convertidos/"

# Crear carpeta de salida si no existe
os.makedirs(output_folder, exist_ok=True)

def convertir_audios(input_folder, output_folder, formato="wav"):
    # Iterar sobre todos los archivos en la carpeta de entrada
    for file_name in os.listdir(input_folder):
        if file_name.endswith(".opus"):
            input_path = os.path.join(input_folder, file_name)
            output_file = os.path.splitext(file_name)[0] + f".{formato}"
            output_path = os.path.join(output_folder, output_file)

            try:
                # Cargar archivo .opus y exportarlo en el formato deseado
                audio = AudioSegment.from_file(input_path, format="opus")
                audio.export(output_path, format=formato)
                print(f"Convertido: {file_name} -> {output_file}")
            except Exception as e:
                print(f"Error al convertir {file_name}: {e}")

# Ejecutar la conversión a formato .wav o .mp3
convertir_audios(input_folder, output_folder, formato="wav")  # Cambia a "mp3" si prefieres ese formato
