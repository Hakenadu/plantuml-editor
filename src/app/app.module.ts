import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EditorComponent} from './editor/editor.component';
import {ACE_CONFIG, AceConfigInterface, AceModule} from 'ngx-ace-wrapper';
import {FormsModule} from '@angular/forms';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {};

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent
  ],
  imports: [
    AceModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule
  ],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
