import { useUserAuth } from "@/context/useAuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/pages/components/ui/card";
import { DocumentResponse } from "@/types";
import React, { useState } from "react";
import avatar from "../../assets/avatar.png";

import {
  BookmarkIcon,
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateLikeOnPost } from "@/Repository/post.service";
// import { cn } from "@/lib/utils";

interface IPostCardProps {
  data: DocumentResponse;
}

const PostCard: React.FC<IPostCardProps> = ({ data }: IPostCardProps) => {
  const { user } = useUserAuth();

  const [likeInfo, setLikeInfo] = useState<{ likes: number; isLiked: boolean }>(
    {
      likes: data.likes!,
      isLiked: data.userlikes!.includes(user?.uid) ? true : false,
    }
  );

const updateLike = async (hasLiked: boolean) => {
  const newLikes = hasLiked
    ? likeInfo.likes + 1
    : Math.max(likeInfo.likes - 1, 0); // Ensures likes don't go below 0

  setLikeInfo({
    isLiked: !likeInfo.isLiked,
    likes: newLikes,
  });

  if (hasLiked) {
    data.userlikes?.push(user!.uid);
  } else {
    const index = data.userlikes?.indexOf(user!.uid);
    if (index !== undefined && index > -1) {
      data.userlikes?.splice(index, 1);
    }
  }

  await updateLikeOnPost(data.id, data?.userlikes, newLikes);
};


  return (
    <Card className="mb-6 rounded-xl border border-slate-200 shadow-sm bg-white">
      {/* Header */}
      <CardHeader className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={user?.photoURL || avatar}
            alt="User"
            className="w-10 h-10 rounded-full border border-slate-300 object-cover"
          />
          <div className="flex flex-col">
            <CardTitle className="text-sm font-semibold text-slate-800">
              {user?.displayName || "Bhadwa User"}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Just now
            </CardDescription>
          </div>
        </div>
        <div className="text-xl text-slate-400 cursor-pointer">⋮</div>
      </CardHeader>

      {/* Image */}
      <CardContent className="p-0">
        <img
          src={data.photos ? data.photos[0].cdnUrl : ""}
          alt="Post"
          className="w-full object-cover max-h-[500px] select-none"
        />
      </CardContent>

      {/* Footer Buttons */}
      <CardFooter className="px-4 py-3 flex flex-col gap-1">
        <div className="flex items-center justify-between w-full mb-1">
          <div className="flex items-center gap-4 text-slate-600">
            <HeartIcon
              className={cn(
                "w-6 h-6 cursor-pointer hover:scale-110 transition-transform hover:text-red-500",
                likeInfo.isLiked ? "fill-red-500 text-red-500" : "fill-none"
              )}
              onClick={() => updateLike(!likeInfo.isLiked)}
            />
            <MessageCircleIcon className="w-6 h-6 cursor-pointer hover:text-blue-500 transition-colors" />
            <Share2Icon className="w-6 h-6 cursor-pointer hover:text-green-500 transition-colors" />
          </div>
          <BookmarkIcon className="w-6 h-6 cursor-pointer text-slate-500 hover:text-yellow-500 transition-colors" />
        </div>

        {/* Likes count */}
        <div className="text-mm font-medium text-slate-800">
          {likeInfo.likes}{" "}
          {likeInfo.likes === 1 || likeInfo.likes === 0 ? "like" : "likes"}
        </div>

        {/* Caption */}
        <div className="text-sm text-slate-700 leading-snug">
          <span className="left font-semibold text-slate-900">{user?.displayName || "username toh daal: "} : </span>
          {data.caption}
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;

// local design for a card

// <div className="max-w-sm w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 transition-transform hover:scale-[1.02] duration-300">
//       <div className="w-full h-60 bg-gray-200">
//         <img
//           src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
//           alt="Post"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       <div className="p-4">
//         <h2 className="text-lg font-semibold text-gray-800 truncate">
//           asdf fasd f sdf a df df adf df df ad f d f asdf adf adfadf adf df
//         </h2>

//         <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
//           <div className="flex items-center space-x-1">
//             <svg
//               className="w-5 h-5 text-red-500"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path d="M3.172 5.172a4.004 4.004 0 015.656 0L10 6.343l1.172-1.171a4.004 4.004 0 115.656 5.656L10 18.657l-6.828-6.829a4.004 4.004 0 010-5.656z" />
//             </svg>
//             <span>123</span>
//           </div>
//           <span className="text-xs">12 Jan 2025</span>
//         </div>
//       </div>
//     </div>
