import Layout from "@/components/Layout";
import { useUserAuth } from "@/context/useAuthContext";
import { DocumentResponse, Post, ProfileRespose, UserProfile } from "@/types";
import React, { useEffect, useState } from "react";
import avatar from "../../assets/avatar.png";
import { Button } from "@/components/ui/button";
import { Edit2Icon, HeartIcon } from "lucide-react";
import { getPostByUserId } from "@/Repository/post.service";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "@/Repository/user.service";

interface IPropfileProps {}

const Profile: React.FC<IPropfileProps> = () => {
  const navigate = useNavigate();
  const { user, updateProfileInfo } = useUserAuth();

  const initialUserInfo: UserProfile = {
    id: "",
    userid: user?.uid || "",
    displayName: user?.displayName || "Guest_User",
    photoURL: user?.photoURL || "",
    userBio: "Please upload your bio...",
  };

  const [userInfo, setUserInfo] = useState<ProfileRespose>(initialUserInfo);
  const [data, setData] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllPost = async (uid: string) => {
    try {
      const querySnapshot = await getPostByUserId(uid);
      const tempArr: DocumentResponse[] = [];

      querySnapshot?.forEach((doc) => {
        const postData = doc.data() as Post;
        const responseObj: DocumentResponse = { ...postData, id: doc.id };
        tempArr.push(responseObj);
      });

      setData(tempArr);
    } catch (error) {
      console.error("❌ Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserProfileInfo = async (uid: string) => {
    try {
      const data: ProfileRespose = (await getUserProfile(uid)) as UserProfile;
      setUserInfo(data);
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      getUserProfileInfo(user.uid);
      getAllPost(user.uid);
    }
  }, [user]);

  const editProfile = () => {
    navigate("/edit-profile", { state: userInfo });
  };

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
  <div className="flex justify-center">
    <div className="w-full max-w-3xl border border-slate-200 rounded-xl shadow-md overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 text-white flex justify-between items-center">
        <h3 className="text-lg font-bold">Profile</h3>
        <Button
          variant="ghost"
          className="text-white hover:bg-slate-600 hover:text-yellow-400"
          onClick={() => editProfile()}
        >
          <Edit2Icon className="mr-1 h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Profile Info */}
      <div className="p-6 flex items-center gap-6 border-b border-slate-100">
        <img
          src={user?.photoURL ? user.photoURL : avatar}
          alt="avatar"
          className="w-20 h-20 rounded-full border-2 border-slate-300 shadow-sm object-cover"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-slate-800">
            {user?.displayName}
          </h2>
          <p className="text-slate-500 text-sm mt-1">{userInfo?.userBio}</p>
          <p className="text-slate-400 text-xs mt-1">
            {user?.email ? user.email : "Guest User"}
          </p>
        </div>
      </div>

          {/* Posts Section */}
          <div className="p-4">
            <h4 className="text-md font-semibold text-slate-800 mb-4">
              My Posts
            </h4>
            {loading ? (
              <p className="text-slate-400">Loading...</p>
            ) : data.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {renderPost()}
              </div>
            ) : (
              <p className="text-slate-400">No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
