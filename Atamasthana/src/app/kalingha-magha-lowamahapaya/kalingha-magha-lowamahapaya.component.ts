import { Component, NgZone, OnInit } from '@angular/core';
import { VoiceRecognitionService } from '../services/voice-recognition.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { RecordServiceService } from '../services/record-service.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faMicrophone, faMicrophoneSlash, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kalingha-magha-lowamahapaya',
  templateUrl: './kalingha-magha-lowamahapaya.component.html',
  styleUrls: ['./kalingha-magha-lowamahapaya.component.css']
})
export class KalinghaMaghaLowamahapayaComponent {

  isRecording = false;
  recognizedText = '';  // To store the recognized text
  mediaRecorder: any;
  audioChunks: any[] = [];  // To store audio chunks
  audioBlob: Blob | null = null;

  constructor(private voiceRecognitionService: RecordServiceService,
    private router: Router
  ) {}

  // Start recording audio
  startRecording() {
    this.audioChunks = [];  // Reset chunks

    // Ask for user permissions to access the microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true;

        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);  // Collect chunks of audio
        };

        this.mediaRecorder.onstop = () => {
          // Combine chunks into a single blob (audio file)
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.sendAudio();
        };
      })
      .catch(err => {
        console.error('Error accessing microphone:', err);
      });
  }

  // Stop recording audio
  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();  // Stop recording and trigger onstop event
      this.isRecording = false;
    }
  }

  // Send audio to Flask API for recognition
  sendAudio() {
    if (this.audioBlob) {
      this.voiceRecognitionService.sendAudioFile(this.audioBlob)
        .subscribe(response => {
          this.recognizedText = response.recognized_text;  // Display the recognized text
          this.processCommand(this.recognizedText);  // Process the command if needed
        }, error => {
          console.error('Error during audio recognition:', error);
        });
    }
  }

  // Process recognized command and navigate
  processCommand(command: string) {
    // Define routes that can be matched with spoken commands
    const routes: any = {
      'gryffindor': '',
      'expelliarmus': 'current-lowamahapaya',
      'sectumsempra': 'old-lowamahapaya',
      'magha invasion': 'magha-invasion',
      'obliviate': 'future-lowamahapaya',
      'lumos': 'temple-inside',
      'ascendio': 'old-inside',
      'bs five inside': 'bs-five-inside'
    };

    const route = routes[command.trim().toLowerCase()];
    if (route !== undefined) {
      // Navigate based on recognized command
      // Assuming you have Angular's Router injected
      this.router.navigate([`/${route}`]);
      console.log(`Navigating to: /${route}`);
    }
  }
}
