import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CodeforcesService } from './services/codeforces.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit { // export class AppComponent {
  title = 'codeforces-custom-ranking';

  public displayedColumns: string[] = ['position', 'handle', 'rating'];
  public dataset: any[] = [];
  public members: any[] = ['jorgektch', 'cat_ta4', 'lauranotfound', 'luiz2002'];

  constructor(
    private codeforcesService: CodeforcesService,
  ){}
  
  ngOnInit(): void {
    this.getData(this.members);
  }

  private getData(members: any[]) {
    for (let member of this.members) {
      this.codeforcesService.getData(member).subscribe(
        (response) => {
          //this.universities = response.data;
          //this.dataset.push({'position': NaN, 'handle': member, 'rating': response.result.at(-1).newRating});
          this.dataset.push({'handle': member, 'rating': response.result.at(-1).newRating});
        },
        (error) => {
          console.log('Something went wrong: ', error);
        }
      );
    }
    // Sort
    this.dataset.sort((a, b) => a.rating - b.rating);
    console.log("dataset luego de ordenar: --------------");
    console.log(this.dataset);
  }
}
