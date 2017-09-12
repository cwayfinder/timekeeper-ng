import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DbService } from '../db.service';
import { Observable } from 'rxjs/Observable';
import { deltaTime } from '../date-utils';

@Component({
  selector: 'tk-activity-history',
  templateUrl: './activity-history.component.html',
  styleUrls: ['./activity-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityHistoryComponent implements OnInit {

  items: Observable<any[]>;

  constructor(private db: DbService) { }

  ngOnInit() {
    this.items = this.db.activityHistory();

    this.db.activityHistory().subscribe(val => console.log(val));
  }

  delta(start: number, stop: number) {
    if (stop) {
      return deltaTime(start, stop);
    } else {
      return deltaTime(start, Date.now());
    }
  }
}
