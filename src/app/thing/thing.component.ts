import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tk-thing',
  templateUrl: './thing.component.html',
  styleUrls: ['./thing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
