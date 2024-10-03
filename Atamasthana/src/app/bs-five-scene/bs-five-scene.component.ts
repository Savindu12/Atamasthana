import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as THREE from 'three';

declare const AFRAME: any;


@Component({
  selector: 'app-bs-five-scene',
  templateUrl: './bs-five-scene.component.html',
  styleUrls: ['./bs-five-scene.component.css']
})
export class BsFiveSceneComponent implements AfterViewInit {

  constructor(
    public http: HttpClient,
    private firestore: AngularFirestore
  ) { }

  async ngAfterViewInit(): Promise<void> {

    AFRAME.registerComponent('oculus-thumbstick-controls', {

      schema: {
        acceleration: { default: 12 },
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
      },

      update: function () {
        this.rigElement = document.querySelector(this.data.rigSelector);
      },

      tick: function (time: any, delta: any) {
        if (!this.el.sceneEl.is('vr-mode')) return;

        const el = this.rigElement;
        const velocity = this.velocity;

        const LEFT_BOUND = -2.5;  // Left boundary
        const RIGHT_BOUND = 2.5;  // Right boundary

        const currentX = el.object3D.position.x;

        // Restrict movement between the bounds (left and right)
        if (currentX + velocity.x * delta > RIGHT_BOUND) {
          velocity.x = 0;
          el.object3D.position.x = RIGHT_BOUND;
        }
        if (currentX + velocity.x * delta < LEFT_BOUND) {
          velocity.x = 0;
          el.object3D.position.x = LEFT_BOUND;
        }

        // Lantern collision detection
        const lanterns = [
          { position: new THREE.Vector3(-2, 0, -10), radius: 1 },  // Left lantern
          { position: new THREE.Vector3(2, 0, -10), radius: 1 }   // Right lantern
        ];

        lanterns.forEach(lantern => {
          const distance = el.object3D.position.distanceTo(lantern.position);
          if (distance < lantern.radius) {
            velocity.x = 0;
            velocity.z = 0;  // Stop movement upon collision
          }
        });

        if (!velocity[this.data.adAxis] && !velocity[this.data.wsAxis] && !this.tsData.length()) {
          return;
        }

        // Update velocity
        delta = delta / 1000;
        this.updateVelocity(delta);

        if (velocity[this.data.adAxis] || velocity[this.data.wsAxis]) {
          el.object3D.position.add(this.getMovementVector(delta));
        }
      },

      updateVelocity: function (delta: any) {
        const CLAMP_VELOCITY = 0.00001;
        const velocity = this.velocity;
        const data = this.data;

        const scaledEasing = Math.pow(1 / this.easing, delta * 60);

        if (velocity[data.adAxis] !== 0) {
          velocity[data.adAxis] = velocity[data.adAxis] * scaledEasing;
        }

        if (velocity[data.wsAxis] !== 0) {
          velocity[data.wsAxis] = velocity[data.wsAxis] * scaledEasing;
        }

        if (Math.abs(velocity[data.adAxis]) < CLAMP_VELOCITY) {
          velocity[data.adAxis] = 0;
        }

        if (Math.abs(velocity[data.wsAxis]) < CLAMP_VELOCITY) {
          velocity[data.wsAxis] = 0;
        }

        if (!data.enabled) return;

        const acceleration = data.acceleration;
        if (data.adEnabled && this.tsData.x) {
          const adSign = data.adInverted ? -1 : 1;
          velocity[data.adAxis] += adSign * acceleration * this.tsData.x * delta;
        }

        if (data.wsEnabled) {
          const wsSign = data.wsInverted ? -1 : 1;
          velocity[data.wsAxis] += wsSign * acceleration * this.tsData.y * delta;
        }
      },

      getMovementVector: (function () {
        const directionVector = new THREE.Vector3(0, 0, 0);
        const rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

        return function (this: any, delta: number) {
          const rotation = this.el.sceneEl.camera.el.object3D.rotation;
          const velocity = this.velocity;

          directionVector.copy(velocity);
          directionVector.multiplyScalar(delta);

          if (!rotation) return directionVector;

          const xRotation = this.data.fly ? rotation.x : 0;
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
