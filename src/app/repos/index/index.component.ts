import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  BadgeAlert,
  Bird,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleArrowLeft,
  LucideAngularModule,
  Search,
  Squirrel,
  Star,
  UserSearch,
} from 'lucide-angular';
import { Filters, GitHubResponse, ResponseService } from '../serviceList';
import { gitHubService } from '../serviceList.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {
  repoList: GitHubResponse[] = [];
  filters: Filters = {
    page: 1,
    perPage: 6,
    lastPage: 1,
    direction: '',
    language: '',
    sort: '',
    stars: '',
  };
  showNoFoundMessage: boolean = false;
  showNoPublicRepositoryMessage: boolean = false;
  showPageUser: boolean = true;

  username!: string;
  avatarUser?: string;
  lastAvatarUser?: string;

  loading: boolean = false;
  readonly Star = Star;
  readonly squirrel = Squirrel;
  readonly bird = Bird;
  readonly search = Search;
  readonly GoBack = CircleArrowLeft;
  readonly nextPage = ChevronRight;
  readonly previosPage = ChevronLeft;
  readonly firstPage = ChevronsLeft;
  readonly lastPageIcon = ChevronsRight;
  readonly userSearch = UserSearch;
  readonly alert = BadgeAlert;

  constructor(
    public gitHubService: gitHubService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    this.loadRepos();
  }

  loadRepos(resetPage?: boolean): void {
    if (resetPage) {
      this.filters.page = 1;
    }

    this.loading = true;
    this.gitHubService
      .getByUsername(
        this.route.snapshot.params['username'],
        this.filters.page,
        this.filters.perPage,
        this.filters.lastPage,
        this.filters.language,
        this.filters.stars,
        this.filters.sort
      )
      .subscribe({
        next: (data: ResponseService) => {
          if (
            this.repoList.length === 0 &&
            this.filters.language === '' &&
            this.filters.stars === ''
          ) {
            this.showNoPublicRepositoryMessage = true;
          } else {
            this.showPageUser = true;
            this.showNoPublicRepositoryMessage = false;
          }
          this.repoList = data.repos;
          this.avatarUser = data.repos.at(0)?.owner?.avatar_url;
          if (this.avatarUser) {
            this.lastAvatarUser = this.avatarUser;
          }
          this.filters.lastPage = data.lastPage;
        },
        error: (err) => {
          if (err.errorCode >= 400) {
            this.showNoFoundMessage = true;
          } else {
            this.showNoPublicRepositoryMessage = true;
          }
          this.showPageUser = false;
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.avatarUser = this.lastAvatarUser;
        },
      });
  }

  loadFirstPage(): void {
    this.filters.page = 1;
    this.loadRepos();
  }

  loadLastPage(): void {
    this.filters.page = this.filters.lastPage;
    this.loadRepos();
  }

  loadNextPage(): void {
    this.filters.page++;
    this.loadRepos();
  }

  loadPreviousPage(): void {
    if (this.filters.page > 1) {
      this.filters.page--;
      this.loadRepos();
    }
  }
}
