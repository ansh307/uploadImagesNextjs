
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { get } from "http";

const firebaseConfig = {
    apiKey: "AIzaSyDxwa6tJIUO6QGFaZPcnFguzwnsihnDjcY",
    authDomain: "fileuploading-73095.firebaseapp.com",
    projectId: "fileuploading-73095",
    storageBucket: "fileuploading-73095.appspot.com",
    messagingSenderId: "76065578583",
    appId: "1:76065578583:web:d7269ddd61097948f6cd12"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)



// <input type="file" onChange={handleFileChange} />
//           <button
//             onClick={uploadImage}
//             className="bg-white text-black hover:bg-black border border-white hover:text-white font-bold py-2 px-4 rounded shadow"
//           >
//             Upload Image
//           </button>