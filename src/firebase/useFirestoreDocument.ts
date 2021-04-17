import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useEffect, useReducer } from 'react';

interface State {
  documentReference: FirebaseFirestoreTypes.DocumentReference | null;
  data: any | null;
  initialLoadComplete: boolean;
}

type DataLoadedAction = {
  type: 'dataLoaded';
  docRef: FirebaseFirestoreTypes.DocumentReference;
  data: any;
};

type Actions = DataLoadedAction;

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'dataLoaded': {
      const docRefChanged = !state.documentReference?.isEqual(action.docRef);
      return {
        documentReference: docRefChanged ? action.docRef : state.documentReference,
        data: action.data,
        initialLoadComplete: true
      };
    }
    default:
      return state;
  }
}

export function useFirestoreDocument<TDoc>(
  collectionName: string,
  documentID: null | undefined | string,
  listenForChanges: boolean = false
): [TDoc | null, FirebaseFirestoreTypes.DocumentReference | null, boolean] {
  const [state, dispatch] = useReducer(reducer, {
    documentReference: null,
    data: null,
    initialLoadComplete: false
  });

  useEffect(() => {
    if (!!collectionName && !!documentID) {
      const docRef = firestore().collection(collectionName).doc(documentID);

      if (listenForChanges) {
        const unsubscribe = docRef.onSnapshot(snapshot => {
          const data = snapshot.data();

          dispatch({ type: 'dataLoaded', docRef: docRef, data: data });
        });

        return unsubscribe;
      } else {
        docRef.get().then(snapshot => {
          const data = snapshot.data();

          dispatch({ type: 'dataLoaded', docRef: docRef, data: data });
        });
      }
    }
  }, [collectionName, documentID, listenForChanges]);

  return [state.data as TDoc, state.documentReference, state.initialLoadComplete];
}
