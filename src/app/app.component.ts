import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataElement } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  dataElements: DataElement[] = [];
  form: FormGroup = this.formBuilder.group({
    timerInterval: [1000],
    dataSize: [100],
  });

  addIdsControl: FormControl = new FormControl('');
  worker = new Worker(new URL('./pseudo-socket.worker.ts', import.meta.url));

  private overrideIds: number[] = [];

  constructor(public ngZone: NgZone, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      timerInterval: [1000],
      dataSize: [100],
    });

    this.form.valueChanges.subscribe((value) => {
      this.worker.postMessage(value);
    });

    this.addIdsControl.valueChanges.subscribe((value) => {
        this.overrideIds = value.match(/\d+/g) || [];
    })

    this.handleWorker();
  }

  handleWorker(): void {
    this.worker.onmessage = (event) => {
      this.ngZone.run(() => {
        this.dataElements = event.data;
        this.dataElements = this.dataElements.slice(-10);

        if (this.overrideIds.length) {
          this.updateDataElements();
        }
      });
    };

    this.worker.postMessage(this.form.value);
  }

  updateDataElements(): void {
    this.overrideIds.forEach((newId, index) => {
      if(this.dataElements[index]) {
        const { int, float, color, child} = this.dataElements[index];

        this.dataElements[index] = new DataElement(newId.toString(), int, float, color, child);
      }
    })
  }

  trackById(index: number, elem: DataElement): string {
    return elem.id
  }
}
