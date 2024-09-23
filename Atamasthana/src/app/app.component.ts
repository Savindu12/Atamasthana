import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'aframe-project';

  public static readonly DOT_MODE_HOVER: number = 1;
  public static readonly DOT_MODE_NORMAL: number = 0;
  public static readonly DOT_MODE_GRAB: number = 2;
  public static readonly DOT_COLOR_HOVER: string = "#d35400";
  public static readonly DOT_COLOR_GRAB: string = "#674172"
  public static readonly DOT_COLOR_NORMAL: string = "#1e8bc3";

  ngOnInit(): void {
  }
}
