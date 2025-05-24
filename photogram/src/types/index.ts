import { OutputFileEntry } from "@uploadcare/react-uploader";
import { User } from "firebase/auth";

export interface UserSignIn {
    email: string,
    password: string,
    confirmPassword: string
}
export interface UserLogIn {
    email: string,
    password: string,
}

export interface Post {
    caption: string,
    photos: PhotoMeta[],
    likes: number,
    userlikes: [],
    userId?: string,
    username: string,
    photoURL: string,
    date: Date;
}

export interface PhotoMeta {
    cdnUrl: string
    uuid: string
}

export interface FileEntry {
    files: OutputFileEntry[]
}

export interface DocumentResponse {
    id?: string,
    caption?: string,
    photos?: PhotoMeta[],
    likes?: number,
    username?: string,
    photoURL?: string,
    userlikes?: [],
    userId?: string | null,
    date?: Date;
}

export interface ProfileInfo {
    user?: User
    displayName: string,
    photoURL: string
}

export interface UserProfile {
    userid: string,
    displayName: string,
    photoURL: string
    userBio: string
}

export interface ProfileRespose {
    id: string
    userid: string,
    displayName: string,
    photoURL: string
    userBio: string
}