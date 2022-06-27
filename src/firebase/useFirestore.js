import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from './config';

const useFirestore = ({ collectionName = 'gallery' }) => {
  const [documents, setDocuments] = useState([]);
  const { setAlert } = useAuth();
  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const docs = [];
        snapshot.forEach((doc) => {
          docs.push({ id: doc.id, data: doc.data() });
        });
        setDocuments(docs);
      },
      (error) => {
        console.log(error);
        setAlert({
          isAlert: true,
          severity: 'error',
          message: error.message,
          timeout: 3000,
          location: 'main',
        });
      }
    );
    return unsub;
  }, [collectionName, setAlert]);
  return { documents };
};

export default useFirestore;
