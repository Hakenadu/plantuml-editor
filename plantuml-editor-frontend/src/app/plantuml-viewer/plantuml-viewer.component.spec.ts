import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantumlViewerComponent } from './plantuml-viewer.component';

describe('PlantumlViewerComponent', () => {
  let component: PlantumlViewerComponent;
  let fixture: ComponentFixture<PlantumlViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantumlViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantumlViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
