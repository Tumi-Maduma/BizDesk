import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AssetService {

    private apiUrl =
        'http://localhost:3000/api/assets';

    constructor(
        private http: HttpClient
    ) {}

    getAssets() {
        return this.http.get<any[]>(
            this.apiUrl
        );
    }

    createAsset(asset: any) {
        return this.http.post<any>(
            this.apiUrl,
            asset
        );
    }

    updateAsset(
        id: number,
        asset: any
    ) {
        return this.http.put<any>(
            `${this.apiUrl}/${id}`,
            asset
        );
    }

    assignAsset(
        id: number,
        userId: number
    ) {
        return this.http.put<any>(
            `${this.apiUrl}/${id}/assign`,
            {
                user_id: userId
            }
        );
    }

    unassignAsset(id: number) {
        return this.http.put<any>(
            `${this.apiUrl}/${id}/unassign`,
            {}
        );
    }

    deleteAsset(id: number) {
        return this.http.delete<any>(
            `${this.apiUrl}/${id}`
        );
    }
}