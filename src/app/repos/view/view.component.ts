import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, Search } from 'lucide-angular';
import { GitHubResponse } from '../serviceList';
import { gitHubService } from '../serviceList.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
})
export class ViewComponent {
  id!: number;
  post!: GitHubResponse;

  username: string = 'katerinBarrera';

  readonly Search = Search;

  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    public gitHubService: gitHubService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Write code on Method
   *
   * @return response()
   */

  ngOnInit(): void {}

  searchByUserName() {
    if (!this.username.trim()) {
      alert('Por favor, escriba un nombre de usuario');
      return;
    }

    this.router.navigate(['/search', this.username]);
  }
}
