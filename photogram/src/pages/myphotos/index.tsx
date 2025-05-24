import Layout from "@/components/Layout";
import { useUserAuth } from "@/context/useAuthContext";
import { getPostByUserId } from "@/Repository/post.service";
import { DocumentResponse, Post } from "@/types";
import React, { useEffect, useState } from "react";
import { Heart as HeartIcon }  from 'lucide-react';
interface IMyPhotosProps {}

const MyPhotos: React.FC<IMyPhotosProps> = () => {
  const { user } = useUserAuth();
  const [data, setData] = useState<DocumentResponse[]>([]);

  const getAllPost = async (id: string) => {
    try {
      const querySnapshot = await getPostByUserId(id);
      const tempArr: DocumentResponse[] = [];

      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Post;
          const resposnseObj: DocumentResponse = { ...data, id: doc.id };
          console.log("✅ The Response Object data is:", resposnseObj);
          tempArr.push(resposnseObj);
        });
        setData(tempArr);
      } else {
        console.log("⚠️ No such document!");
      }
    } catch (error) {
      console.log("❌ Error fetching posts:", error);
    }
  };

  // ✅ useEffect moved outside of getAllPost
  useEffect(() => {
    if (user?.uid) {
      getAllPost(user.uid);
    }
  }, [user]);

  const renderPost = () => {
  return data.flatMap((item) =>
    item.photos?.map((photo, index) => (
      <div key={`${item.id}-${photo.uuid}-${index}`} className="relative">
        <div className="absolute group transition-all duration-200 bg-transparent hover:bg-slate-950 w-full h-full top-0 bottom-0 left-0 right-0 hover:bg-opacity-75">
          <div className="flex flex-col justify-center items-center w-full h-full">
            <HeartIcon className="hidden fill-red-500 group-hover:block hover:fill-red w-10 h-10" />
            <div className="hidden group-hover:block text-white">
              {item.likes} Like{item.likes !== 1 && "s"}
            </div>
          </div>
        </div>

        <img
          src={`${photo.cdnUrl}/-/progressive/yes/-/scale_crop/300x300/center`}
          alt="Uploaded"
          className="w-full h-full object-cover"
        />
      </div>
    )) || []
  );
};

  return (
    <Layout>
      <div className="flex items-center justify-center">
        <div className="border max-w-3xl w-full">
          <h3 className="bg-slate-800 text-white p-2 text-center ">My Photos</h3>
          <div className="p-2">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
            { data ?  renderPost() : <div>... Loading ...</div> }
            </div>
          </div> 
        </div>
      </div>
    </Layout>
  );
};

export default MyPhotos;
