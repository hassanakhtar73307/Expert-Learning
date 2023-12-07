import firestore from '@react-native-firebase/firestore';

// Function to send a message
// const sendMessage = async (senderId, receiverId, message) => {
//     try {
//         const timestamp = Date.now();
//         const messageData = {
//             senderId,
//             text: message,
//             timestamp,
//         };

//         // Find or create a chat document between the two users
//         const chatSnapshot = await firestore()
//             .collection('chats')
//             .where('participants', '==', [senderId, receiverId])
//             .get();

//         let chatDoc;
//         if (!chatSnapshot.empty) {
//             chatDoc = chatSnapshot.docs[0];
//         } else {
//             chatDoc = await firestore()
//                 .collection('chats')
//                 .add({
//                     participants: [senderId, receiverId],
//                 });
//         }

//         // Add the message to the chat document
//         await chatDoc.ref.collection('messages').add(messageData);

//         return messageData;
//     } catch (error) {
//         console.error('Error sending message:', error);
//         throw error;
//     }
// };
const sendMessage = async (senderId, receiverId, message) => {
    try {
        const timestamp = Date.now();
        const messageData = {
            senderId,
            text: message,
            timestamp,
        };

        // Find or create a chat document between the two users
        const chatSnapshot = await firestore()
            .collection('chats')
            .where('participants', '==', [senderId, receiverId])
            .get();

        let chatDoc;
        if (!chatSnapshot.empty) {
            chatDoc = chatSnapshot.docs[0];
        } else {
            chatDoc = await firestore()
                .collection('chats')
                .add({
                    participants: [senderId, receiverId],
                });
        }

        if (chatDoc) {  // Add null check to ensure chatDoc is defined
            // Add the message to the chat document
            await chatDoc.ref.collection('messages').add(messageData);
        }

        return messageData;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

// Function to get chat messages
const getChatMessages = async (senderId, receiverId) => {
    try {
        const chatSnapshot = await firestore()
            .collection('chats')
            .where('participants', '==', [senderId, receiverId])
            .get();

        const messages = [];

        const promises = chatSnapshot.docs.map(async chatDoc => {
            const messagesSnapshot = await chatDoc.ref.collection('messages').orderBy('timestamp').get();

            messagesSnapshot.forEach(doc => {
                messages.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
        });

        await Promise.all(promises);  // Wait for all chat messages to be fetched

        return messages;
    } catch (error) {
        console.error('Error getting chat messages:', error);
        throw error;
    }
};
// const getChatMessages = async (senderId, receiverId) => {
//     try {
//         const chatSnapshot = await firestore()
//             .collection('chats')
//             .where('participants', '==', [senderId, receiverId])
//             .get();

//         const messages = [];

//         const promises = chatSnapshot.docs.map(async chatDoc => {
//             const messagesRef = chatDoc.ref.collection('messages').orderBy('timestamp');

//             const messagesSnapshot = await messagesRef.get();

//             messagesSnapshot.forEach(doc => {
//                 messages.push({
//                     id: doc.id,
//                     ...doc.data(),
//                 });
//             });

//             // Listen for real-time updates to the messages collection
//             messagesRef.onSnapshot(snapshot => {
//                 snapshot.docChanges().forEach(change => {
//                     if (change.type === 'added') {
//                         // Handle new message added
//                         const newMessage = {
//                             id: change.doc.id,
//                             ...change.doc.data(),
//                         };
//                         messages.push(newMessage);
//                     }
//                     if (change.type === 'modified') {
//                         // Handle modified message
//                         const modifiedMessageIndex = messages.findIndex(message => message.id === change.doc.id);
//                         if (modifiedMessageIndex !== -1) {
//                             messages[modifiedMessageIndex] = {
//                                 id: change.doc.id,
//                                 ...change.doc.data(),
//                             };
//                         }
//                     }
//                     if (change.type === 'removed') {
//                         // Handle removed message
//                         const removedMessageIndex = messages.findIndex(message => message.id === change.doc.id);
//                         if (removedMessageIndex !== -1) {
//                             messages.splice(removedMessageIndex, 1);
//                         }
//                     }
//                 });
//             });
//         });

//         await Promise.all(promises);  // Wait for all chat messages to be fetched

//         return messages;
//     } catch (error) {
//         console.error('Error getting chat messages:', error);
//         throw error;
//     }
// };


// const getChatMessages = async (senderId, receiverId) => {
//     try {
//         const chatSnapshot = await firestore()
//             .collection('chats')
//             .where('participants', 'array-contains-any', [senderId, receiverId])
//             .get();

//         const messages = [];

//         const promises = chatSnapshot.docs.map(async chatDoc => {
//             const messagesSnapshot = await chatDoc.ref.collection('messages').orderBy('timestamp').get();

//             messagesSnapshot.forEach(doc => {
//                 messages.push({
//                     id: doc.id,
//                     ...doc.data(),
//                 });
//             });
//         });
//         // Wait for all promises to resolve
//         await Promise.all(promises);

//         return messages;
//     } catch (error) {
//         console.error('Error getting chat messages:', error);
//         throw error;
//     }
// };

// Function to get chat participants
const getChatParticipants = async (loginUserId) => {
    try {
        const chatSnapshot = await firestore()
            .collection('chats')
            .where('participants', 'array-contains', loginUserId)
            .get();

        const participants = new Set();

        chatSnapshot.forEach(chatDoc => {
            const chatData = chatDoc.data();
            chatData.participants.forEach(participant => {
                if (participant !== loginUserId) {
                    participants.add(participant);
                }
            });
        });

        return Array.from(participants);
    } catch (error) {
        console.error('Error getting chat participants:', error);
        const gettingEror = { error: true, message: error }
        return gettingEror;
    }
};

// // Get user details by user ID
const getUserDetailsByIds = async (userIds) => {
    try {
        const usersCollection = firestore().collection('users');

        const snapshot = await usersCollection.where(firestore.FieldPath.documentId(), 'in', userIds).get();

        const userDetails = {};
        snapshot.forEach((doc) => {
            userDetails[doc.id] = doc.data();
        });

        return userDetails;
    } catch (error) {
        console.error('Error getting user details:', error);
        throw error;
    }
};


// getLastMessagesWithParticipants messages between two users
const getLastMessagesWithParticipants = async (loginUserId, participantIds) => {
    try {
        const lastMessages = {};

        // Iterate through participant IDs
        for (const participantId of participantIds) {
            const chatSnapshot = await firestore()
                .collection('chats')
                .where('participants', '==', [loginUserId, participantId])
                .get();

            if (!chatSnapshot.empty) {
                const chatDoc = chatSnapshot.docs[0];
                const lastMessageSnapshot = await chatDoc.ref.collection('messages').orderBy('timestamp', 'desc').limit(1).get();

                if (!lastMessageSnapshot.empty) {
                    const lastMessageDoc = lastMessageSnapshot.docs[0];
                    lastMessages[participantId] = {
                        id: lastMessageDoc.id,
                        ...lastMessageDoc.data(),
                    };
                }
            }
        }

        return lastMessages;
    } catch (error) {
        console.error('Error getting last messages with participants:', error);
        throw error;
    }
};



export { sendMessage, getChatMessages, getChatParticipants, getUserDetailsByIds, getLastMessagesWithParticipants };




// // // Send a message
// // const sendMessage = async (senderId, receiverId, message) => {
// //     try {
// //         const timestamp = Date.now();
// //         const messageData = {
// //             senderId,
// //             receiverId,
// //             message,
// //             timestamp,
// //             read: false,
// //         };

// //         await firestore().collection('messages').add(messageData);
// //     } catch (error) {
// //         console.error('Error sending message:', error);
// //         throw error;
// //     }
// // };

// // // Get all messages between two users
// // const getMessages = async (user1, user2) => {
// //     try {
// //         const snapshot = await firestore()
// //             .collection('messages')
// //             .where('senderId', 'in', [user1, user2])
// //             .where('receiverId', 'in', [user1, user2])
// //             .orderBy('timestamp')
// //             .get();

// //         const messages = [];
// //         snapshot.forEach((doc) => {
// //             messages.push(doc.data());
// //         });

// //         return messages;
// //     } catch (error) {
// //         console.error('Error getting messages:', error);
// //         throw error;
// //     }
// // };

// // // Get a list of users involved in a chat
// // const getChatUsers = async (userId) => {
// //     try {
// //         const snapshot = await firestore()
// //             .collection('messages')
// //             .where('senderId', '==', userId)
// //             .get();

// //         const users = [];
// //         snapshot.forEach((doc) => {
// //             users.push(doc.data().receiverId);
// //         });

// //         return users;
// //     } catch (error) {
// //         console.error('Error getting chat users:', error);
// //         throw error;
// //     }
// // };

// // // Mark all messages as read
// // const markAllMessagesAsRead = async (loginUserId, contactUserId) => {
// //     try {
// //         const snapshot = await firestore()
// //             .collection('messages')
// //             .where('senderId', '==', contactUserId)
// //             .where('receiverId', '==', loginUserId)
// //             .where('read', '==', false)
// //             .get();

// //         snapshot.forEach((doc) => {
// //             doc.ref.update({ read: true });
// //         });

// //         return true;
// //     } catch (error) {
// //         console.error('Error marking messages as read:', error);
// //         throw error;
// //     }
// // };

// // // Get last messages for contact list
// // const getLastMessagesForContactList = async (loginUserId, contactUserIds) => {
// //     try {
// //         const lastMessages = {};

// //         for (const contactUserId of contactUserIds) {
// //             const snapshot = await firestore()
// //                 .collection('messages')
// //                 .where('senderId', 'in', [loginUserId, contactUserId])
// //                 .where('receiverId', 'in', [loginUserId, contactUserId])
// //                 .orderBy('timestamp', 'desc')
// //                 .limit(1)
// //                 .get();

// //             snapshot.forEach((doc) => {
// //                 lastMessages[contactUserId] = doc.data();
// //             });
// //         }

// //         return lastMessages;
// //     } catch (error) {
// //         console.error('Error getting last messages for contact list:', error);
// //         throw error;
// //     }
// // };

// // // Get unread message counts
// // const getUnreadMessageCounts = async (loginUserId, contactUserIds) => {
// //     try {
// //         const unreadCounts = {};

// //         for (const contactUserId of contactUserIds) {
// //             const snapshot = await firestore()
// //                 .collection('messages')
// //                 .where('senderId', '==', contactUserId)
// //                 .where('receiverId', '==', loginUserId)
// //                 .where('read', '==', false)
// //                 .get();

// //             unreadCounts[contactUserId] = snapshot.size;
// //         }

// //         return unreadCounts;
// //     } catch (error) {
// //         console.error('Error getting unread message counts:', error);
// //         throw error;
// //     }
// // };

// // // Get user details by IDs
// // const getUserDetailsByIds = async (userIds) => {
// //     try {
// //         const usersCollection = firestore().collection('users');
// //         const snapshot = await usersCollection.where(firestore.FieldPath.documentId(), 'in', userIds).get();

// //         const userDetails = {};
// //         snapshot.forEach((doc) => {
// //             userDetails[doc.id] = doc.data();
// //         });

// //         return userDetails;
// //     } catch (error) {
// //         console.error('Error getting user details:', error);
// //         throw error;
// //     }
// // };

// // export { sendMessage, getMessages, getChatUsers, markAllMessagesAsRead, getLastMessagesForContactList, getUnreadMessageCounts, getUserDetailsByIds };
// import database from '@react-native-firebase/database';
// import firestore from '@react-native-firebase/firestore';

// // Send a message
// // const sendMessage = async (senderId, receiverId, message) => {
// //     try {
// //         const timestamp = Date.now();
// //         const messageData = {
// //             senderId,
// //             receiverId,
// //             message,
// //             timestamp,
// //             read: false,
// //         };

// //         await database().ref(`messages/${senderId}/${receiverId}`).push(messageData);
// //         await database().ref(`messages/${receiverId}/${senderId}`).push(messageData);
// //     } catch (error) {
// //         console.error('Error sending message:', error);
// //         throw error;
// //     }
// // };
// const sendMessage = async (senderId, receiverId, message) => {
//     try {
//         const timestamp = Date.now();
//         const messageData = {
//             senderId,
//             receiverId,
//             message,
//             timestamp,
//             read: false,
//         };

//         const senderRef = await database().ref(`messages/${senderId}/${receiverId}`).push(messageData);
//         const receiverRef = await database().ref(`messages/${receiverId}/${senderId}`).push(messageData);

//         // Retrieve the message IDs generated by push()
//         const senderMessageId = senderRef.key;
//         const receiverMessageId = receiverRef.key;

//         // Return the sent message with the generated IDs
//         return {
//             id: senderMessageId,
//             ...messageData,
//         };
//     } catch (error) {
//         console.error('Error sending message:', error);
//         throw error;
//     }
// };


// // Get all messages between two users
// // const getMessages = async (user1, user2) => {
// //     try {
// //         const snapshot = await database().ref(`messages/${user1}/${user2}`).once('value');
// //         return snapshot.val() || {};
// //     } catch (error) {
// //         console.error('Error getting messages:', error);
// //         throw error;
// //     }
// // };
// const getMessages = async (user1Id, user2Id) => {
//     try {
//         // Find the chat document that includes both users
//         const querySnapshot = await firestore()
//             .collection('chats')
//             .where('participants', 'array-contains', user1Id)
//             .where('participants', 'array-contains', user2Id)
//             .get();

//         // If there's a chat between the users
//         if (!querySnapshot.empty) {
//             const chatDoc = querySnapshot.docs[0];
//             const messagesSnapshot = await chatDoc.ref.collection('messages').orderBy('timestamp').get();

//             const messages = messagesSnapshot.docs.map(doc => {
//                 return {
//                     id: doc.id,
//                     ...doc.data(),
//                 };
//             });

//             return messages;
//         }

//         // If there's no chat between the users
//         return [];
//     } catch (error) {
//         console.error('Error getting chat messages:', error);
//         throw error;
//     }
// };
// // Get a list of users involved in a chat
// const getChatUsers = async (userId) => {
//     try {
//         const snapshot = await database().ref(`messages/${userId}`).once('value');
//         const users = snapshot.val() || {};
//         console.log('users', users);
//         return Object.keys(users);
//     } catch (error) {
//         console.error('Error getting chat users:', error);
//         throw error;
//     }
// };

// // Mark messages as read
// // const markMessagesAsRead = async (senderId, receiverId) => {
// //     try {
// //         const snapshot = await database().ref(`messages/${receiverId}/${senderId}`).once('value');
// //         const messages = snapshot.val() || {};
// //         const messageIds = Object.keys(messages);
// //         messageIds.forEach(async (messageId) => {
// //             await database().ref(`messages/${receiverId}/${senderId}/${messageId}`).update({ read: true });
// //         });
// //     } catch (error) {
// //         console.error('Error marking messages as read:', error);
// //         throw error;
// //     }
// // };
// const markAllMessagesAsRead = async (loginUserId, contactUserId) => {
//     try {
//         const snapshot = await database().ref(`messages/${loginUserId}/${contactUserId}`).once('value');
//         const messages = snapshot.val() || {};
//         const messageIds = Object.keys(messages);

//         // Check if the senderId is different from the loginUserId
//         if (messageIds.length > 0 && messages[messageIds[0]].senderId !== loginUserId) {
//             messageIds.forEach(async (messageId) => {
//                 await database().ref(`messages/${loginUserId}/${contactUserId}/${messageId}`).update({ read: true });
//             });
//         }

//         return true;
//     } catch (error) {
//         console.error('Error marking messages as read:', error);
//         throw error;
//     }
// };


// // Get the last message between two users
// // const getLastMessage = async (user1, user2) => {
// //     try {
// //         const snapshot = await database().ref(`messages/${user1}/${user2}`).orderByKey().limitToLast(1).once('value');
// //         const messages = snapshot.val() || {};
// //         const lastMessageId = Object.keys(messages)[0];
// //         return messages[lastMessageId];
// //     } catch (error) {
// //         console.error('Error getting last message:', error);
// //         throw error;
// //     }
// // };
// const getLastMessagesForContactList = async (loginUserId, contactUserIds) => {
//     try {
//         const lastMessages = {};

//         // Iterate through contact user IDs
//         for (const contactUserId of contactUserIds) {
//             const snapshot1 = await database().ref(`messages/${loginUserId}/${contactUserId}`).orderByKey().limitToLast(1).once('value');
//             const snapshot2 = await database().ref(`messages/${contactUserId}/${loginUserId}`).orderByKey().limitToLast(1).once('value');

//             const messages1 = snapshot1.val() || {};
//             const messages2 = snapshot2.val() || {};

//             const lastMessageId1 = Object.keys(messages1)[0];
//             const lastMessageId2 = Object.keys(messages2)[0];

//             // Compare timestamps to get the latest message
//             if (lastMessageId1 && lastMessageId2) {
//                 const lastMessage1 = messages1[lastMessageId1];
//                 const lastMessage2 = messages2[lastMessageId2];
//                 const lastMessage = lastMessage1.timestamp > lastMessage2.timestamp ? lastMessage1 : lastMessage2;

//                 // Save the last message for this contact user
//                 lastMessages[contactUserId] = lastMessage;
//             }
//         }

//         return lastMessages;
//     } catch (error) {
//         console.error('Error getting last messages for contact list:', error);
//         throw error;
//     }
// };


// // Get the count of unread messages
// // const getUnreadMessageCount = async (senderId, receiverId) => {
// //     try {
// //         const snapshot = await database().ref(`messages/${receiverId}/${senderId}`).orderByChild('read').equalTo(false).once('value');
// //         const messages = snapshot.val() || {};
// //         return Object.keys(messages).length;
// //     } catch (error) {
// //         console.error('Error getting unread message count:', error);
// //         throw error;
// //     }
// // };
// const getUnreadMessageCounts = async (loginUserId, contactUserIds) => {
//     try {
//         const unreadCounts = {};

//         // Iterate through contact user IDs
//         for (const contactUserId of contactUserIds) {
//             const snapshot = await database().ref(`messages/${loginUserId}/${contactUserId}`).orderByChild('read').equalTo(false).once('value');
//             const messages = snapshot.val() || {};
//             const unreadCount = Object.keys(messages).length;

//             // Save the unread count for this contact user
//             unreadCounts[contactUserId] = unreadCount;
//         }

//         return unreadCounts;
//     } catch (error) {
//         console.error('Error getting unread message counts:', error);
//         throw error;
//     }
// };

// // Get user details by user ID
// const getUserDetailsByIds = async (userIds) => {
//     try {
//         const usersCollection = firestore().collection('users');

//         const snapshot = await usersCollection.where(firestore.FieldPath.documentId(), 'in', userIds).get();

//         const userDetails = {};
//         snapshot.forEach((doc) => {
//             userDetails[doc.id] = doc.data();
//         });

//         return userDetails;
//     } catch (error) {
//         console.error('Error getting user details:', error);
//         throw error;
//     }
// };

// export { sendMessage, getMessages, getChatUsers, markAllMessagesAsRead, getLastMessagesForContactList, getUnreadMessageCounts, getUserDetailsByIds };
