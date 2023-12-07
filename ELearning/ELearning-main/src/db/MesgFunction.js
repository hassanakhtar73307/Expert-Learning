// import database from '@react-native-firebase/database';

// const sendMessage = async (senderId, receiverId, mesg) => {
//     try {
//         const timestamp = Date.now();
//         const newMessageRef = database().ref('messages').push();
//         await newMessageRef.set({
//             senderId,
//             receiverId,
//             mesg,
//             timestamp,
//             read: false,
//         });
//         return newMessageRef.key;
//     } catch (error) {
//         console.error('Error sending message:', error);
//         throw error;
//     }
// };

// const getMessages = async (userId) => {
//     try {
//         const snapshot = await database().ref('messages')
//             .orderByChild('timestamp')
//             .equalTo(userId, 'receiverId')
//             .once('value');
//         const messages = snapshot.val();
//         return messages;
//     } catch (error) {
//         console.error('Error getting messages:', error);
//         throw error;
//     }
// };

// const markMessageAsRead = async (messageId) => {
//     try {
//         await database().ref(`messages/${messageId}`).update({ read: true });
//     } catch (error) {
//         console.error('Error marking message as read:', error);
//         throw error;
//     }
// };

// const getUnreadMessageCount = async (userId) => {
//     try {
//         const snapshot = await database().ref('messages')
//             .orderByChild('read')
//             .equalTo(false)
//             .once('value');
//         const unreadMessages = snapshot.val();
//         return unreadMessages ? Object.values(unreadMessages).filter(message => message.receiverId === userId).length : 0;
//     } catch (error) {
//         console.error('Error getting unread message count:', error);
//         throw error;
//     }
// };

// const getLastMessage = async (userId, otherUserId) => {
//     try {
//         const snapshot = await database().ref('messages')
//             .orderByChild('timestamp')
//             .equalTo(userId, 'senderId')
//             .equalTo(otherUserId, 'receiverId')
//             .limitToLast(1)
//             .once('value');
//         const lastMessage = snapshot.val();
//         return lastMessage ? Object.values(lastMessage)[0] : null;
//     } catch (error) {
//         console.error('Error getting last message:', error);
//         throw error;
//     }
// };

// export { sendMessage, getMessages, markMessageAsRead, getUnreadMessageCount, getLastMessage };
