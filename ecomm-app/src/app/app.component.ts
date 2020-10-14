import { Component, OnInit } from '@angular/core';
import { AppConstants} from './constants/app-constants'
import { HeaderComponent } from './components/header/header.component';
import { LoadingService } from './services/loading-service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = AppConstants.baseUrl;
  loading = true;
  constructor(private loadingService:LoadingService){}

  ngOnInit(){
    this.loadingService.getMessage().subscribe(result=> {this.loading = !result ;
    }
      )

      
  }
 
}
