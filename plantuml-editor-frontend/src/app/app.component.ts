import {AfterViewInit, Component, Inject} from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {PlantumlHolder} from './shared/plantuml-holder';
import {OverlayContainer} from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {ThemeService} from './shared/theme.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {DocumentService} from './share/document.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

  splitDirection?: 'horizontal' | 'vertical';

  constructor(public plantumlHolder: PlantumlHolder,
              private themeService: ThemeService,
              private overlayContainer: OverlayContainer,
              private breakpointObserver: BreakpointObserver,
              documentService: DocumentService,
              activatedRoute: ActivatedRoute,
              router: Router,
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

    const activatedRouteSubscription = activatedRoute.queryParamMap.pipe(
      filter(params => params.has('document')),
      map(params => params.get('document')),
    ).subscribe(document => {
      activatedRouteSubscription.unsubscribe();
      router.navigate([], {
        queryParams: {
          document: null
        },
        queryParamsHandling: 'merge'
      })
      if (document !== null) {
        const getDocumentSubscription = documentService.getDocument(document).subscribe(plantuml => {
          getDocumentSubscription.unsubscribe();
          this.plantumlHolder.plantuml = plantuml;
        });
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
}

