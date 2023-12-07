import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


// // Function to add a new course to Firestore
const addCourse = async (courseData) => {
    try {
        const coursesCollection = await firestore()
            .collection('courses');
        const newCourseRef = await coursesCollection
            .add(courseData);
        console.log('Course added with ID:', newCourseRef.id);
        return newCourseRef.id;
    } catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
};


// Function to get a list of courses from Firestore
const getAllCourses = async () => {
    try {
        const coursesCollection = firestore().collection('courses');
        const snapshot = await coursesCollection.get();

        const courses = snapshot.docs.map((doc) => ({
            courseId: doc.id,
            ...doc.data(),
        }));

        return courses;
    } catch (error) {
        console.error('Error getting courses:', error);
        throw error;
    }
};

// Function to get a single course from Firestore
const getCourseById = async (courseId) => {
    try {
        const coursesCollection = firestore.collection('courses');
        const snapshot = await coursesCollection.doc(courseId).get();
        const course = snapshot.data();
        return course;
    } catch (error) {
        console.error('Error getting course:', error);
        throw error;
    }
};

// Function to update a course in Firestore
const updateCourse = async (courseId, courseData) => {
    try {
        const coursesCollection = firestore().collection('courses');
        await coursesCollection.doc(courseId).update(courseData);
        console.log('Course updated with ID:', courseId);

        return { success: true, message: 'Course updated successfully.' };
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};

// Function to upload image to Firebase Storage
const uploadImage = async (uri) => {
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
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    console.log('Image uploaded successfully. URL:', url);
                });
            }
        );

        return uploadTask;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// Function to upload video to Firebase Storage
const uploadVideo = async (uri) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const videoRef = storage().ref().child("Stuff/" + new Date().getTime());
        const uploadTask = videoRef.put(blob);

        uploadTask.on(
            storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            (error) => {
                console.error('Error during upload:', error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                    console.log('Image uploaded successfully. URL:', url);
                });
            }
        );
        return uploadTask;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

// //Function which filter the courses based on the category
// const filterCourses = async (searchQuery) => {
//     try {
//         const coursesCollection = firestore().collection('courses');
//         const snapshot = await coursesCollection.get();

//         const matchingCourses = snapshot.docs.filter(doc => {
//             const category = doc.get('category');
//             return category && category.includes(searchQuery);
//         });

//         return matchingCourses;
//     } catch (error) {
//         console.error('Error getting courses:', error);
//         throw error;
//     }
// };

export { addCourse, getAllCourses, getCourseById, updateCourse, uploadImage, uploadVideo };