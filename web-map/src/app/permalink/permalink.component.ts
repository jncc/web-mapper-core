import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-permalink',
  templateUrl: './permalink.component.html',
  styleUrls: ['./permalink.component.scss']
})
export class PermalinkComponent implements OnInit {
  @Input() permalink: string;
  @Output() closePermalink = new EventEmitter<void>();

  copyText = 'Copy';

  constructor() { }

  ngOnInit() {
  }

  onCopyPermalink(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    this.copyText = 'Copied';
  }

  onClosePermalink() {
    this.closePermalink.emit();
  }

}
