import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Observable } from "rxjs";
import { catchError } from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})

export class HttpService {
    constructor(private http: HttpClient) { }

    // แอดเดรสที่เชื่อมต่อกับ Backend
    private address: string = 'http://localhost:3000/';

    // ส่งข้อมูลแบบ method Get
    requestGet(url: string, accessToken?: string) {
        return this.http
            .get(`${this.address}${url}`, {
                headers: this.appendHeaders(accessToken)
            })
            .pipe(catchError(err => this.handleError(err)));
    }

    // ส่งข้อมูลแบบ methed Post
    requestPost(url: string, body: any, accessToken?: string) {
        return this.http
            .post(`${this.address}${url}`, body, {
                headers: this.appendHeaders(accessToken)
            })
            .pipe(catchError(err => this.handleError(err)))
    }

    // ส่งข้อมูลแบบ Delete method
    requestDelete(url: string, accessToken?: string) {
        return this.http
            .delete(`${this.address}${url}`, {
                headers: this.appendHeaders(accessToken)
            })
            .pipe(catchError(err => this.handleError(err)));
    }

    // ส่งข้อมูลแบบ Put method
    requestPut(url: string, body: any, accessToken?: string) {
        return this.http
            .put(`${this.address}${url}`, body, {
                headers: this.appendHeaders(accessToken)
            })
            .pipe(catchError(err => this.handleError(err)));
    }

    // เพิ่ม header
    private appendHeaders(accessToken) {
        const headers = {};
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
        return new HttpHeaders(headers);
    }

    //ปรับแต่ง Error ใหม่
    private handleError(errResponse: HttpErrorResponse): Observable<any> {
        errResponse['Message'] = errResponse.message;
        if (errResponse.error && errResponse.error.message)
            errResponse['Message'] = errResponse.error.message;
        throw errResponse;
    }

}