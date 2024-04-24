<template>
  <div class="modal" v-if="showModal">
    <div class="modal-content">
      <button id="closeButton" @click="closeModal">
        <img src="../assets/close.png" width="12" />
      </button>
      <div secondContainer>
        <div id="col1">
          <div class="groupName">
            <label>Group Name</label>
            <input id="groupName" v-model="groupName" required />
            <div class="CalendarColors">
                <input
                    type="color"
                    id="customColor"
                    v-model="color"
                    value="#cccaca"
                >
            </div> 
          </div>
          <label>Add Members</label>
          <input
            id="addMembers"
            placeholder="username"
            v-model="addMembers"
            @keypress.enter="addMember"
            required
          />
        </div>
        <div id="col2">
          <h3>Members</h3>
          <div class="member-list">
            <ul>
              <li>1. {{ currentUserUsername }}</li>
              <hr />
              <li v-for="(member, index) in memberList" :key="index">
                {{ index + 2 }}.
                {{ member }}
                <button id="removeButton" @click="removeMember(member)">
                  <img src="../assets/close.png" width="20" />
                </button>
                <hr />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button id="createButton" type="submit" @click="createGroup">
        <p>CREATE GROUP</p>
      </button>
    </div>
  </div>
</template>

<script>
// refresh page when create group is pressed

import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";

export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      addMembers: "",
      groupName: "",
      memberList: [],
      currentUserUsername: "",
    };
  },
  created() {
    this.getCurrentUserUsername();
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    async addMember() {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      const usersCollection = collection(db, "User");
      const username = this.addMembers;
      const queryByUsername = query(
        usersCollection,
        where("username", "==", username)
      );

      Promise.all([getDocs(queryByUsername)]).then(([usernameSnapshot]) => {
        if (usernameSnapshot.empty) {
          alert("User does not exist!");
          console.error("User does not exist!");
        } else {
          if (!this.memberList.includes(username)) {
            this.memberList.push(username);
            this.addMembers = "";
            console.log("Member list updated:", this.memberList);
          } else {
            alert("Member already added");
          }
        }
      });
    },
    removeMember(member) {
      this.memberList.delete(member);
    },
    async getCurrentUserUsername() {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      if (user) {
        const usersCollection = collection(db, "User");
        const userDoc = doc(usersCollection, user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          this.currentUserUsername = userSnapshot.data().username;
        }
      }
    },
    /* async createGroup() {
      const db = getFirestore();
      const calendarCollection = collection(db, "Calendar");
      const usersCollection = collection(db, "User");
      const calendarList = new Set([...this.memberList]);
      calendarList.add(this.currentUserUsername);

      let userUIDs = await Promise.all(
        [...this.memberList, this.currentUserUsername].map(async (username) => {
          const userQuery = query(
            usersCollection,
            where("username", "==", username)
          );
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            return querySnapshot.docs[0].id;
          } else {
            throw new Error(`No user found for username: ${username}`);
          }
        })
      );
      const newGroup = {
        calendar_name: this.groupName,
        users: userUIDs,
      };

      setDoc(doc(calendarCollection), newGroup)
        .then(() => {
          const queryByCalendarName = query(
            calendarCollection,
            where("calendar_name", "==", this.groupName)
          );

          return Promise.all([getDocs(queryByCalendarName)]);
        })
        .then(([calendarNameSnapshot]) => {
          const docId =
            calendarNameSnapshot.docs[calendarNameSnapshot.docs.length - 1].id;

          calendarList.forEach(async (username) => {
            const userQuery = query(
              usersCollection,
              where("username", "==", username)
            );
            const userQuerySnapshot = await getDocs(userQuery);
            if (!userQuerySnapshot.empty) {
              const userDoc = userQuerySnapshot.docs[0].ref;
              const userData = userQuerySnapshot.docs[0].data();
              const updatedCalendars = userData.calendars || {};
              updatedCalendars[docId] = true;
              await setDoc(
                userDoc,
                { ...userData, shared_calendars: updatedCalendars },
                { merge: true }
              );
            }
          });
          console.log("Group created successfully!");
          this.closeModal();
        })
        .catch((error) => {
          console.error("Error creating group: ", error);
          alert("Error creating group. Please try again later.");
        });
    }, */
    async createGroup() {
      const db = getFirestore();
      const calendarCollection = collection(db, "Calendar");
      const usersCollection = collection(db, "User");
      const calendarList = new Set([
        ...this.memberList,
        this.currentUserUsername,
      ]);

      try {
        // Collect user UIDs
        const userUIDs = await Promise.all(
          [...calendarList].map(async (username) => {
            const userQuery = query(
              usersCollection,
              where("username", "==", username)
            );
            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
              return querySnapshot.docs[0].id;
            } else {
              throw new Error(`No user found for username: ${username}`);
            }
          })
        );

        // Create calendar

        let docColor = document.getElementById("customColor").value;

        const newCalendarRef = doc(calendarCollection);
        const newGroup = {
          calendar_name: this.groupName,
          color: docColor,
          users: userUIDs,
          tags: [],
        };
        await setDoc(newCalendarRef, newGroup);

        // Update each user document with the new calendar ID
        const updatePromises = userUIDs.map(async (userId) => {
          const userDocRef = doc(usersCollection, userId);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const updatedCalendars = userData.shared_calendars || {};
            updatedCalendars[newCalendarRef.id] = true;
            return setDoc(
              userDocRef,
              { shared_calendars: updatedCalendars },
              { merge: true }
            );
          } else {
            throw new Error("User document does not exist.");
          }
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        console.log("Group created and users updated successfully!");
        this.closeModal();
        window.location.reload();
      } catch (error) {
        console.error("Error creating group or updating users: ", error);
        alert("Error creating group. Please try again later.");
      }
    },
  },
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
}

