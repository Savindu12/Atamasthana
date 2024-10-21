import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {
  recognition: any;
  isRecognizing = false;
  recognizedText = ''; // To store the recognized speech

  constructor(private router: Router, private ngZone: NgZone) {
    // Initialize the speech recognition object
    const { webkitSpeechRecognition }: any = window as any;
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'en-US'; // Set language
    this.recognition.interimResults = true; // Allow intermediate results
    this.recognition.maxAlternatives = 1;

    // When recognition gets a result
    this.recognition.onresult = (event: any) => {
      // Update recognized text with the transcript
      this.recognizedText = event.results[0][0].transcript.toLowerCase();

      // Process the final result
      if (event.results[0].isFinal) {
        console.log("Results", this.recognizedText);
        
        this.processCommand(this.recognizedText);
      }
    };
  }

  // Start recognition
  startRecognition() {
    if (!this.isRecognizing) {
      this.recognition.start();
      this.isRecognizing = true;
    }
  }

  // Stop recognition
  stopRecognition() {
    this.recognition.stop();
    this.isRecognizing = false;
  }

  // Process recognized command and navigate
  processCommand(command: string) {
    const routes: any = {
      'harry potter': '',
      'current lowamahapaya': 'current-lowamahapaya',
      'old lowamahapaya': 'old-lowamahapaya',
      'magha invasion': 'magha-invasion',
      'future lowamahapaya': 'future-lowamahapaya',
      'temple inside': 'temple-inside',
      'old inside': 'old-inside',
      'bs five inside': 'bs-five-inside'
    };

    const route = routes[command];
    if (route !== undefined) {
      this.ngZone.run(() => {
        this.router.navigate([`/${route}`]);
      });
    }
  }

  // Get the recognized text for display
  getRecognizedText() {
    return this.recognizedText;
  }
}
