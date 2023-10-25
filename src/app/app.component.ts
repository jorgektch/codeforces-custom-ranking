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

  public members: any[] = ['jorgektch', 'cat_ta4', 'lauranotfound', 'luiz2002'];
  public dataset: any[] = [];

  constructor(
    private codeforcesService: CodeforcesService,
  ){}

  ngOnInit(): void {
    console.log("Antes de llamar a getData");
    this.getData(this.members);
  }

  private getData(members: any[]) {
    for (let member of this.members) {
      console.log(member); // prints values: 10, 20, 30, 40

      this.codeforcesService.getData(member).subscribe(
        (response) => {
          //this.universities = response.data;
          this.dataset.push({'handleCodeforces': member, 'rating': response.result});
          console.log("xddddddddddddddd");
          console.log(this.dataset);
        },
        (error) => {
          console.log('Something went wrong: ', error);
        }
      );
    }
    console.log("dataset antes de ordenar: --------------");
    console.log(this.dataset);
    this.dataset.sort((a, b) => a.rating.at(-1).newRating - b.rating.at(-1).newRating);
    console.log("dataset luego de ordenar: --------------");
    console.log(this.dataset);
    /*
    this.codeforcesService.getData(handleCodefoces).subscribe(
      (response) => {
        //this.universities = response.data;
        for (var val of this.members) {
          console.log(val); // prints values: 10, 20, 30, 40
        }
        this.dataset = response.result;
        console.log("xddddddddddddddd");
        console.log(this.dataset);
      },
      (error) => {
        console.log('Something went wrong: ', error);
      }
    );
    */
  }
}
