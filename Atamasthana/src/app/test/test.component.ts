import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as THREE from 'three';
import { Router } from '@angular/router';
import { VoiceRecognitionService } from '../services/voice-recognition.service';

declare const AFRAME: any;

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements AfterViewInit {

  allowedArea = {
    minX: -1,  // Set these according to your road positions
    maxX: 1,
    minZ: -7,
    maxZ: 10
  };

  towerPosition = new THREE.Vector3(-4, 0.8, 39); // Tower position
  towerRadius = 5; // Distance to prevent approaching the tower

  constructor(
    public http: HttpClient,
    private firestore: AngularFirestore,
    private router: Router,
 
  ) { }


  async ngAfterViewInit(): Promise<void> {
    const component = this;

    AFRAME.registerComponent('navigate-button', {
      schema: {
        targetScene: {type: 'string'}
      },
    
      init: function () {
        const el = this.el;
        const targetScene = this.data.targetScene;
    
        el.addEventListener('click', () => {
          switch(targetScene) {
            case 'current-lowamahapaya':
              window.location.href = '/current-lowamahapaya';
              break;
            case 'future-scenario':
              window.location.href = '/future-lowamahapaya';
              break;
            case 'old-scenario':
              window.location.href = '/old-lowamahapaya';
              break;
            default:
              console.warn('Scene not defined for target:', targetScene);
          }
        });
      },
    
      navigateToScene: function(scenePath: string) {
        const currentScene = document.getElementById('currentScene');
        if (currentScene) {
          currentScene.setAttribute('gltf-model', scenePath);
        } else {
          console.warn('Element with id "currentScene" not found.');
        }
      }
    });

    AFRAME.registerComponent('oculus-thumbstick-controls', {
      schema: {
        acceleration: { default: 15 },
        rigSelector: { default: "#rig" },
        fly: { default: false },
        controllerOriented: { default: false },
        adAxis: { default: 'x', oneOf: ['x', 'y', 'z'] },
        wsAxis: { default: 'z', oneOf: ['x', 'y', 'z'] },
        enabled: { default: true },
        adEnabled: { default: true },
        adInverted: { default: false },
        wsEnabled: { default: true },
        wsInverted: { default: false }
      },

      init: function () {
        this.easing = 1.1;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.tsData = new THREE.Vector2(0, 0);
        this.thumbstickMoved = this.thumbstickMoved.bind(this);
        this.el.addEventListener('thumbstickmoved', this.thumbstickMoved);

        // Assign the allowed area and tower data from the component
        this.allowedArea = component.allowedArea;
        this.towerPosition = component.towerPosition;
        this.towerRadius = component.towerRadius;
      },

      update: function () {
        this.rigElement = document.querySelector(this.data.rigSelector);
      },

      tick: function (time: any, delta: any) {
        if (!this.el.sceneEl.is('vr-mode')) return;
        var data = this.data;
        var el = this.rigElement;
        var velocity = this.velocity;

        if (!velocity[data.adAxis] && !velocity[data.wsAxis] && !this.tsData.length()) { return; }

        // Update velocity.
        delta = delta / 1000;
        this.updateVelocity(delta);
        if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }

        // Get movement vector and calculate the potential new position.
        var movementVector = this.getMovementVector(delta);
        var potentialPosition = el.object3D.position.clone().add(movementVector);

        // Check if the potential position is within the allowed boundaries.
        if (this.isPositionAllowed(potentialPosition)) {
          // Update position if within allowed area
          el.object3D.position.copy(potentialPosition);
        } else {
          // Stop movement if not allowed
          this.velocity.set(0, 0, 0);
        }
        
      },

      isPositionAllowed: function (position: { x: number; z: number; distanceTo: (arg0: any) => any; }) {
        // Check if the position is within the allowed area (road boundaries)
        if (
          position.x < this.allowedArea.minX ||
          position.x > this.allowedArea.maxX ||
          position.z < this.allowedArea.minZ ||
          position.z > this.allowedArea.maxZ
        ) {
          return false;
        }

        // Check the distance to the tower
        var distanceToTower = position.distanceTo(this.towerPosition);
        if (distanceToTower < this.towerRadius) {
          return false;
        }

        return true;
      },

      updateVelocity: function (delta: any) {
        var acceleration;
        var adAxis;
        var adSign;
        var data = this.data;
        var velocity = this.velocity;
        var wsAxis;
        var wsSign;

        const CLAMP_VELOCITY = 0.00001;

        adAxis = data.adAxis;
        wsAxis = data.wsAxis;

        if (delta > 0.2) {
          velocity[adAxis] = 0;
          velocity[wsAxis] = 0;
          return;
        }

        var scaledEasing = Math.pow(1 / this.easing, delta * 60);

        // Velocity Easing
        if (velocity[adAxis] !== 0) {
          velocity[adAxis] = velocity[adAxis] * scaledEasing;
        }

        if (velocity[wsAxis] !== 0) {
          velocity[wsAxis] = velocity[wsAxis] * scaledEasing;
        }

        // Clamp velocity easing.
        if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) { velocity[adAxis] = 0; }
        if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) { velocity[wsAxis] = 0; }

        if (!data.enabled) { return; }

        // Update velocity based on thumbstick input
        acceleration = data.acceleration;
        if (data.adEnabled && this.tsData.x) {
          adSign = data.adInverted ? -1 : 1;
          velocity[adAxis] += adSign * acceleration * this.tsData.x * delta;
        }
        if (data.wsEnabled && this.tsData.y) {
          wsSign = data.wsInverted ? -1 : 1;
          velocity[wsAxis] += wsSign * acceleration * this.tsData.y * delta;
        }
      },

      getMovementVector: (function () {
        const directionVector = new THREE.Vector3(0, 0, 0);
        const rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

        return function (this: any, delta: number) {
          const rotation = this.el.sceneEl.camera.el.object3D.rotation;
          const velocity = this.velocity;
          let xRotation: number;

          directionVector.copy(velocity);
          directionVector.multiplyScalar(delta);

          if (!rotation) {
            return directionVector;
          }

          xRotation = this.data.fly ? rotation.x : 0;
          rotationEuler.set(xRotation, rotation.y, 0);

          directionVector.applyEuler(rotationEuler);
          return directionVector;
        };
      })(),

      thumbstickMoved: function (evt: any) {
        this.tsData.set(evt.detail.x, evt.detail.y);
      },

      remove: function () {
        this.el.removeEventListener('thumbstickmoved', this.thumbstickMoved);
      }
    });
  }
}
