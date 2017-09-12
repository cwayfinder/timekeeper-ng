import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { MdDialog, MdSelectChange } from '@angular/material';
import { ActivityComponent } from '../activity/activity.component';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { DbService } from '../db.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/observable/interval';
import { palette } from '../palette';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'tk-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  tasks = [
    { name: 'morning routine', color: '#4CAF50', priority: 1 },
    { name: 'listening podcasts', color: '#FF5722' },
    { name: 'meeting', color: '#607D8B' },
    { name: 'bugfix', color: '#607D8B' },
    { name: 'interviewing', color: '#607D8B' },
    { name: 'item 6', color: '#607D8B' },
  ];

  // recent: any = [
  //   { name: 'listening podcasts', color: '#FF5722' },
  //   { name: 'meeting', color: '#607D8B' },
  //   { name: 'bugfix', color: '#607D8B' },
  //   { name: 'interviewing', color: '#607D8B' },
  //   { name: 'item 1', color: '#607D8B' },
  //   { name: 'item 2', color: '#607D8B' },
  //   { name: 'item 9', color: '#607D8B' },
  // ];

  completed = [
    { name: 'morning routine', color: '#4CAF50' },
    { name: 'interviewing', color: '#607D8B' },
    { name: 'item 1', color: '#607D8B' },
  ];

  day = [
    { name: 'home', color: '#80DEEA', proportion: 20 },
    { name: 'walk', color: '#C5E1A5', proportion: 1 },
    { name: 'metro', color: '#E1BEE7', proportion: 5 },
    { name: 'walk', color: '#C5E1A5', proportion: 4 },
    { name: 'office', color: '#EF9A9A', proportion: 40 },
    { name: 'walk', color: '#C5E1A5', proportion: 4 },
    { name: 'metro', color: '#E1BEE7', proportion: 5 },
    { name: 'walk', color: '#C5E1A5', proportion: 1 },
    { name: 'home', color: '#80DEEA', proportion: 20 },
  ];

  contexts = [
    { name: 'home', color: '#80DEEA' },
    { name: 'walk', color: '#C5E1A5' },
    { name: 'metro', color: '#E1BEE7' },
    { name: 'office', color: '#EF9A9A' },
    { name: 'swimming pool', color: '#B2EBF2' },
    { name: 'gym', color: '#FFECB3' },
    { name: 'cafe', color: '#D7CCC8' },
    { name: 'taxi', color: '#D7CCC8' },
  ];

  recent: Observable<any[]>;

  current: any;
  time$: Observable<string>;

  form: FormGroup;

  constructor(private db: DbService, private dialog: MdDialog, private fb: FormBuilder) { }

  ngOnInit() {
    this.recent = this.db.activities()
      .map(activities => activities.map(activity => {
        if (!activity.project) {
          activity.project = { name: 'Inbox', color: palette.grey[500] }
        }
        return activity;
      }));

    this.recent
      .subscribe(val => console.log(val))

    const o = this.db.lastActivity();

    o.subscribe(historyEntry => {
      console.log('historyEntry', historyEntry)
      if (historyEntry && historyEntry.stop) {
        this.current = null;
      } else {
        this.current = historyEntry;
      }
    });

    this.time$ = o
      .filter(historyEntry => !!historyEntry)
      .filter(historyEntry => !historyEntry.stop)
      .combineLatest(Observable.interval(), (historyEntry) => this.extractTime(historyEntry.start));

    this.form = this.fb.group({
      context: [this.contexts[3]],
    });

    this.db.lastActivity().subscribe(val => console.log('last', val));
  }

  addActivity() {
    this.openActivityDialog();
  }

  openActivityDialog(): void {
    const dialogRef = this.dialog.open(ActivityComponent, {
      width: '250px',
      data: { name: '', projectKey: '' }
    });

    dialogRef.afterClosed()
      .filter(activity => !!activity)
      .switchMap(activity => this.db.create('activities', activity))
      .subscribe(key => console.log('added activity', key));
  }

  start(item: any) {
    console.log('start', item)
    const timestamp = Date.now();

    if (this.current) {
      this.db.update(`history/${this.current.$key}`, { stop: timestamp })
        .switchMapTo(this.db.create(`history`, { activityKey: item.$key, start: timestamp }))
        .subscribe(() => console.log('started activity'));
    } else {
      this.db.create(`history`, { activityKey: item.$key, start: timestamp })
        .subscribe(() => console.log('started activity'));
    }
  }

  pause(itemKey: string) {
    const timestamp = Date.now();
    this.db.update(`history/${this.current.$key}`, { stop: timestamp })
      .subscribe(() => console.log('stopped activity'));
  }

  extractTime(timestamp: number): string {
    const delta = new Date(Date.now() - timestamp);

    const parts = [delta.getUTCHours(), delta.getUTCMinutes(), delta.getUTCSeconds()];

    if (!parts[0]) {
      parts.shift();
    }

    return parts
      .map(part => String(part).padStart(2, '0'))
      .join(':');
  }

  onContextChange(change: MdSelectChange) {

  }
}
