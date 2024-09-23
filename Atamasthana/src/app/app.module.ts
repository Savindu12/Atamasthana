import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LeapViewerComponent } from './leap-viewer/leap-viewer.component';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { TestComponent } from './test/test.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TempleInsideSceneComponent } from './temple-inside-scene/temple-inside-scene.component';
import { OldTempleInsideSceneComponent } from './old-temple-inside-scene/old-temple-inside-scene.component';
import { BsFiveSceneComponent } from './bs-five-scene/bs-five-scene.component';
import { CurrentSceneComponent } from './current-scene/current-scene.component';
import { CurrentLowamahapayaComponent } from './current-lowamahapaya/current-lowamahapaya.component';
import { OldLowamahapayaComponent } from './old-lowamahapaya/old-lowamahapaya.component';
import { KalinghaMaghaLowamahapayaComponent } from './kalingha-magha-lowamahapaya/kalingha-magha-lowamahapaya.component';
import { FutureLowamahapayaComponent } from './future-lowamahapaya/future-lowamahapaya.component';

@NgModule({
  declarations: [
    AppComponent,
    LeapViewerComponent,
    TestComponent,
    TempleInsideSceneComponent,
    OldTempleInsideSceneComponent,
    BsFiveSceneComponent,
    CurrentSceneComponent,
    CurrentLowamahapayaComponent,
    OldLowamahapayaComponent,
    KalinghaMaghaLowamahapayaComponent,
    FutureLowamahapayaComponent
  ],
  imports: [
    BrowserModule,
    AngularFireAuthModule,
    MatSelectModule,
    MatFormFieldModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
