import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MD_DIALOG_DATA, MdDialog, MdDialogRef, MdSelectChange } from '@angular/material';
import { ProjectComponent } from '../project/project.component';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { DbService } from '../db.service';

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
              public dialogRef: MdDialogRef<ProjectComponent>,
              @Inject(MD_DIALOG_DATA) private data: any,
              private db: DbService) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      projectKey: [this.data.projectKey],
    });

    this.projects = this.db.list('projects');
  }

  onChange(event: MdSelectChange) {
    if (event.value === 'new') {
      this.openProjectDialog();
    }
  }

  openProjectDialog(): void {
    const dialogRef = this.dialog.open(ProjectComponent, {
      width: '250px',
      data: { name: '', color: '#009688' }
    });

    dialogRef.afterClosed()
      .filter(project => !!project)
      .switchMap(project => this.db.create('projects', project))
      .subscribe(key => this.form.patchValue({ projectKey: key }));
  }
}
