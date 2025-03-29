import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tt-view-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-header.component.html',
  styleUrl: './view-header.component.scss'
})
export class ViewHeaderComponent {
  @Input() title!: string;
  @Input() isLoading!: boolean;
  @Output() newAction = new EventEmitter();

  constructor() {}

  public onNew(): void {
    this.newAction.emit();
  }
}
