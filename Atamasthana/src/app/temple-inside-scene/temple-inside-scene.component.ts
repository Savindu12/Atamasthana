import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as THREE from 'three';

declare const AFRAME: any;

@Component({
  selector: 'app-temple-inside-scene',
  templateUrl: './temple-inside-scene.component.html',
  styleUrls: ['./temple-inside-scene.component.css']
})
export class TempleInsideSceneComponent implements AfterViewInit {

  constructor(
    public http: HttpClient,
    private firestore: AngularFirestore
  ) { }

  async ngAfterViewInit(): Promise<void> {

    AFRAME.registerComponent('oculus-thumbstick-controls', {
      
      schema: {
        acceleration: { default: 45 },
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
        this.thumbstickMoved = this.thumbstickMoved.bind(this)
        this.el.addEventListener('thumbstickmoved', this.thumbstickMoved);
        
      },


      update: function () {
        this.rigElement = document.querySelector(this.data.rigSelector)
      },


      tick: function (time: any, delta: any) {

        if (!this.el.sceneEl.is('vr-mode')) return;
        var data = this.data;
        var el = this.rigElement
        var velocity = this.velocity;


        //console.log("here", this.tsData, this.tsData.length())

        if (!velocity[data.adAxis] && !velocity[data.wsAxis] && !this.tsData.length()) { return; }


        // Update velocity.

        delta = delta / 1000;
        this.updateVelocity(delta);
        if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }

        // Get movement vector and translate position.

        el.object3D.position.add(this.getMovementVector(delta));

      },


      updateVelocity: function (delta:any) {

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

        // If FPS too low, reset velocity.

        if (delta > 0.2) {

          velocity[adAxis] = 0;

          velocity[wsAxis] = 0;

          return;

        }


        // https://gamedev.stackexchange.com/questions/151383/frame-rate-independant-movement-with-acceleration

        var scaledEasing = Math.pow(1 / this.easing, delta * 60);

        // Velocity Easing.

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

        // Update velocity using keys pressed.

        acceleration = data.acceleration;

        if (data.adEnabled && this.tsData.x) {

          adSign = data.adInverted ? -1 : 1;

          velocity[adAxis] += adSign * acceleration * this.tsData.x * delta;

        }

        if (data.wsEnabled) {

          wsSign = data.wsInverted ? -1 : 1;

          velocity[wsAxis] += wsSign * acceleration * this.tsData.y * delta;

        }

      },
      

      getMovementVector : (function () {
        const directionVector = new THREE.Vector3(0, 0, 0);
        const rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');
      
        return function (this: MovementContext, delta: number) {
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
    
    interface MovementContext {
      el: {
        sceneEl: {
          camera: {
            el: {
              object3D: {
                rotation: THREE.Euler;
              };
            };
          };
        };
      };
      velocity: THREE.Vector3;
      data: {
        fly: boolean;
      };
    }
  }

}
