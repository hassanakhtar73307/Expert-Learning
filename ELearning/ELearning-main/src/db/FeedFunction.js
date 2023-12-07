import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// // Function to add a new feed post to Firestore
const addNewFeeds = async (postData) => {
    try {
        const feedsCollection = await firestore()
            .collection('feedposts');
        const newFeedPostRef = await feedsCollection
            .add(postData);
        console.log('Post added with ID:', newFeedPostRef.id);
        return newFeedPostRef.id;
    } catch (error) {
        console.error('Error adding feed post:', error);
        throw error;
    }
};

// Function to get a list of courses from Firestore
const getAllPosts = async () => {
    try {
        const postCollection = firestore().collection('feedposts');
        const snapshot = await postCollection.get();

        const posts = snapshot.docs.map((doc) => ({
            postsId: doc.id,
            ...doc.data(),
        }));

        return posts;
    } catch (error) {
        console.error('Error getting courses:', error);
        throw error;
    }
};

// Function to update a course in Firestore
const updatePost = async (postId, postData) => {
    try {
        const postCollection = firestore().collection('feedposts');
        await postCollection.doc(postId).update(postData);
        console.log('Post updated with ID:', postId, postData);

        return { success: true, message: 'Post updated successfully.' };
    } catch (error) {
        console.error('Error updating post:', error);
        console.log('Post updated with ID:', postId, postData);
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

export { addNewFeeds, getAllPosts, uploadImage, updatePost };

// const postData = {
//     createdAt: '1613234525',
//     userId: '123',
//     userName: 'John Doe',
//     userImg: 'https://picsum.photos/200/300',
//     post: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
//     postImg: 'https://picsum.photos/200/300',
//     likes: 0,
//     comments: 0,
//     likesIds: [{ userId: '123', userName: 'John Doe', userImg: '' }],
//     commentsIds: [{ userId: '123', userName: 'John Doe', userImg: '', comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', commentTime: '1613234525' }]
// }