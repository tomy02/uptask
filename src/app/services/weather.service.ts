import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Weather } from '../models/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiKey = '5a48c3471f1790f3cdcad6a26f68ea2d';
  URI: string = '';

  weatherList: AngularFireList<any>;

  constructor(private http: HttpClient, private firebase: AngularFireDatabase) {
      this.URI = `http://api.openweathermap.org/data/2.5/weather?&appid=${this.apiKey}&units=metric&lang=es&q=`
  }
  
  getWeather(cityName: string, countryCode: string) {
    return this.http.get(`${this.URI}${cityName},${countryCode}`)
    
  }

  getDataWeather() {
    return this.weatherList = this.firebase.list('/weathers');
    //console.log(this.weatherList);
  }


  insertWeather(name: string, code: string, temp:string, hum: string, desc:string, lon:string, lat:string, date: string) {
    console.log(name);
    this.weatherList = this.firebase.list('/weathers');
    this.weatherList.push({
      cityName: name,
      countryCode: code,
      temperature: temp,
      humidity: hum,
      description: desc,
      longitude: lon,
      latitude: lat,
      date: date,
      url: `https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d3283.642520923987!2d${lon}!3d${lat}!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sar!4v1613871595921!5m2!1ses-419!2sar`
    });
    
    
  }

  

}
