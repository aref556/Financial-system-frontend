import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthenService {
    private accessKey = 'accessToken';

    // กำหนดค่า accessToken ไว้ในหน่วยความจำ Browser (LocalStorage)
    setAuthenticated(accessToken: string) {
        localStorage.setItem(this.accessKey, accessToken);
    }

    // ดึงค่า accessToken ในหน่วยความจำ Browser (LocalStorage)
    getAuthenticated(): string {
        return localStorage.getItem(this.accessKey);
    }

    // ลบค่า accessToken ในหน่วยความจำ Browser (LocalStorage)
    clearAuthenticated() {
        localStorage.removeItem(this.accessKey);
    }

}