import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { KnowledgeBaseService }
    from '../services/knowledge-base.service';

import { AuthService }
    from '../services/auth.service';

@Component({
    selector: 'app-knowledge-base',

    imports: [
        CommonModule,
        FormsModule
    ],

    templateUrl:
        './knowledge-base.component.html',

    styleUrl:
        './knowledge-base.component.css'
})
export class KnowledgeBaseComponent
    implements OnInit {

    categories: any[] = [];

    articles: any[] = [];

    filteredArticles: any[] = [];

    selectedArticle: any = null;

    searchTerm = '';

    categoryFilter = '';

    loading = true;

    errorMessage = '';

    showCreateForm = false;

    creatingArticle = false;

    articleTitle = '';

    articleContent = '';

    articleCategory = '';

    successMessage = '';

    editingArticle: any = null;

    editTitle = '';

    editContent = '';

    editCategory = '';

    updatingArticle = false;

    deletingArticle = false;

    constructor(
        private knowledgeBaseService:
            KnowledgeBaseService,

        private authService:
            AuthService
    ) {}

    ngOnInit(): void {

        this.loadKnowledgeBase();

    }

    loadKnowledgeBase(): void {

        this.loading = true;

        this.knowledgeBaseService
            .getCategories()
            .subscribe({
                next: (categories) => {

                    this.categories =
                        categories;

                    this.loadArticles();

                },

                error: (error) => {

                    console.error(
                        'Error loading categories:',
                        error
                    );

                    this.errorMessage =
                        'Unable to load the Knowledge Base.';

                    this.loading = false;
                }
            });
    }

    loadArticles(): void {

        this.knowledgeBaseService
            .getArticles()
            .subscribe({

                next: (articles) => {

                    this.articles =
                        articles;

                    this.filteredArticles =
                        [...articles];

                    this.loading = false;

                },

                error: (error) => {

                    console.error(
                        'Error loading articles:',
                        error
                    );

                    this.errorMessage =
                        'Unable to load Knowledge Base articles.';

                    this.loading = false;
                }
            });
    }

    filterArticles(): void {

        const search =
            this.searchTerm
                .trim()
                .toLowerCase();

        this.filteredArticles =
            this.articles.filter(article => {

                const matchesSearch =
                    !search ||
                    article.title
                        ?.toLowerCase()
                        .includes(search) ||
                    article.content
                        ?.toLowerCase()
                        .includes(search);

                const matchesCategory =
                    !this.categoryFilter ||
                    article.category_id ==
                        Number(this.categoryFilter);

                return (
                    matchesSearch &&
                    matchesCategory
                );
            });
    }

    clearFilters(): void {

        this.searchTerm = '';

        this.categoryFilter = '';

        this.filteredArticles =
            [...this.articles];
    }

    viewArticle(article: any): void {

        this.selectedArticle =
            article;

    }

    closeArticle(): void {

        this.selectedArticle =
            null;

    }

    isAdmin(): boolean {

        const user =
            this.authService.getUser();

        return user?.role === 'ADMIN';
    }
    
    openCreateForm(): void {

        this.showCreateForm = true;

        this.errorMessage = '';

        this.successMessage = '';
    }

    closeCreateForm(): void {

        this.showCreateForm = false;

        this.articleTitle = '';

        this.articleContent = '';

        this.articleCategory = '';

        this.errorMessage = '';
    }

    createArticle(): void {

        this.errorMessage = '';

        this.successMessage = '';

        if (
            !this.articleTitle.trim() ||
            !this.articleContent.trim() ||
            !this.articleCategory
        ) {

            this.errorMessage =
                'Please complete all required fields.';

            return;
        }

        this.creatingArticle = true;

        const article = {

            title: this.articleTitle.trim(),

            content: this.articleContent.trim(),

            category_id:
                Number(this.articleCategory)
        };

        this.knowledgeBaseService
            .createArticle(article)
            .subscribe({

                next: () => {

                    this.successMessage =
                        'Knowledge Base article created successfully.';

                    this.creatingArticle = false;

                    this.showCreateForm = false;

                    this.articleTitle = '';

                    this.articleContent = '';

                    this.articleCategory = '';

                    this.loadArticles();
                },

                error: (error) => {

                    console.error(
                        'Error creating article:',
                        error
                    );

                    this.errorMessage =
                        error.error?.message ||
                        'Unable to create article.';

                    this.creatingArticle = false;
                }
            });
    }

    startEditing(article: any): void {

        this.editingArticle = article;

        this.editTitle = article.title;

        this.editContent = article.content;

        this.editCategory =
            String(article.category_id);

        this.selectedArticle = null;

        this.errorMessage = '';

        this.successMessage = '';
    }

    cancelEditing(): void {

        this.editingArticle = null;

        this.editTitle = '';

        this.editContent = '';

        this.editCategory = '';

        this.errorMessage = '';
    }

    updateArticle(): void {

        this.errorMessage = '';

        this.successMessage = '';

        if (
            !this.editTitle.trim() ||
            !this.editContent.trim() ||
            !this.editCategory
        ) {

            this.errorMessage =
                'Please complete all required fields.';

            return;
        }

        this.updatingArticle = true;

        const article = {

            title: this.editTitle.trim(),

            content: this.editContent.trim(),

            category_id:
                Number(this.editCategory)
        };

        this.knowledgeBaseService
            .updateArticle(
                this.editingArticle.id,
                article
            )
            .subscribe({

                next: () => {

                    this.successMessage =
                        'Knowledge Base article updated successfully.';

                    this.updatingArticle = false;

                    this.editingArticle = null;

                    this.editTitle = '';

                    this.editContent = '';

                    this.editCategory = '';

                    this.loadArticles();
                },

                error: (error) => {

                    console.error(
                        'Error updating article:',
                        error
                    );

                    this.errorMessage =
                        error.error?.message ||
                        'Unable to update article.';

                    this.updatingArticle = false;
                }
            });
    }

    deleteArticle(article: any): void {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${article.title}"?`
        );

        if (!confirmed) {
            return;
        }

        this.errorMessage = '';
        this.successMessage = '';
        this.deletingArticle = true;

        this.knowledgeBaseService
            .deleteArticle(article.id)
            .subscribe({
                next: () => {

                    this.successMessage =
                        'Knowledge Base article deleted successfully.';

                    this.deletingArticle = false;

                    if (
                        this.selectedArticle &&
                        this.selectedArticle.id === article.id
                    ) {
                        this.selectedArticle = null;
                    }

                    this.loadArticles();
                },

                error: (error) => {

                    console.error(
                        'Error deleting article:',
                        error
                    );

                    this.errorMessage =
                        error.error?.message ||
                        'Unable to delete article.';

                    this.deletingArticle = false;
                }
            });
    }
}

