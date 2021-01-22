export default sendPushNotifications =  (receiverId,push) => {
    // console.log("swap");
    const firestore = firebase.firestore();
  
    //extract push token of receiver
  
    const usersRef = firestore.collection("users").doc(receiverId);
  
    usersRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          var expoToken = doc.data().expoToken;
          var messages = [];
          if (expoToken) {
            messages.push({
              to: expoToken,
              title: push.title,
              // body: "You have Received a Swap Request"
              body: push.body
            });
          }
          // return Promise.all(messages)
          fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify(messages)
          });
  
          // console.log("Document data:", doc.data());
        } else {
          // doc.data() will be undefined in this case
          // console.log("No such document!");
        }
      })
      .catch(function(error) {
        // console.log("Error getting document:", error);
      });
  };