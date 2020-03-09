import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CameraFilterComponent } from './camera-filter/camera-filter.component';
import { RecordVideoComponent } from './record-video/record-video.component';


const routes: Routes = [
  {
    path: '',
    redirectTo:'camera-filter',
    pathMatch: 'full'
  },
  {
    path: 'camera-filter',
    component: CameraFilterComponent
  },
  {
    path: 'video',
    component: RecordVideoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
