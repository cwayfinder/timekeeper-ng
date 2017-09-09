import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { palette } from '../palette';

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

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: '',
      color: '',
    });
  }

  formatColorName(camelCase: string) {
    return camelCase[0].toUpperCase() + camelCase.slice(1).replace(/([A-Z])/g, ' $1');
  }
}
