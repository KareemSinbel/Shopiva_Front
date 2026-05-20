import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private _http: HttpClient) { }


  login(formData: ILogin): Observable<any> {
    return this._http.post('https://localhost:7259/api/Auth/login', formData);
  }

  register(formData: IRegister): Observable<any> {
    return this._http.post('https://localhost:7259/api/Auth/register', formData);
  }

}
