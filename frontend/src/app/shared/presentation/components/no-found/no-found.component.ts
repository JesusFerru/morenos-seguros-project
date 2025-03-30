import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ms-no-found',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: '<p>no-found works!</p>',
  styleUrl: './no-found.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoFoundComponent { }
