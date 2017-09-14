import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialog, MdDialogRef, MdOptionSelectionChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DbService } from '../db.service';
import 'rxjs/add/operator/startWith';
import { ActivityComponent } from '../activity/activity.component';

@Component({
  selector: 'tk-activity-history-item',
  templateUrl: './activity-history-item.component.html',
  styleUrls: ['./activity-history-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityHistoryItemComponent implements OnInit {

  form: FormGroup;

  activities$: Observable<any[]>;

  selectedActivity: any;

  filteredActivities$: Observable<any[]>;

  constructor(private db: DbService,
              private fb: FormBuilder,
              private dialog: MdDialog,
              public dialogRef: MdDialogRef<ActivityHistoryItemComponent>,
              @Inject(MD_DIALOG_DATA) private historyItem: any) { }

  ngOnInit() {
    const startDate = new Date(this.historyItem.start);
    const start = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
    const stopDate = new Date(this.historyItem.stop);
    const stop = `${String(stopDate.getHours()).padStart(2, '0')}:${String(stopDate.getMinutes()).padStart(2, '0')}`;

    console.log(start);

    this.form = this.fb.group({
      start: [start, Validators.required],
      stop: [stop, Validators.required],
      activity: [this.historyItem.activity.name, Validators.required],
    });

    this.activities$ = this.db.activities();

    this.filteredActivities$ = this.form.get('activity').valueChanges
      .startWith('')
      .combineLatest(this.activities$, (input, activities) => activities.filter(activity => this.matchActivity(input, activity)));
  }

  matchActivity(input, activity) {
    if (!input) {
      return true;
    }

    return activity.name.toLowerCase().includes(input.toLowerCase())
      || activity.project.name.toLowerCase().includes(input.toLowerCase());
  }

  selectActivity(change: MdOptionSelectionChange, activity: any) {
    if (change.isUserInput) {
      this.selectedActivity = activity;
    }
    console.log(change, activity);
  }

  save() {
    const update: any = {};

    if (this.selectedActivity) {
      update.activityKey = this.selectedActivity.$key;
    }

    const startTime = this.form.value.start.split(':').map(Number);
    update.start = new Date(this.historyItem.start).setHours(startTime[0], startTime[1]);
    const stopTime = this.form.value.stop.split(':').map(Number);
    update.stop = new Date(this.historyItem.stop).setHours(stopTime[0], stopTime[1]);

    this.db.update(`history/${this.historyItem.$key}`, update)
      .subscribe(() => this.dialogRef.close());
  }


  openAddDialog() {
    const dialogRef = this.dialog.open(ActivityComponent, {
      width: '250px',
      data: { name: '', projectKey: '' }
    });

    dialogRef.afterClosed()
      .filter(activityKey => !!activityKey)
      .do(activityKey => this.db.set(`history/${this.historyItem.$key}/activityKey`, activityKey))
      .switchMap(activityKey => this.db.get(`activities/${activityKey}`))
      .subscribe(activity => {
        this.selectedActivity = activity;
        this.form.patchValue({ activity: activity.name });
      });
  }
}
