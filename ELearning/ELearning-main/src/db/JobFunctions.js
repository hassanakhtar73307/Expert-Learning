import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// // Function to add a new feed post to Firestore
const addJobs = async (postData) => {
    try {
        const jobCollection = await firestore()
            .collection('jobPosts');
        const newJobPostRef = await jobCollection
            .add(postData);
        console.log('Post added with ID:', newJobPostRef.id);
        return newJobPostRef.id;
    } catch (error) {
        console.error('Error adding feed post:', error);
        throw error;
    }
};

// Function to get a list of courses from Firestore
const getAllJobs = async () => {
    try {
        const jobCollection = firestore().collection('jobPosts');
        const snapshot = await jobCollection.get();

        const jobs = snapshot.docs.map((doc) => ({
            jobId: doc.id,
            ...doc.data(),
        }));

        return jobs;
    } catch (error) {
        console.error('Error getting courses:', error);
        throw error;
    }
};

// Function to upload image to Firebase storage
const uploadImage = async (uri) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const imageRef = storage().ref().child("Stuff/" + new Date().getTime());
            const uploadTask = imageRef.put(blob);

            uploadTask.on(
                storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    console.error('Error during upload:', error);
                    reject(error);
                },
                async () => {
                    try {
                        const url = await uploadTask.snapshot.ref.getDownloadURL();
                        console.log('Image uploaded successfully. URL:', url);
                        resolve(url);
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        reject(error);
                    }
                }
            );
        } catch (error) {
            console.error('Error uploading image:', error);
            reject(error);
        }
    });
};


export { addJobs, getAllJobs, uploadImage };