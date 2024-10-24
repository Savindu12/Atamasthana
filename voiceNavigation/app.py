from flask import Flask, request, jsonify
import os
import speech_recognition as sr
from pydub import AudioSegment
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

# Convert the audio file to WAV format
def convert_to_wav(file_path):
    try:
        audio = AudioSegment.from_file(file_path)
        wav_file_path = file_path.rsplit(".", 1)[0] + ".wav"
        audio.export(wav_file_path, format="wav")
        print(f"Converted file saved at {wav_file_path}")  # Debugging statement
        return wav_file_path
    except Exception as e:
        print(f"Error during conversion: {e}")
        raise

# Function to recognize speech from an audio file
def recognize_speech(audio_file):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio_data = recognizer.record(source)
        try:
            return recognizer.recognize_google(audio_data).lower()
        except sr.UnknownValueError:
            return "Speech not recognized"
        except sr.RequestError as e:
            return f"API request error: {e}"

@app.route('/recognize', methods=['POST'])
def recognize_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Ensure 'uploads' directory exists
    if not os.path.exists('uploads'):
        os.makedirs('uploads')

    # Save the uploaded file temporarily
    file_path = os.path.join('uploads', file.filename)
    file.save(file_path)
    print(f"File saved at {file_path}")  # Debugging statement

    # Convert to WAV format if necessary
    try:
        wav_file_path = convert_to_wav(file_path)
    except Exception as e:
        return jsonify({"error": f"File conversion error: {str(e)}"}), 500

    # Recognize speech from the audio file
    recognized_text = recognize_speech(wav_file_path)

    # Clean up: Remove both the original and the WAV file
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
        if os.path.exists(wav_file_path):
            os.remove(wav_file_path)
        print(f"Files {file_path} and {wav_file_path} removed.")  # Debugging statement
    except Exception as e:
        print(f"Error during file cleanup: {e}")

    return jsonify({"recognized_text": recognized_text})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
