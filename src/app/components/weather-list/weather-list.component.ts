import { Component, OnInit } from '@angular/core';
import { Weather } from 'src/app/models/weather';

import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.component.html',
  styleUrls: ['./weather-list.component.css']
})
export class WeatherListComponent implements OnInit {

  //crear un lista que extienda del objeto Weather y se le asigna un arreglo vacio para cargar los datos
  weatherList: Weather[];

  constructor(private weatherService: WeatherService) { }

  //llamar a la funcion getDataWeather que viene de weather.service
  //cada item sera el dato retornado al cual se le hace un foreach para seleccionarlo por su  key y colocarlo en el objeto Weather
  ngOnInit() {
    this.weatherService.getDataWeather()
      .snapshotChanges()
      .subscribe(item => {
        this.weatherList = [];
        item.forEach(element => {
          let x = JSON.parse(JSON.stringify(element.payload));
          x['$key'] = element.key;
          this.weatherList.push(x as Weather);
          
          
        })
      })
      
  }
  //Completo el objeto Weather se puede llamar a cada dato desde weather-list-component.html

  verMapa(latitude, longitude) {
    console.log(latitude + " " + longitude);
    let url = `https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d3283.642520923987!2d${longitude}!3d${latitude}!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1613871595921!5m2!1ses-419!2sar"`
    
    let divMapa = document.querySelector('#mapa');

    divMapa.innerHTML = `
      <iframe src=${url} width="700" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    `;

  }
 
}
