import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges } from '@angular/core';
import {CommonModule} from "@angular/common";
import {SafeHtmlPipe} from "../../_pipes/safe-html.pipe";
import {TranslocoDirective} from "@ngneat/transloco";
import DOMPurify from 'dompurify';
import {BypassSecurityTrustHtmlPipe} from "../../_pipes/bypass-security-trust-html.pipe";

@Component({
  selector: 'app-read-more',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, TranslocoDirective, BypassSecurityTrustHtmlPipe],
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadMoreComponent implements OnChanges {
  /**
   * String to apply readmore on
   */
  @Input({required: true}) text!: string;
  /**
   * Max length before apply read more. Defaults to 250 characters.
   */
  @Input() maxLength: number = 250;
  /**
   * If the field is collapsed and blur true, text will not be readable
   */
  @Input() blur: boolean = false;
  /**
   * If the read more toggle is visible
   */
  @Input() showToggle: boolean = true;

  currentText!: string;
  hideToggle: boolean = true;
  isCollapsed: boolean = true;

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  toggleView() {
    this.isCollapsed = !this.isCollapsed;
    this.determineView();
  }

  determineView() {
    let safeHtml = DOMPurify.sanitize(this.text);
    if (!this.text || this.text.length <= this.maxLength) {
        this.currentText = safeHtml;
        this.isCollapsed = true;
        this.hideToggle = true;
        return;
    }
    this.hideToggle = false;
    if (this.isCollapsed) {
      this.currentText = safeHtml.substring(0, this.maxLength);
      this.currentText = this.currentText.substring(0, Math.min(this.currentText.length, this.currentText.lastIndexOf(' ')));
      this.currentText = this.currentText + '…';
    } else if (!this.isCollapsed)  {
      this.currentText = safeHtml;
    }

    this.cdRef.markForCheck();
  }
  ngOnChanges() {
      this.determineView();
  }
}
