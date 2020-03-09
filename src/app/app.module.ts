import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CameraFilterComponent } from './camera-filter/camera-filter.component';
import { RecordVideoComponent } from './record-video/record-video.component';
import {FlexLayoutModule} from '@angular/flex-layout';
@NgModule({
  declarations: [
    AppComponent,
    CameraFilterComponent,
    RecordVideoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
