import { db } from "@/firebaseConfig";
import { DocumentResponse, Post, ProfileInfo } from "@/types";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";

const COLLECTION_NAME = "post";

export const createPost = (post: Post) => {
    return addDoc(collection(db, COLLECTION_NAME), post);
}

export const getPosts = async () => {

    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
        const tempArr: DocumentResponse[] = [];
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Post;
                const resObj: DocumentResponse = { ...data, id: doc.id };
                console.log("✅ The Response Object data is:", resObj);
                tempArr.push(resObj);
            });
        }
        else { console.log("⚠️ No documents found in collection!"); }
        return tempArr;
    } catch (error) {
        console.error("❌ Error fetching posts:", error);
        return [];
    }
}

export const getPostByUserId = (id: string) => {
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", id));
    return getDocs(q);
}

export const getPost = (id: string) => {
    const docRef = query(collection(db, COLLECTION_NAME, id));
    return getDoc(docRef);
}

export const deletePost = (id: string) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    return deleteDoc(docRef);
}

export const updateLikeOnPost = async (id: string, userlikes: [], likes: number) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(docRef, {
        likes: likes,
        userlikes: userlikes,
    })
}

export const updateUserInfoOnPost = async (profileInfo: ProfileInfo) => {
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", profileInfo.user?.uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
            const docRef = doc(db, COLLECTION_NAME, doc.id);
            updateDoc(docRef, {
                username: profileInfo.displayName,
                photoURL: profileInfo.photoURL,
            });
        });
    } else {
        console.log("⚠️ user does not have any posts!");
    }

}