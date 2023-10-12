"use client"

import { useState, useEffect } from "react";
import { storage } from "./firebase";
import { ref, uploadBytes, listAll, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
import { v4 } from "uuid";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function Home() {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageUpload(file);
    }
  };

  const imageListRef = ref(storage, "images");

  const uploadImage = () => {
    if (imageUpload === null) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      alert(`Image uploaded successfully`);
      getDownloadURL(imageRef).then((url) => {
        setImageList((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imageListRef)
      .then((response) => {
        Promise.all(
          response.items.map((item) => getDownloadURL(item))
        ).then((urls) => {
          setImageList(urls);
          setLoading(false); // Set loading to false once images are loaded
        });
      })
      .catch((error) => {
        console.error("Error fetching image list:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []);

  const handleDeleteImage = async (url: string) => {
    try {
      const imageRef = ref(storage, url);
      // Delete the image from Firebase Storage
      await deleteObject(imageRef);
      // Remove the deleted image from the imageList
      setImageList((prev) => prev.filter((image) => image !== url));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  
  const handleDownloadImage = (url: string) => {
    // Create an anchor element
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank"; // Open the URL in a new tab
    link.download = url.substring(url.lastIndexOf("/") + 1); // Set the filename based on the URL
    link.click();
  };


  const handleViewImage = (url: string) => {
    // To view the image, you can open it in a new tab/window
    window.open(url, "_blank");
  };


  return (
    <main className="flex items-center justify-center">
      <div className="flex">
        <div>
          <div className="flex items-center justify-center mb-10">
            <div className="bg-gray-500 p-4 rounded-b-lg">
              <label
                htmlFor="fileInput"
                className="bg-white text-black hover:bg-black border border-white hover:text-white font-bold py-2 px-4 rounded-l-lg shadow cursor-pointer"
              >
                + Choose an image
              </label>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
              />
              <button onClick={uploadImage} className="bg-white text-black hover:bg-black border border-white hover:text-white font-bold py-2 px-4 rounded shadow cursor-pointer">
                Upload Image
              </button>
              <p className="text-sm text-gray-300">{imageUpload?.name}</p>

            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-2 border border-gray-300 rounded-lg shadow h-60 w-60"
                >
                  <Skeleton width={240} height={240} />
                </div>
              ))}
            </div>
          ) : (
            // Render your actual images here
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {imageList.map((url, index) => (
                <div key={index} className="mb-6">
                  <div className="bg-white p-2 border border-gray-300 rounded-lg shadow h-60 w-60 transition-transform transform hover:scale-105">
                    <img src={url} alt={`Image ${index}`} className="max-w-full max-h-full text-black" />
                  </div>
                  <button
                    onClick={() => handleDownloadImage(url)}
                    className="bg-blue-500 text-white font-bold py-2 px-1 rounded-lg mt-2 w-full"
                  >
                    DownLoad
                  </button>
                  <button
                    onClick={() => handleViewImage(url)}
                    className="bg-green-500 text-white font-bold py-2 px-1 rounded-lg mt-2 w-full"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteImage(url)}
                    className="bg-red-500 text-white font-bold py-2 px-1 rounded-lg mt-2 w-full"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
