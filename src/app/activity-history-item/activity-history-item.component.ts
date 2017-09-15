import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialog, MdDialogRef, MdOptionSelectionChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DbService } from '../db.service';
import 'rxjs/add/operator/startWith';
import { ActivityComponent } from '../activity/activity.component';
import * as format from 'date-fns/format';

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
              @Inject(MD_DIALOG_DATA) private params: any) { }

  ngOnInit() {
    const activity = this.params.mode === 'edit' ? this.params.item.activity.name : '';

    this.form = this.fb.group({
      start: [format(this.params.item.start, 'HH:mm'), Validators.required],
      stop: [format(this.params.item.stop, 'HH:mm'), Validators.required],
      activity: [activity, Validators.required],
    });

    this.activities$ = this.db.activities();

    this.filteredActivities$ = this.form.get('activity').valueChanges
      .startWith('')
      .combineLatest(this.activities$, (input, activities) => activities.filter(act => this.matchActivity(input, act)));
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
    const data: any = {};

    if (this.selectedActivity) {
      data.activityKey = this.selectedActivity.$key;
    }

    const startTime = this.form.value.start.split(':').map(Number);
    data.start = new Date(this.params.item.start).setHours(startTime[0], startTime[1]);
    const stopTime = this.form.value.stop.split(':').map(Number);
    data.stop = new Date(this.params.item.stop).setHours(stopTime[0], stopTime[1]);

    if (this.params.mode === 'edit') {
      this.db.update(`history/${this.params.item.$key}`, data)
        .subscribe(() => this.dialogRef.close());
    } else {
      this.db.create(`history`, data)
        .subscribe(() => this.dialogRef.close());
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ActivityComponent, {
      width: '250px',
      data: { name: '', projectKey: '' }
    });

    dialogRef.afterClosed()
      .filter(activityKey => !!activityKey)
      .do(activityKey => this.db.set(`history/${this.params.item.$key}/activityKey`, activityKey))
      .switchMap(activityKey => this.db.get(`activities/${activityKey}`))
      .subscribe(activity => {
        this.selectedActivity = activity;
        this.form.patchValue({ activity: activity.name });
      });
  }
}
