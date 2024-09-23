import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
declare const Leap: any;

@Component({
  selector: 'app-leap-viewer',
  templateUrl: './leap-viewer.component.html',
  styleUrls: ['./leap-viewer.component.css']
})
export class LeapViewerComponent implements OnInit, AfterViewInit {

  public q = "0 -38 -86";
  public w: number = -38;
  public e: number = -86;

  // leap controller
  private controller = new Leap.Controller();
  public gesture: string = "No";
  public leftHand: boolean = false;
  public rightHand: boolean = false;

  // dot controllers
  public dotLeft: number = 0;
  public dotTop: number = 0;
  public dotLeftP: number = 0;
  public dotTopP: number = 0;
  public dotColor: string = "blueviolet";
  public dotVisible: boolean = false;

  //variables 
  private grabLock: boolean = false;
  public stageCounts: number[] = [0, 0, 0, 0];

  constructor() {
    this.initLeapMotion();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const shop = document.getElementById('shopSelector')
    shop?.addEventListener('mouseenter', function() {
      console.log("entered");
      
    })
  }

  mapValue(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) {
    // Calculate the percentage of the value within the original range
    const percentage = (value - fromMin) / (fromMax - fromMin);

    // Map the percentage to the new range and return the result
    return (percentage * (toMax - toMin)) + toMin;
  }

  private initLeapMotion() {
    this.controller.connect({
      enableGestures: true,
    });
    this.controller.on('connect', function () {
      console.log("connect");
    });

    this.controller.on('frame', (frame: any) => {
      var appWidth = 1920;
      var appHeight = 1080;
      // detecting hands
      this.leftHand = false;
      this.rightHand = false;
      if (frame.pointables[0]) {
        this.dotVisible = true;
        for (var h = 0; h < frame.hands.length; h++) {
          if (frame.hands[h].type === "left")
            this.leftHand = true;
          if (frame.hands[h].type === "right")
            this.rightHand = true;
        }
        var hand = frame.hands[0];
        var finger = hand.fingers[0];
        // var iBox = frame.interactionBox;
        // var pointable = frame.pointables[0];
        // var leapPoint = pointable.stabilizedTipPosition;
        // var normalizedPoint = iBox.normalizePoint(leapPoint, true);
        // var appX = normalizedPoint[0] * appWidth;
        // var appY = (1 - normalizedPoint[1]) * appHeight;

        var sensitivity = 1.5;
        var iBox = frame.interactionBox;
        var pointable = frame.hands[0];
        var leapPoint = pointable.stabilizedPalmPosition;
        // var normalizedPoint = iBox.normalizePoint(leapPoint, true);
        // Leap.vec3.scale(normalizedPoint, normalizedPoint, sensitivity); //scale
        // var center = sensitivity * .5 - .5;
        // Leap.vec3.subtract(normalizedPoint, normalizedPoint, [center, center, center]); // re-center

        // var appX = normalizedPoint[0] * appWidth;
        // var appY = (1 - normalizedPoint[1]) * appHeight;
        // var appZ =  normalizedPoint[2] * appHeight;
        // this.dotLeft = appX
        // this.dotTop = appZ
        // this.dotLeftP = Math.round(appX);
        // this.dotTopP = Math.round(appY);




        var normalized = iBox.normalizePoint(leapPoint, false);
        var z = normalized[2] * 0.4;
        // if changing from right-hand to left-hand rule, use:
        //var z = normalized[2] * -1.0;
        //recenter origin
        var x = normalized[0] + 0.5;
        z += 0.5;
        //scale
        x *= 100;
        var y = normalized[1] * 100;
        z *= 100;
        this.dotLeft = x
        this.dotTop = z * 2;
        this.dotLeftP =  Math.round(x);
        this.dotTopP =  Math.round(z);

        var newX = this.mapValue(this.dotLeftP, 0, 170, -100, 100);
        var newY = this.mapValue(this.dotTopP, 20, 130, -70, 70);

        const specificationPlane = document.getElementById('specificationPopupHand');
        //85r
        //  specificationPlane?.setAttribute('position', this.dotLeftP + ' ' + this.dotTopP + ' -90');
        // specificationPlane?.setAttribute('position', -newX + ' ' + -newY + ' -90');
        specificationPlane?.setAttribute('rotation', pointable.yaw() * (180 / Math.PI) + ' ' + ((pointable.roll() * (180 / Math.PI)) + 0) + ' ' + pointable.pitch() * -100);

       // specificationPlane1?.setAttribute('position', '0 0 0');

        // calculating extended fingers
        var extendedFingers = 0;
        for (var f = 0; f < hand.fingers.length; f++) {
          var finger = hand.fingers[f];
          if (finger.extended) extendedFingers++;
        }

        if (this.grabLock) {
          this.changeDotColor(AppComponent.DOT_MODE_GRAB);
          //*************** */
          // this.grabObject.moveObject(appX - 100, appY - 50);
        }

        if ((extendedFingers === 0) && (this.grabLock === false)) {
          // this.touch(appX, appY);
        }
        else if (extendedFingers === 5) {
          this.grabLock = false;
          //  / this.changeDotColor(AppComponent.DOT_MODE_NORMAL);
          try {
            //*************** */
            //  this.grabObject.locateBlock();
            this.stageCounts = [0, 0, 0, 0,];
            // this.blockSet.forEach(element => {
            //   this.stageCounts[element.instance.blockData.stage]++
            // });
            //*************** */
          } catch (e) { }
        }

        // this.scanPage(appX, appY);
      } else {
        this.dotLeft = 0;
        this.dotTop = 0;
        this.dotLeftP = 0;
        this.dotTopP = 0;
        this.gesture = "No";
        this.dotVisible = false
      }

      if (!this.grabLock)
        if (frame.valid && frame.gestures.length > 0) {
          frame.gestures.forEach((gesture: any) => {
            switch (gesture.type) {
              case "circle":
                this.gesture = "Circle";


                break;
              case "keyTap":
                this.gesture = "Key Tap";
                break;
              case "screenTap":
                this.gesture = "Screen Tap";
                break;
              case "swipe":
                this.gesture = "Swipe";
                break;
              default:
                this.gesture = "No";
                break;
            }
          });
        }
    })


  }

  scanPage(appX: number, appY: number) {
  }

  private touch(positionX: number, positionY: number) {
  }

  changeDotColor(dotSituation: number) {
    switch (dotSituation) {
      case AppComponent.DOT_MODE_HOVER:
        this.dotColor = AppComponent.DOT_COLOR_HOVER;
        break;
      case AppComponent.DOT_MODE_NORMAL:
        this.dotColor = AppComponent.DOT_COLOR_NORMAL;
        break;
      case AppComponent.DOT_MODE_GRAB:
        this.dotColor = AppComponent.DOT_COLOR_GRAB;
        break;
      default:
        this.dotColor = AppComponent.DOT_COLOR_NORMAL;
        break;
    }
  }

}
