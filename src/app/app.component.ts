import { HttpEvent, HttpEventType, HttpHeaderResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FileServiceService } from './file-service.service';
import { saveAs} from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FileTranferAngular';
  fileNames: string[] = [];

  fileStatus = {
    status: '',
    requestType:'',
    percent: 0
  }

  constructor(private service: FileServiceService){}

  onUploadFiles(files: File[]):void {
    
    const formData = new FormData();
    for(const file of files){formData.append('files', file, file.name)}

    this.service.upload(formData).subscribe(event => {
      console.log(event);
      this.repostProgress(event)
    }, error => {
      console.log(error)
    });
  }

  onDownloadFile(fileName: string):void {
    this.service.download(fileName).subscribe(event => {
      console.log(event);
      this.repostProgress(event)
    }, error => {
      console.log(error)
    });
  }



  private repostProgress(httpEvent: HttpEvent<string[] | Blob> ): void{
      switch(httpEvent.type){
        case HttpEventType.UploadProgress:
          this.updateStatus(httpEvent.loaded, httpEvent.total, "Uploading...");
          break;
        case HttpEventType.DownloadProgress:
          this.updateStatus(httpEvent.loaded, httpEvent.total, "Downloading...");
          break;
        case HttpEventType.ResponseHeader:
          console.log('Header returned: ', httpEvent);
          break;
        case HttpEventType.Response:
          if(httpEvent.body instanceof Array){
            this.fileStatus.status = 'done'
            for(const fileName of httpEvent.body){
              this.fileNames.unshift(fileName);
            }
          } else {
            saveAs(new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
            {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`}))
            this.fileStatus.status = 'done'
          }
         
          break;
          default:
            console.log(httpEvent)
      }      
  }
  
  private updateStatus(loaded: number, total: number, requestType: string) {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }

}
