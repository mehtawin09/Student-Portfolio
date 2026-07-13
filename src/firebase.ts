import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Provider with Drive Scopes
export const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/drive.file");

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // If we have a user but no cached token, they need to sign in again to obtain a fresh Drive access token.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google (called from user click)
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get access token from Firebase Auth");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string) => {
  cachedAccessToken = token;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Validate firestore connection
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firestore connection test completed.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration or network status.");
    }
  }
}

// Drive Helpers
export const createDriveFolder = async (folderName: string, accessToken: string): Promise<string> => {
  const metadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };
  
  const response = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to create Drive folder: ${errText}`);
  }
  
  const data = await response.json();
  return data.id;
};

// Check if a folder named "Student Portfolios" exists, if not, create it
export const getOrCreateMainFolder = async (accessToken: string): Promise<string> => {
  try {
    const q = encodeURIComponent("name = 'Student Portfolios' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.files && data.files.length > 0) {
        return data.files[0].id;
      }
    }
    
    // Not found, create it
    return await createDriveFolder("Student Portfolios", accessToken);
  } catch (err) {
    console.error("Error searching/creating main folder, returning standard root:", err);
    // Fallback: create it directly
    return await createDriveFolder("Student Portfolios", accessToken);
  }
};

// Upload file to Drive inside a folder
export const uploadFileToDrive = async (
  file: File | Blob,
  fileName: string,
  parentFolderId: string | null,
  accessToken: string
): Promise<{ id: string; name: string; webViewLink: string }> => {
  const metadata = {
    name: fileName,
    parents: parentFolderId ? [parentFolderId] : [],
  };

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", file);

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to upload file: ${errText}`);
  }

  const data = await response.json();
  return {
    id: data.id,
    name: data.name,
    webViewLink: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
  };
};
