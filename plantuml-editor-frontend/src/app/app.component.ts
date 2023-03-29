import {AfterViewInit, Component, Inject} from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {PlantumlHolder} from './services/plantuml-holder';
import {OverlayContainer} from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {ThemeService} from './services/theme.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {DocumentService} from './services/document.service';
import {IOutputData} from 'angular-split';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

  splitDirection?: 'horizontal' | 'vertical';
  splitPosition?: number;

  constructor(public plantumlHolder: PlantumlHolder,
              private themeService: ThemeService,
              private overlayContainer: OverlayContainer,
              private breakpointObserver: BreakpointObserver,
              private router: Router,
              documentService: DocumentService,
              activatedRoute: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document) {
    this.breakpointObserver
      .observe(['(min-width: 576px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.splitDirection = 'horizontal';
        } else {
          this.splitDirection = 'vertical';
        }
      });

    const splitPositionSubscription = activatedRoute.queryParamMap.pipe(
      filter(params => params.has('split-position')),
      map(params => params.get('split-position')),
      map(splitPosition => splitPosition === null ? undefined : Number.parseFloat(splitPosition)),
      filter(splitPosition => splitPosition !== null)
    ).subscribe(splitPosition => {
      this.splitPosition = splitPosition;
      splitPositionSubscription?.unsubscribe();
    });

    const sharedDocumentSubscription = activatedRoute.queryParamMap.pipe(
      filter(params => params.has('document-id') && params.has('document-key') || params.has('document-source')),
      map(params => {
        return {
          documentId: params.get('document-id'),
          documentKey: params.get('document-key'),
          documentSource: params.get('document-source')
        }
      }),
    ).subscribe(documentReference => {
      sharedDocumentSubscription.unsubscribe();
      router.navigate([], {
        queryParams: {
          'document-id': null,
          'document-key': null,
          'document-source': null
        },
        queryParamsHandling: 'merge'
      });
      if (documentReference.documentId !== null && documentReference.documentKey !== null) {
        documentService.currentDocumentId = documentReference.documentId;
        documentService.currentDocumentKey = documentReference.documentKey;
        const getDocumentSubscription = documentService.getDocument(
          documentReference.documentId,
          documentReference.documentKey
        ).subscribe(plantuml => {
          getDocumentSubscription.unsubscribe();
          this.plantumlHolder.plantuml = plantuml;
          documentService.currentDocumentBasePlantuml = plantuml;
        });
      } else if (documentReference.documentSource !== null) {
        const documentSourceDecoded = atob(documentReference.documentSource);
        this.plantumlHolder.plantuml = documentSourceDecoded;
      }
    });

  }

  ngAfterViewInit() {
    this.updateTheme();
  }

  private applyPrimaryTheme(element: Element, primaryThemeClass: string, secondaryThemeClass: string) {
    element.classList.remove(secondaryThemeClass);
    element.classList.add(primaryThemeClass);
  }

  private applySecondaryTheme(element: Element, primaryThemeClass: string, secondaryThemeClass: string) {
    element.classList.remove(primaryThemeClass);
    element.classList.add(secondaryThemeClass);
  }

  private applyTheme(selectClassName: string, primaryThemeClass: string, secondaryThemeClass: string,
                     applicator: (el: Element, pt: string, st: string) => void) {
    const elements = document.getElementsByClassName(selectClassName);
    for (let elementIndex = 0; elementIndex < elements.length; elementIndex++) {
      const element = elements.item(elementIndex);
      if (element === null) {
        continue;
      }
      applicator(element, primaryThemeClass, secondaryThemeClass);
    }
  }

  private updateTheme(): void {
    const primaryThemeClass = `${this.themeService.primaryTheme}-theme`;
    const secondaryThemeClass = `${this.themeService.secondaryTheme}-theme`;

    this.applyPrimaryTheme(this.overlayContainer.getContainerElement(), primaryThemeClass, secondaryThemeClass);
    this.applyTheme('app-primary-theme', primaryThemeClass, secondaryThemeClass, this.applyPrimaryTheme.bind(this));
    this.applyTheme('app-secondary-theme', primaryThemeClass, secondaryThemeClass, this.applySecondaryTheme.bind(this));
  }

  get leftSplitSize(): number {
    if (this.splitPosition === undefined) {
      return 60;
    }
    return this.splitPosition;
  }

  get rightSplitSize(): number {
    if (this.splitPosition === undefined) {
      return 40;
    }
    return 100 - this.splitPosition;
  }

  onAsSplitDragEnd(splitDragEndEvent: IOutputData) {
    if (!splitDragEndEvent.sizes) {
      return;
    }

    const newSplitPosition = splitDragEndEvent.sizes[0];
    this.router.navigate([], {
      queryParams: {
        'split-position': newSplitPosition
      },
      queryParamsHandling: 'merge'
    });
  }
}

