import {AfterViewInit, Component, Inject} from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {PlantumlHolder} from './shared/plantuml-holder';
import {OverlayContainer} from '@angular/cdk/overlay';
import {DOCUMENT} from '@angular/common';
import {ThemeService} from './shared/theme.service';

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

