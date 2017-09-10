import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { MdDialog } from '@angular/material';
import { ActivityComponent } from '../activity/activity.component';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

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

  constructor(private db: AngularFireDatabase, private dialog: MdDialog,
              private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.recent = this.afAuth.authState
      .map(user => user.uid)
      .switchMap(uid => this.db.list(`/v1/${uid}/activities`));
  }

  addActivity() {
    this.openActivityDialog();
  }

  openActivityDialog(): void {
    const dialogRef = this.dialog.open(ActivityComponent, {
      width: '250px',
      data: { name: '', color: 'red' }
    });

    dialogRef.afterClosed().subscribe(activity => {
      console.log('The dialog was closed', activity);

      this.afAuth.authState
        .map(user => user.uid)
        .switchMap(uid => Observable.from(this.db.list(`/v1/${uid}/activities`).push(activity)))
        .map(ref => ref.key)
        .subscribe(key => console.log('added activity', key));
    });
  }
}
