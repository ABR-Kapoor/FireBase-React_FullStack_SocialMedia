// uploadcare are being used to store img and media file...
// let's see if can use pinata cloud (web3) for the same

import FileUploader from "@/components/fileUploader";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserAuth } from "@/context/useAuthContext";
import { createPost } from "@/Repository/post.service";
import { FileEntry, PhotoMeta, Post } from "@/types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ICreatePostProps {}

const CreatePost: React.FC<ICreatePostProps> = (props: ICreatePostProps) => {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [fileEntry, setFileEntry] = useState<FileEntry>({ files: [] });
  const [post, setPost] = useState<Post>({
    caption: "",
    photos: [],
    likes: 0,
    userlikes: [],
    username: user?.displayName!,
    photoURL: user?.photoURL!,
    userId: user?.uid,
    date: new Date(),
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Uploaded file entry: ", fileEntry.files);
    console.log("The created post is: ", post);

    const photoMeta: PhotoMeta[] = fileEntry.files.map((f) => ({
      cdnUrl: f.cdnUrl!,
      uuid: f.uuid!,
    }));
    if (user != null) {
      const newPost: Post = { 
        ...post, 
        photos: photoMeta, 
        userId: user.uid,
        username: user.displayName!,
        photoURL: user.photoURL!
      };
      console.log("The new post is: ", newPost);
      await createPost(newPost);
      navigate("/");
    } else {
      console.log("User is null");
      navigate("/login");
    }
  };

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="border max-w-3xl w-full">
          <h3 className="bg-slate-800 text-white text-center text-lg p-2">
            Create Post
          </h3>
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <Label className="mb-4" htmlFor="caption">
                  Photo Caption
                </Label>
                <Textarea
                  className="mb-8"
                  id="caption"
                  placeholder="What's in your photo?"
                  value={post.caption}
                  onChange={(e) =>
                    setPost({ ...post, caption: e.target.value })
                  }
                />
                <div className="flex flex-col">
                  <Label className="mb-4" htmlFor="photo">
                    Photos
                  </Label>
                  <FileUploader
                    fileEntry={fileEntry}
                    onChange={setFileEntry}
                    preview={true}
                  />
                </div>
                <Button
                  className="mt-2 px-4 py-2 bg-slate-800 text-white rounded"
                  onClick={() => {
                    console.log(
                      "🟢 Final Uploaded Files:",
                      fileEntry.files.map((f) => ({
                        name: f.name,
                        cdnUrl: f.cdnUrl,
                        uuid: f.uuid,
                      }))
                    );
                  }}
                >
                  {" "}
                  Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePost;
