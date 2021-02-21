import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  weather;

  constructor(private watherService: WeatherService) {
    
  }

  ngOnInit() {
     
  }

  insertWeather(name: string, code: string, temp: string, hum: string, desc:string, lon:string, lat:string, date: string) {
    this.watherService.insertWeather(name, code, temp, hum, desc, lon, lat, date)
    
  }

  getWeather(cityName:string, countryCode:string) {
    this.watherService.getWeather(cityName, countryCode).subscribe(
      res => this.weather = res,
      err => console.log(err),
      () => {
        let d = new Date();

        let date = d.getDate() + "/" + (d.getMonth() +1) + "/" + d.getFullYear();
        console.log(this.weather)
        this.insertWeather(cityName, countryCode, this.weather.main.temp, this.weather.main.humidity, this.weather.weather[0].description, this.weather.coord.lon, this.weather.coord.lat, date.toString())
      }
    )
    
  }

  submitLocation(cityName: HTMLInputElement, countryCode: HTMLInputElement) {
    if (cityName.value && countryCode.value) {
      
    
    this.getWeather(cityName.value, countryCode.value);

    cityName.value = '';
    countryCode.value = '';
      
    } else {
      alert('Por favor inserte datos correctos');
    }
    cityName.focus();

    return false;
  }

  getDataWeather() {
    this.watherService.getDataWeather()
  }

  /*historial() {
    //this.getDataWeather()
    console.log('historial');
  }*/
  
}
