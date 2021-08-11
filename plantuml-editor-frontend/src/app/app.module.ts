import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EditorComponent} from './editor/editor.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AngularSplitModule} from 'angular-split';
import {LayoutModule} from '@angular/cdk/layout';
import {AngularResizedEventModule} from 'angular-resize-event';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { ImageComponent } from './image/image.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ImageComponent
  ],
  imports: [
    AngularResizedEventModule,
    AngularSplitModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MatButtonToggleModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
