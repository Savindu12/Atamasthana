import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as THREE from 'three';
import { VoiceRecognitionService } from '../services/voice-recognition.service';
import { VoiceTestService } from '../services/voice-test.service';
import { RecordServiceService } from '../services/record-service.service';
import { Router } from '@angular/router';

declare const AFRAME: any;


@Component({
  selector: 'app-bs-five-scene',
  templateUrl: './bs-five-scene.component.html',
  styleUrls: ['./bs-five-scene.component.css']
})
export class BsFiveSceneComponent implements AfterViewInit {
  isRecording = false;
  recognizedText = '';  // To store the recognized text
  mediaRecorder: any;
  audioChunks: any[] = [];  // To store audio chunks
  audioBlob: Blob | null = null;

  constructor(
    private voiceRecognitionService: RecordServiceService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    const component = this; // Reference the Angular component context

    AFRAME.registerComponent('head-look-up', {
      schema: {
        threshold: { type: 'number', default: -0.3 }
      },

      init: function (this: AFrameComponent) {
        this.cameraEl = document.querySelector('a-camera');
      },

      tick: function (this: AFrameComponent) {
        const rotationX = this.cameraEl.object3D.rotation.x;

        if (rotationX < this.data.threshold && !component.isRecording) {
          component.startRecording();
        }
      }
    });

    type AFrameComponent = {
      cameraEl: any;
      data: { threshold: number };
      tick?: (time?: number, timeDelta?: number) => void;
    };

    // Add the component to the camera element
    const cameraEl = document.querySelector('a-camera');
    cameraEl.setAttribute('head-look-up', 'threshold: -0.3');
  }

  // Start recording audio for 10 seconds
  startRecording() {
    this.audioChunks = [];  // Reset chunks

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.isRecording = true;

        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.sendAudio();
        };

        // Stop recording after 10 seconds
        setTimeout(() => this.stopRecording(), 10000);
      })
      .catch(err => {
        console.error('Error accessing microphone:', err);
      });
  }

  // Stop recording audio
  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  // Send audio to Flask API for recognition
  sendAudio() {
    if (this.audioBlob) {
      this.voiceRecognitionService.sendAudioFile(this.audioBlob)
        .subscribe(response => {
          this.recognizedText = response.recognized_text;
          this.processCommand(this.recognizedText);
        }, error => {
          console.error('Error during audio recognition:', error);
        });
    }
  }

  // Process recognized command and navigate
  processCommand(command: string) {
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
      this.router.navigate([`/${route}`]);
      console.log(`Navigating to: /${route}`);
    }
  }
}