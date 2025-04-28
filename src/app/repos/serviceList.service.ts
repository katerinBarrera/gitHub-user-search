import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GitHubResponse } from './serviceList';

@Injectable({
  providedIn: 'root',
})
export class gitHubService {
  private apiURL = 'https://api.github.com/users/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getByUsername(
    username: string,
    page: number = 1,
    perPage: number = 10,
    totalPages: number,
    language: string = '',
    minStars: string = '0',
    sort: string = 'stars'
  ): Observable<any> {
    let url = `${this.apiURL}${username}/repos?page=${page}&per_page=${perPage}`;
    if (language !== '' || minStars !== '') {
      url = `${this.apiURL}${username}/repos?`;
    }

    if (sort !== '') {
      url += `&sort=${sort}`;
    }

    return this.httpClient.get(url, { observe: 'response' }).pipe(
      map((response: any) => {
        const linkHeader = response.headers.get('Link');
        let lastPage = null;
        let data = response.body;

        if (language !== '') {
          const fullFilteredData = response.body.filter(
            (repo: GitHubResponse) => repo.language === language
          );
          const start = (page - 1) * perPage;
          const end = start + perPage;

          data = fullFilteredData.slice(start, end);
          if (fullFilteredData.length / perPage > 1) {
            lastPage = Math.ceil(fullFilteredData.length / perPage);
          }
        }
        if (minStars !== '') {
          const fullFilteredData = response.body.filter(
            (repo: GitHubResponse) => repo.stargazers_count >= Number(minStars)
          );
          const start = (page - 1) * perPage;
          const end = start + perPage;

          data = fullFilteredData.slice(start, end);
          if (fullFilteredData.length / perPage > 1) {
            lastPage = Math.ceil(fullFilteredData.length / perPage);
          }
        }

        if (linkHeader) {
          const links = linkHeader.split(',');
          const lastLink = links.find((link: string) =>
            link.includes('rel="last"')
          );

          if (lastLink) {
            const match = lastLink.match(/page=(\d+)&/);
            if (match) {
              lastPage = parseInt(match[1], 10);
            }
          } else {
            lastPage = totalPages;
          }
        }

        return {
          repos: data,
          lastPage,
        };
      }),
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: any) {
    let errorMessage = {};
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = {
        errorCode: error.status,
        message: error.message,
      };
    }
    return throwError(errorMessage);
  }
}
