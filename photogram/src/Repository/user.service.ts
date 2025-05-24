import { db } from "@/firebaseConfig";
import { ProfileRespose, UserProfile } from "@/types";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

const COLLECTION_NAME = "users";

export const createUserProfile = (User: UserProfile) => {
    try {
        return addDoc(collection(db, COLLECTION_NAME), User);
    } catch (error) {
        console.log(error)
    }
}

export const getUserProfile = async (userid: string) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("userid", "==", userid)
        );
        const querySnapshot = await getDocs(q);
        let tempData: ProfileRespose = {};
        if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
                const userData = doc.data() as UserProfile;
                tempData = {
                    id: doc.id,
                    ...userData,
                }
            });
            return tempData;
        }
        else {
            console.log("(user.service.ts)⚠️ No such document!");
            return tempData;
        }
    } catch (error) {
        console.log(error)
    }
}

export const updateUserProfile = async (id: string, user: UserProfile) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(docRef, {
        ...user,
    });
}