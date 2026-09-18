import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class KnowledgeBaseService {

    private apiUrl =
        'http://localhost:3000/api/knowledge';

    constructor(
        private http: HttpClient
    ) {}

    getCategories() {
        return this.http.get<any[]>(
            `${this.apiUrl}/categories`
        );
    }

    getArticles() {
        return this.http.get<any[]>(
            `${this.apiUrl}/articles`
        );
    }

    getArticle(id: number) {
        return this.http.get<any>(
            `${this.apiUrl}/articles/${id}`
        );
    }

    createArticle(article: any) {

        return this.http.post<any>(
            `${this.apiUrl}/articles`,
            article
        );
    }

    updateArticle(
        id: number,
        article: any
    ) {

        return this.http.put<any>(
            `${this.apiUrl}/articles/${id}`,
            article
        );
    }

    deleteArticle(id: number) {
        return this.http.delete<any>(
            `${this.apiUrl}/articles/${id}`
        );
}
}