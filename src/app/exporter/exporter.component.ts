import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import store from '../store/store';

@Component({
  selector: 'app-exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.css']
})
export class ExporterComponent implements OnInit {
  isExporting: boolean = false;
  exportFileUrl: SafeUrl = '';
  exportFileName: string = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  doExport(event) : void {
    console.log(event);

    this.isExporting = true;

    const data = store.getState();
    const date = new Date();
    const file = new Blob([JSON.stringify(data)], { type: 'application/json' });
    // Object url must be unsanitized else it doesn't work.
    this.exportFileUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    this.exportFileName = `Hadleyville__${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}`;
  }

  resetExport(event) : void {
    // Give it a second so the link default action happens.
    // Then we revoke the object url to clear memory.
    setTimeout(() => {
      window.URL.revokeObjectURL(this.exportFileUrl.toString());
      this.exportFileUrl = '';
      this.exportFileName = '';
      this.isExporting = false;
    }, 1000);
  }
}
