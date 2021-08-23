import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ConfigService, PermalinkStorageConfig} from '../shared/config.service';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';

const LOCAL_STORAGE_KEY = 'hakenadu/plantuml-editor.storages';

@Component({
  selector: 'app-permalink',
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.scss']
})
export class PermalinkComponent {

  private configStorages: PermalinkStorageConfig[] = [];
  private _cachedStorages: PermalinkStorageConfig[];

  storages: PermalinkStorageConfig[] = [];

  constructor(public matDialogRef: MatDialogRef<PermalinkComponent>,
              public configService: ConfigService) {

    this.configService.config$.subscribe(config => {
      if (config.permalink?.storages) {
        this.configStorages = config.permalink.storages;
        this.updateStorages();
      }
    });

    const cachedStorages = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedStorages) {
      this._cachedStorages = JSON.parse(cachedStorages);
    } else {
      this._cachedStorages = [];
    }
    this.updateStorages();
  }

  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

        });
      }
    }
  }


  private updateStorages() {
    this.storages = [
      ...this.configStorages,
      ...this._cachedStorages
    ];
  }

  get cachedStorages(): PermalinkStorageConfig[] {
    return this._cachedStorages;
  }

  set cachedStorages(cachedStorages: PermalinkStorageConfig[]) {
    this._cachedStorages = cachedStorages;
    if (!this._cachedStorages || this._cachedStorages.length === 0) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cachedStorages));
    }
    this.updateStorages();
  }
}
