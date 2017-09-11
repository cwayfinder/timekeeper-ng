import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/empty';

@Injectable()
export class DbService {

  uid: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
    this.afAuth.authState
      .subscribe(user => this.uid = user.uid);
  }

  list(path): Observable<any[]> {
    return this.db.list(`/v1/${this.uid}/${path}`);
  }

  get(path): Observable<any> {
    return this.db.object(`/v1/${this.uid}/${path}`);
  }

  create(path, entity): Observable<string> {
    return Observable.from(this.db.list(`/v1/${this.uid}/${path}`).push(entity))
      .map((ref: firebase.database.Reference) => ref.key);
  }

  update(path, entity): Observable<void> {
    return Observable.from(this.db.object(`/v1/${this.uid}/${path}`).update(entity));
  }

  set(path, entity): Observable<void> {
    return this.afAuth.authState
      .map(user => user.uid)
      .switchMap(uid => Observable.from(this.db.object(`/v1/${uid}/${path}`).set(entity)));
  }

  activities() {
    // return combineLatest(this.list('activities'), this.list('projects'), (activities, projects) => {
    //   return activities
    // });

    return this.list('activities')
      .switchMap(activities => {

        const projectObservables = activities.map(activity => {
          if (activity.projectKey) {
            return this.get(`projects/${activity.projectKey}`);
          } else {
            return Observable.of(null);
          }
        });

        return projectObservables.length === 0 ?
          Observable.of(activities) :
          Observable.combineLatest(...projectObservables, (...projects) => {
            activities.forEach((activity, index) => {
              activity.project = projects[index];
            });
            return activities;
          });
      });
  }

  lastActivity() {
    return this.db
      .list(`/v1/${this.uid}/history`, { query: { limitToLast: 1 } })
      .map(list => list[0]);
  }
}