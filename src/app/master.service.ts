import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private firestoreDB: AngularFirestore) { }

  public getCollection(path, query?) {
    return this.firestoreDB
      .collection(path, query)
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  public getDoc(path): Observable<any> {
    return this.firestoreDB
      .doc(path)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  public insert(collectionName, obj) {
    obj.createdAt = new Date();
    return this.firestoreDB.collection(collectionName).add(obj);
  }

  public update(docRef, obj) {
    return this.firestoreDB.doc(docRef).update(obj);
  }

  public delete(path) {
    return this.firestoreDB.doc(path).delete();
  }

}
