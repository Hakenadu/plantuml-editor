import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EditorComponent} from './editor/editor.component';
import {FormsModule} from '@angular/forms';
import {NavbarComponent} from './navbar/navbar.component';
import {PlantumlViewerComponent} from './plantuml-viewer/plantuml-viewer.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    NavbarComponent,
    PlantumlViewerComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
