import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdDialog, MdSelectChange } from '@angular/material';
import { ProjectComponent } from '../project/project.component';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';

@Component({
  selector: 'tk-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityComponent implements OnInit {

  form: FormGroup;

  projects: Observable<any>;

  constructor(private fb: FormBuilder, public dialog: MdDialog, private db: AngularFireDatabase, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: '',
      project: '',
    });

    this.projects = this.afAuth.authState
      .map(user => user.uid)
      .switchMap(uid => this.db.list(`/v1/${uid}/projects`));
  }

  onChange(event: MdSelectChange) {
    console.log(event);
    if (event.value === null) {
      this.openDialog();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProjectComponent, {
      width: '250px',
      data: { name: '', color: 'red' }
    });

    dialogRef.afterClosed().subscribe(project => {
      console.log('The dialog was closed', project);

      this.afAuth.authState
        .map(user => user.uid)
        .switchMap(uid => Observable.from(this.db.list(`/v1/${uid}/projects`).push(project)))
        .map(ref => ref.key)
        .subscribe(key => this.form.patchValue({ project: key }));
    });
  }
}
