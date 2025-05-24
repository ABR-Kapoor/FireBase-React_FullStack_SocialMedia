import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import Stories from "@/components/Stories";
import { Input } from "@/components/ui/input";
import { useUserAuth } from "@/context/useAuthContext";
import { getPosts } from "@/Repository/post.service";
import { DocumentResponse } from "@/types";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

interface IHomeProps {}

const Home: React.FC<IHomeProps> = () => {
  const { user } = useUserAuth();
  const [data, setData] = useState<DocumentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAllPost = async () => {
    try {
      const response = await getPosts();
      if (Array.isArray(response)) {
        setData(response);
        console.log("✅ (home) Posts loaded:", response);
      } else {
        console.error("❌ getPosts() did not return an array", response);
        setData([]);
      }
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllPost();
    }
  }, [user]);

  return (
    <Layout>
      <div className="flex flex-col">
        {/* Search Input */}
        <div className="relative mb-6 w-full text-gray-600">
          <Input
            type="search"
            name="search"
            placeholder="Search"
            className="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-sm text-base focus:outline-none"
          />
          <button type="submit" className="absolute right-2.5 top-2.5">
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Stories */}
        <div className="mb-5 overflow-y-auto">
          <h2 className="mb-5">Stories</h2>
          <Stories />
        </div>

        {/* Feed */}
        <div className="mb-5">
          <h2 className="mb-5">Feed</h2>
          <div className="w-full flex justify-center">
            <div className="flex flex-col max-w-sm rounded-sm overflow-hidden">
              {loading ? (
                <div>...Loading</div>
              ) : data.length > 0 ? (
                data.map((item) => <PostCard data={item} key={item.id} />)
              ) : (
                <div>No posts found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
