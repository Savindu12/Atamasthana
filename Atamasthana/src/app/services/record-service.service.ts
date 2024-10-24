import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as RecordRTC from 'recordrtc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordServiceService {

  private apiUrl = 'http://127.0.0.1:5000/recognize'; // Flask API endpoint

  constructor(private http: HttpClient) { }

  // Function to send audio file to Flask backend for recognition
  sendAudioFile(audioBlob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav'); // Append the audio file
    
    // Send POST request to Flask API
    return this.http.post<any>(this.apiUrl, formData);
  }
}





