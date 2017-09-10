import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSelectChange } from '@angular/material';
import { ProjectComponent } from '../project/project.component';
import { AngularFireAuth } from 'angularfire2/auth';
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

  constructor(private fb: FormBuilder,
              private dialog: MdDialog,
              private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              public dialogRef: MdDialogRef<ProjectComponent>,
              @Inject(MD_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      project: [this.data.project, Validators.required],
    });

    this.projects = this.afAuth.authState
      .map(user => user.uid)
      .switchMap(uid => this.db.list(`/v1/${uid}/projects`));
  }

  onChange(event: MdSelectChange) {
    console.log(event);
    if (event.value === null) {
      this.openProjectDialog();
    }
  }

  openProjectDialog(): void {
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