.modal-content {
  background-color: #f2f2f2;
  margin: auto;
  width: 820px;
  height: 600px;
  border-radius: 20px;
  position: relative;
}

h2 {
  font-size: x-large;
}

#secondContainer {
  display: flex;
  text-align: center;
  justify-content: space-around;
  margin: 0;
  font-family: cabin;
}

#col1 {
  display: flex;
  flex-direction: column;
  width: 40%;
  float: left;
  margin-left: 9%;
  margin-top: 4%;
}

#col2 {
  display: flex;
  flex-direction: column;
  width: 40%;
  float: left;
  margin-left: 5%;
  margin-top: 4%;
}

label {
  text-align: left;
  display: inline-block;
  font-size: x-large;
  font-family: cabin;
  color: #0a42ad;
  margin-bottom: 2%;
}

h3 {
  font-size: x-large;
  font-family: cabin;
  color: #0a42ad;
}

#groupName,
#addMembers {
  width: 90%;
  height: 36px;
  margin-bottom: 8%;
  border-radius: 5px;
  font-size: large;
}

#closeButton {
  padding: 0;
  border: none;
  background: none;
  margin-top: 9px;
  margin-left: 18px;
  width: 3%;
  height: 6%;
  border-radius: 8px;
}

#createButton {
  background-color: #406cbe;
  color: white;
  border-radius: 10px;
  margin: auto;
  margin-top: 8%;
  margin-bottom: 1%;
  width: 24%;
  text-align: center;
  font-family: cabin;
  position: absolute;
  bottom: 20px;
  left: 300px;
}

#createButton p {
  text-align: center;
  font-size: medium;
  font-family: cabin;
  margin-top: 7%;
  margin-bottom: 7%;
}

.member-list {
  max-height: 200px;
  overflow-y: auto;
}

.member-list ul {
  list-style-type: none;
  font-family: cabin;
}

.member-list li {
  text-align: left;
  font-size: x-large;
  padding-left: 10px;
  font-family: cabin;
}

hr {
  margin-top: 3px;
}

#removeButton {
  padding: 0;
  border: none;
  background: none;
  float: right;
  margin-right: 10px;
  font-family: cabin;
}

.groupName{
  text-align: left;
  position: relative;
  font-family: cabin;
}

input[type='color'] {
      position: absolute;
      width: 25px;
      height: 25px;
      top: 60px;
      right: 40px;
      transform: translateY(-50%);
      pointer-events: auto;
}

</style>
