import { environment } from './../../environments/environment';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AllNotificationsService } from '../pages/all-notifications/all-notifications.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private readonly _http: HttpClient;

  private readonly _baseUrl: string = environment.baseUrlWithoutApi + '/NotificationHub/';
  private hubConnection: HubConnection;
  private audio: any;
  private lenght: number;
  constructor(private _allNotificationsService: AllNotificationsService) {
    this.createConnection();
    this.audio = new Audio('./../../assets/sounds/tweet.mp3');
  }
  // var connection = new signalR.HubConnectionBuilder().withUrl("/globalHub", { accessTokenFactory: () => "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWRiZWx0YWplQGdtYWlsLmNvbSIsIm5hbWVpZCI6IjEwMDE3Iiwicm9sZSI6IjIiLCJTdGF0dXMiOiIyIiwiTGFuZyI6ImVuIiwibmJmIjoxNjQzNzExNjc0LCJleHAiOjE2NzUyNDc2NzQsImlhdCI6MTY0MzcxMTY3NH0.yx49KVF0ZGHMG_QSUYM1qn-NnHS50P3twBgkIgmKQZA" }).build();
  createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this._baseUrl, {
        accessTokenFactory: () => localStorage.getItem('token')!,
        // skipNegotiation: true,
        // transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Debug)
      .build();
    this.startConnection();
  }

  private register(): void {
    this.hubConnection.on('ReceiveMessage', (res: any) => {
      this.audio.play();
      this.audio.play();
      let msg = JSON.parse(res);
      this._allNotificationsService.addNotification(msg);
    });
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        // this.hubConnection.send('NewMessage','1184')
        // this.hubConnection.invoke('1184');
        // this.hubConnection.invoke('NewMessage',[''])
        // this.hubConnection.invoke("NewMessage", "1184")

        this.register();
      })
      .catch((err) => {});
  }
}
