import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EditorComponent} from './editor/editor.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AngularSplitModule} from 'angular-split';
import {LayoutModule} from '@angular/cdk/layout';
import {AngularResizedEventModule} from 'angular-resize-event';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ImageComponent} from './image/image.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {DescriptionComponent} from './description/description.component';
import {FooterComponent} from './footer/footer.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ExampleDiagramComponent} from './example-diagram/example-diagram.component';
import {MatCardModule} from '@angular/material/card';
import {NgbCarouselModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatDividerModule} from '@angular/material/divider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {ShareComponent} from './share/share.component';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ImageComponent,
    DescriptionComponent,
    FooterComponent,
    ExampleDiagramComponent,
    ShareComponent
  ],
  imports: [
    AngularResizedEventModule,
    AngularSplitModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ClipboardModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.INFO,
      colorScheme: ['purple', 'teal', 'gray', 'gray', 'red', 'red', 'red']
    }),
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    NgbCarouselModule,
    NgbModule,
    ReactiveFormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
