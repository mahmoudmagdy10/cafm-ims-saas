import { environment } from 'src/environments/environment';
import { MenuItem } from 'primeng/api';
import { Observable, BehaviorSubject } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { scan } from 'rxjs/operators';
import { FilesBackupService } from './files-back-up.service';

@Component({
  selector: 'app-FilesBackup',
  templateUrl: './FilesBackup.component.html',
  styleUrls: ['./FilesBackup.component.scss'],
})
export class FilesBackupComponent implements OnInit {
  Avatar=environment.Avatar

  constructor(
    private _filesBackupService: FilesBackupService,
    private cdr: ChangeDetectorRef
  ) {}
  Location$: Observable<any>;
  items = new BehaviorSubject<MenuItem[]>([
    { label: 'Locations' },
    {
      label: 'Files',
      command: () => {
        this.step = 1;
        let items = this.items.value;
        items.length = 2;
        this.items.next(items);
      },
    },
  ]);
  items$: Observable<any> = this.items.asObservable();
  FilesForLocation: any[] = [];
  step = 1;
  ngOnInit() {
    this.Location$ = this._filesBackupService.GetLocation();
    // Create an observable to hold our state
const state$ = new Observable(observer => {
  observer.next({ count: 0 });
});

// Create an action to increment the count
const increment = () => ({ type: 'INCREMENT' });

// Create an action to decrement the count
const decrement = () => ({ type: 'DECREMENT' });

// Use the scan operator to update the state based on actions
const stateWithUpdates$ = state$.pipe(
  scan((state, action:any) => {
    if (action.type === 'INCREMENT') {
      return { count: state.count + 1 };
    } else if (action.type === 'DECREMENT') {
      return { count: state.count - 1 };
    }
  })
);

// Subscribe to the state to receive updates
stateWithUpdates$.subscribe(state => {
  ;
});

// Dispatch some actions
increment(); // Logs: { count: 1 }
increment(); // Logs: { count: 2 }
decrement(); // Logs: { count: 1 }
  }

  getFilesBackup(item: any) {
    this.step = 2;
    this.FilesForLocation = [];
    this._filesBackupService
      .getFilesBackup(item.LocationId)
      .subscribe((value) => {
        this.items.next([...this.items.value, { label: item.LocationName }]);

        this.FilesForLocation = value;
        this.cdr.detectChanges();
      });
  }

  downLoadFile(url: any) {

    window.open(this.Avatar+url, '_blank');
  }
}
