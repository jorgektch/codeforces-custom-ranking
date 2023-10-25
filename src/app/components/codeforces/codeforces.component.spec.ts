import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeforcesComponent } from './codeforces.component';

describe('CodeforcesComponent', () => {
  let component: CodeforcesComponent;
  let fixture: ComponentFixture<CodeforcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CodeforcesComponent]
    });
    fixture = TestBed.createComponent(CodeforcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
