import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeforcesService {
  // Api Path from enviroment
  private BASE_URL = environment.apiURL;
  constructor(private http: HttpClient) { }

  /*
   * Fetch all countries
   */

  public getData(handleCodeforces: string): Observable<any>{
    return this.http.get<any>(
      this.BASE_URL + 'user.rating?handle=' + handleCodeforces
    );
  }

}
