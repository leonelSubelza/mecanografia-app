import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextGenerationAPIService {
  baseURL: string = 'https://random-word-api.herokuapp.com/word?lang=es'

  private _httpClient = inject(HttpClient);

  constructor() { }

  getRandomWord(cant: number, length: number) {
    const apiKey = '5+uYpKnK/1OGK0GJnfUSJg==1owWccGGzvZ1Vrtx';
    let url = 'https://api.api-ninjas.com/v1/loremipsum?paragraphs=2&start_with_lorem_ipsum=false'
    const headers = new HttpHeaders({
      'X-Api-Key': '5+uYpKnK/1OGK0GJnfUSJg==1owWccGGzvZ1Vrtx' // Reemplaza 'your-api-key-here' con tu clave API real si es necesario
    });
    // return this._httpClient.get<String>(`${this.baseURL}?number=${cant}?length=${length}`);
    return this._httpClient.get<String>(url,{headers});
  }
}
