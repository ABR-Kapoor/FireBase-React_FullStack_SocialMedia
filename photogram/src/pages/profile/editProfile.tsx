import FileUploader from "@/components/fileUploader";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileEntry, ProfileInfo, ProfileRespose, UserProfile } from "@/types";
import React, { useEffect, useState } from "react";
import avatar from "../../assets/avatar.png";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createUserProfile,
  updateUserProfile,
} from "@/Repository/user.service";
import { useUserAuth } from "@/context/useAuthContext";
import { updateUserInfoOnPost } from "@/Repository/post.service";

const EditProfile = () => {
  const { user, updateProfileInfo } = useUserAuth();
  const [fileEntry, setFileEntry] = useState<FileEntry>({ files: [] });
  console.log("(fileEntry)📤 Uploaded Files:", fileEntry.files);
  const location = useLocation();
  const navigate = useNavigate();
  const { id, userid, displayName, photoURL, userBio } = location.state;

  const [data, setData] = useState<UserProfile>({
    userid,
    displayName,
    photoURL,
    userBio,
  }); 

  const updateProfile = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (id) {
        const res = await updateUserProfile(id, data);
        console.log("(edit: UpdateProfile)📝 from updateProfile()", res);
      } else {
        const res = await createUserProfile(data);
        console.log("(edit: CreatedProfile)📝 from updateProfile()", res);
      }
      const profileInfo: UserProfile = {
        user: user!,
        displayName: data.displayName,
        photoURL: data.photoURL,
        userBio: data.userBio
      };

      updateProfileInfo(profileInfo)
      updateUserInfoOnPost(profileInfo)
      navigate("/profile");
    } catch (e) {
      console.log("(edit: updateProfile)❌ Error", e);
    }
  };

  console.log("(edit: outside)📤 Uploaded Files:", fileEntry.files);
  console.log("(edit: outside)📝 Updated Profile:", data);

  useEffect(() => {
    if (fileEntry.files.length > 0) {
      setData({ ...data, photoURL: fileEntry.files[0].cdnUrl || "" });
    }
  }, [fileEntry]);

  return (
    <Layout>
      <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
        <div className="border shadow-lg max-w-3xl w-full rounded-xl bg-white">
          <h3 className="bg-slate-800 text-white text-center text-xl font-semibold py-4 rounded-t-xl">
            Edit Profile
          </h3>

          <form onSubmit={updateProfile} className="p-8 space-y-8">
            {/* Profile Photo */}
            <div className="flex flex-col items-center relative group">
              <div className="relative">
                {fileEntry.files.length > 0 ? (
                  <img
                    src={fileEntry.files[0].cdnUrl!}
                    alt="avatar"
                    className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover group-hover:brightness-75 transition"
                  />
                ) : (
                  <img
                    src={data.photoURL || avatar}
                    alt="avatar"
                    className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover group-hover:brightness-75 transition"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black bg-opacity-50 rounded-full cursor-pointer">
                  <span className="text-white text-sm font-medium">
                    Edit Photo
                  </span>
                </div>
              </div>
              <Label
                htmlFor="photo"
                className="mt-4 text-sm font-medium text-gray-700"
              >
                Change Profile Photo
              </Label>
              <FileUploader
                fileEntry={fileEntry}
                onChange={setFileEntry}
                preview={false}
              />
            </div>

            {/* Username */}
            <div>
              <Label
                htmlFor="displayName"
                className="text-sm font-medium text-gray-700"
              >
                Edit Username
              </Label>
              <Input
                id="displayName"
                placeholder="Enter your username..."
                value={data.displayName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, displayName: e.target.value })
                }
                className="mt-2 border-gray-300 shadow-sm focus:border-slate-800 focus:ring-slate-800"
              />
            </div>

            {/* Bio */}
            <div>
              <Label
                htmlFor="userBio"
                className="text-sm font-medium text-gray-700"
              >
                Edit Bio
              </Label>
              <Input
                id="userBio"
                placeholder="Enter your bio..."
                value={data.userBio}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, userBio: e.target.value })
                }
                className="mt-2 border-gray-300 shadow-sm focus:border-slate-800 focus:ring-slate-800"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="submit"
                // onClick={updateProfile}
                className="w-36 bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition font-semibold"
              >
                Save Changes
              </Button>

              <Button
                variant={"destructive"}
                className="w-36 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition font-semibold"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;
