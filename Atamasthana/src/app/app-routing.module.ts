import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeapViewerComponent } from './leap-viewer/leap-viewer.component';
import { TestComponent } from './test/test.component';
import { TempleInsideSceneComponent } from './temple-inside-scene/temple-inside-scene.component';
import { OldTempleInsideSceneComponent } from './old-temple-inside-scene/old-temple-inside-scene.component';
import { BsFiveSceneComponent } from './bs-five-scene/bs-five-scene.component';
import { CurrentSceneComponent } from './current-scene/current-scene.component';
import { CurrentLowamahapayaComponent } from './current-lowamahapaya/current-lowamahapaya.component';
import { OldLowamahapayaComponent } from './old-lowamahapaya/old-lowamahapaya.component';
import { KalinghaMaghaLowamahapayaComponent } from './kalingha-magha-lowamahapaya/kalingha-magha-lowamahapaya.component';
import { FutureLowamahapayaComponent } from './future-lowamahapaya/future-lowamahapaya.component';

const routes: Routes = [
  { path: '', component: TestComponent},
  { path: 'current-lowamahapaya', component: CurrentLowamahapayaComponent},
  { path: 'old-lowamahapaya', component: OldLowamahapayaComponent},
  { path: 'magha-invasion', component: KalinghaMaghaLowamahapayaComponent},
  { path: 'future-lowamahapaya', component: FutureLowamahapayaComponent},
  
  { path: 'temple-inside', component: TempleInsideSceneComponent },
  { path: 'old-inside', component: OldTempleInsideSceneComponent },
  { path: 'bs-five-inside', component: BsFiveSceneComponent}
];

//Testing Push

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
