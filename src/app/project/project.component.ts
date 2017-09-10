import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { palette } from '../palette';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'tk-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnInit {

  form: FormGroup;

  colors = Object.entries(palette)
    .filter(([name]) => name !== 'grey')
    .map(([name, variants]) => ({name: this.formatColorName(name), value: variants[500]}));

  constructor(private fb: FormBuilder,
              public dialogRef: MdDialogRef<ProjectComponent>,
              @Inject(MD_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.data.name, Validators.required],
      color: [this.data.color, Validators.required],
    });
  }

  formatColorName(camelCase: string) {
    return camelCase[0].toUpperCase() + camelCase.slice(1).replace(/([A-Z])/g, ' $1');
  }
}