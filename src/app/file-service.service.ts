import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  private server: 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  upload(formData: FormData): Observable<HttpEvent<string[]>>{
    return this.http.post<string[]>(`http://localhost:8080/file/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  
  download(fileName: String): Observable<HttpEvent<Blob>>{
    return this.http.get(`http://localhost:8080/file/download/${fileName}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }
}
