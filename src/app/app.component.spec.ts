import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DataElement } from './models';

class MockWorker implements Worker {
  onmessage: ((this: Worker, ev: MessageEvent<any>) => any) | null = null;

  // @ts-ignore
  postMessage(message: any, transfer: any[]): void {}
  terminate(): void {}

  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    if (type === 'message' && typeof listener === 'function') {
      this.onmessage = listener as (this: Worker, ev: MessageEvent) => any;
    }
  }

  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    if (type === 'message' && this.onmessage === listener) {
      this.onmessage = null as any;
    }
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    const mockWorker = new MockWorker() as any;

    spyOn(mockWorker, 'postMessage');
    spyOn(mockWorker, 'terminate');

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        { provide: Worker, useValue: mockWorker },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dataElements and form', () => {
    expect(component.dataElements).toEqual([]);
    expect(component.form.value).toEqual({ timerInterval: 1000, dataSize: 100 });
  });

  it('should update dataElements on worker message', () => {
    const testData: DataElement[] = [
      { id: '1', int: 1, float: 1.5, color: 'blue', child: { id: 'child1', color: 'red' } },
    ];

    fixture.detectChanges(); // Trigger ngOnInit

    const messageEvent = new MessageEvent('message', {
      data: testData,
      // @ts-ignore
      target: component.worker,
    });

    // Trigger the 'message' event
    if (component.worker.onmessage) {
      component.worker.onmessage(messageEvent);
    }

    expect(component.dataElements).toEqual(testData.slice(-10));
  });
});
