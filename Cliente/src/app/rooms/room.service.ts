import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SERVER_SERVICE } from '../comun/i-server';
import { ServerService } from '../comun/server.service';
import { NameNotValid } from './exceptions/name-not-valid';
import { RoomNotExists } from './exceptions/room-not-exists';
import { Room } from './room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  newRoom: any;

  constructor(@Inject(SERVER_SERVICE) private server: ServerService) { }

  async asignDevice(device: string, room: Room): Promise<void> {
    return await this.server.asignDevice(device, room).catch(() => { throw new RoomNotExists(room.name); });
  }

  async deleteRoom(room: string): Promise<void> {
    return await this.server.deleteRoom(room).catch(() => { throw new RoomNotExists(room); });
  }

  async addRoom(room: string): Promise<void> {
    await this.server.addRoom(room).catch(() => { throw new NameNotValid(room); });
  }

  async getRoom(room: string): Promise<Room> {
    return await this.server.getRoom(room).catch(() => { throw new RoomNotExists(room); });
  }

  getRooms(): Observable<Array<Room>> {
    return this.server.getRooms().pipe(map((rooms) => {
      return rooms.sort((a, b) => {
        let ret = 0;
        if (a.name > b.name) {
          ret = 1;
        }
        else if (a.name < b.name) {
          ret = -1;
 }
        return ret;
      });
    }));
  }

  getRoomsWithAlarms(): Observable<Array<string>> {

    return this.server.getRooms().pipe(map((rooms) => {
      const newNames = [];
      for (const room of rooms) {
        if (room.devices.find((d) => d.state == 'ON')) {
          newNames.push(room.name);
        }
      }

      return newNames;
    }));
  }

  async updateRoom(room: string, newRoom: string): Promise<void> {
    return await this.server.updateRoom(room, newRoom).catch(() => { throw new NameNotValid(newRoom); });
  }
}
