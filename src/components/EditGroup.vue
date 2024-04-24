<template>
  <div class="modal" v-if="showPopup">
    <div class="modal-content">
      <button id="closeButton" @click="closePopup">
        <img src="../assets/close.png" width="12" />
      </button>
      <div id="col1">
        <label>Group Name</label>
        <div id="group-container">
          <input id="calendarName" v-model="editableCalendarName" required />
          <button id="saveButton" @click="saveGroupName">Save</button>
        </div>
        <label>Add Member</label>
        <div id="add-container">
          <input id="addMembers" v-model="addMembers" required />
          <button id="addButton" @click="addMember">Add</button>
        </div>
      </div>

      <div id="col2">
        <label>Members</label>
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
      <div id="buttonContainer">
        <button id="leaveGroupButton" @click="leaveGroup()">Leave Group</button>
        <button id="deleteGroupButton" @click="deleteGroup()">
          Delete Group
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  arrayRemove,
  arrayUnion,
  deleteField,
  deleteDoc,
} from "firebase/firestore";

export default {
  props: {
    showPopup: {
      type: Boolean,
      required: true,
    },
    calendarData: {
      type: Object,
      default: () => ({ calendar_name: "", id: "" }),
    },
  },
  data() {
    return {
      editableCalendarName: "",
      currentUserUsername: "",
      currentUserUid: "",
      memberList: [],
      addMembers: "",
    };
  },
  created() {
    this.getCurrentUserUsername();
    this.getCalendarMemberList();
  },
  watch: {
    calendarData: {
      immediate: true,
      handler(newVal) {
        this.editableCalendarName = newVal.calendar_name;
      },
    },
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    async getCurrentUserUsername() {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      if (user) {
        this.currentUserUid = user.uid;
        const usersCollection = collection(db, "User");
        const userDoc = doc(usersCollection, user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          this.currentUserUsername = userSnapshot.data().username;
        }
      }
    },
    async getCalendarMemberList() {
      const db = getFirestore();
      const calendarDocRef = doc(db, "Calendar", this.calendarData.id);
      try {
        const calendarSnap = await getDoc(calendarDocRef);
        if (
          calendarSnap.exists() &&
          calendarSnap.data().hasOwnProperty("users")
        ) {
          const userIDs = calendarSnap.data().users;
          const usersCollection = collection(db, "User");
          const userQueries = userIDs.map((id) => doc(usersCollection, id));
          const userSnapshots = await Promise.all(
            userQueries.map((userDoc) => getDoc(userDoc))
          );
          this.memberList = userSnapshots
            .filter((doc) => doc.exists())
            .map((doc) => doc.data().username)
            .filter((username) => username !== this.currentUserUsername);
          console.log("Members fetched successfully:", this.memberList);
        } else {
          console.log("No users field found in the document.");
        }
      } catch (error) {
        console.error("Error fetching members:", error);
        this.memberList = [];
      }
    },
    saveGroupName() {
      const db = getFirestore();
      const docRef = doc(db, "Calendar", this.calendarData.id);
      console.log(
        "Attempting to save new calendar name:",
        this.editableCalendarName
      );
      setDoc(
        docRef,
        { calendar_name: this.editableCalendarName },
        { merge: true }
      )
        .then(() => {
          alert("Calendar name updated successfully!");
          console.log("Calendar name updated successfully!");
          this.$emit("update:calendarData", {
            ...this.calendarData,
            calendar_name: this.editableCalendarName,
          });
        })
        .catch((error) => {
          console.error("Error updating calendar name:", error);
        });
    },
    async removeMember(member) {
      const db = getFirestore();
      const usersCollection = collection(db, "User");
      const userQuery = query(usersCollection, where("username", "==", member));
      try {
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          const userDocSnapshot = querySnapshot.docs[0];
          const userId = userDocSnapshot.id;
          const userData = userDocSnapshot.data();
          const calendarMap = userData.shared_calendars || {};
          const calendarId = this.calendarData.id;
          console.log(calendarMap);
          console.log(calendarId);

          if (calendarId in calendarMap) {
            delete calendarMap[calendarId];
            console.log(calendarMap);
            const userDocRef = doc(db, "User", userId);
            await updateDoc(userDocRef, {
              shared_calendars: calendarMap,
            });
          } else {
            console.log("Calendar ID not found in shared_calendars.");
          }

          const calendarDocRef = doc(db, "Calendar", this.calendarData.id);
          await setDoc(
            calendarDocRef,
            {
              users: arrayRemove(userId),
            },
            { merge: true }
          );

          this.memberList = this.memberList.filter(
            (username) => username !== member
          );
          console.log("Member removed successfully:", member);
        } else {
          console.error("No such user found with the username:", member);
        }
      } catch (error) {
        console.error("Error removing member:", error);
      }
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
      console.log(username);
      Promise.all([getDocs(queryByUsername)]).then(([usernameSnapshot]) => {
        if (usernameSnapshot.empty) {
          alert("User does not exist!");
          console.error("User does not exist!");
        } else {
          const newUserId = usernameSnapshot.docs[0].id;

          if (newUserId === user.uid) {
            alert("You are already a member!");
            console.error("You are already a member!");
          } else {
            const userDocRef = doc(db, "User", newUserId);

            getDoc(userDocRef).then((docSnap) => {
              if (docSnap.exists()) {
                const userData = docSnap.data();
                const calendarId = this.calendarData.id;

                if (
                  userData.shared_calendars &&
                  userData.shared_calendars[calendarId]
                ) {
                  alert("Member already in group");
                  console.error("Member already in group");
                } else {
                  const calendarMap = { [calendarId]: true };

                  setDoc(
                    userDocRef,
                    { shared_calendars: calendarMap },
                    { merge: true }
                  );

                  const calendarDocRef = doc(
                    db,
                    "Calendar",
                    this.calendarData.id
                  );
                  setDoc(
                    calendarDocRef,
                    { users: arrayUnion(newUserId) },
                    { merge: true }
                  );

                  console.log(username, "added successfully");
                  this.memberList.push(username);
                }
              } else {
                console.error(
                  "Failed to fetch user data for shared calendars check"
                );
              }
            });
          }
        }
      });
    },
    async deleteGroup() {
      const db = getFirestore();
      const calendarId = this.calendarData.id;
      const calendarDocRef = doc(db, "Calendar", calendarId);

      try {
        const calendarSnap = await getDoc(calendarDocRef);
        if (
          calendarSnap.exists() &&
          calendarSnap.data().hasOwnProperty("users")
        ) {
          const userIDs = calendarSnap.data().users;

          const usersCollection = collection(db, "User");
          const userDocs = userIDs.map((id) => doc(usersCollection, id));
          const userUpdates = userDocs.map((userDocRef) =>
            updateDoc(userDocRef, {
              [`shared_calendars.${calendarId}`]: deleteField(),
            })
          );

          await Promise.all(userUpdates);
          console.log("Shared calendars updated successfully.");

          if (calendarSnap.data().hasOwnProperty("tags")) {
            const tagIDs = calendarSnap.data().tags;
            tagIDs.map(
              async (tagDocRef) => await deleteDoc(doc(db, "Tags", tagDocRef))
            );
            console.log("Deleted Shared Tags successfully.");
          }

          if (calendarData.hasOwnProperty("tags")) {
            const tagIDs = calendarData.tags;
            const tagDeletions = tagIDs.map((tagId) =>
              deleteDoc(doc(db, "Tags", tagId))
            );
            await Promise.all(tagDeletions);
            console.log("Deleted Shared Tags successfully.");
          }

          await deleteDoc(calendarDocRef);
          alert("Calendar deleted successfully!")
          console.log("Calendar deleted successfully.");
        } else {
          console.log(
            "No users associated with this calendar, or calendar does not exist."
          );
        }
      } catch (error) {
        console.error("Error deleting group:", error);
      }
      this.$emit("groupDeleted", this.calendarData.id);
      this.closePopup();
    },
    async leaveGroup() {
      const db = getFirestore();
      const calendarId = this.calendarData.id;
      const calendarDocRef = doc(db, "Calendar", calendarId);
      const auth = getAuth();
      const user = auth.currentUser;
      const userDocRef = doc(db, "User", user.uid);

      try {
        await updateDoc(calendarDocRef, {
          users: arrayRemove(user.uid),
        });

        await updateDoc(userDocRef, {
          [`shared_calendars.${calendarId}`]: deleteField(),
        });

        const updatedCalendarSnap = await getDoc(calendarDocRef);
        if (updatedCalendarSnap.exists()) {
          const updatedCalendarData = updatedCalendarSnap.data();
          if (
            !updatedCalendarData.users ||
            updatedCalendarData.users.length === 0
          ) {
            if (updatedCalendarData.hasOwnProperty("tags")) {
              const tagIDs = updatedCalendarData.tags;
              const tagDeletions = tagIDs.map((tagId) =>
                deleteDoc(doc(db, "Tags", tagId))
              );
              await Promise.all(tagDeletions);
              console.log("All associated tags deleted successfully.");
            }
            await deleteDoc(calendarDocRef);
            console.log(
              "Calendar deleted successfully as no more users are linked."
            );
          } else {
            console.log("Removed from calendar, but other members remain.");
          }
        } else {
          console.error(
            "Failed to fetch updated calendar data after user removal."
          );
        }

        this.memberList = this.memberList.filter(
          (member) => member !== this.currentUserUsername
        );
        this.$emit("groupDeleted", this.calendarData.id);
        this.closePopup();
        alert("You have left the group.");
      } catch (error) {
        console.error("Error leaving group:", error);
        alert("Failed to leave the group.");
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: start;
  width: 820px;
  height: 600px;
  border-radius: 20px;
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

#col1 {
  display: flex;
  flex-direction: column;
  width: 40%;
  float: left;
  margin-top: 10%;
  margin-left: 8%;
}

#col2 {
  display: flex;
  flex-direction: column;
  width: 30%;
  float: left;
  margin-top: 10%;
  margin-left: 8%;
}

label {
  text-align: left;
  display: inline-block;
  font-size: x-large;
  font-family: cabin;
  color: #0a42ad;
  margin-bottom: 1%;
}

#saveButton {
  border-radius: 6px;
  margin-left: 2%;
  margin-bottom: 3%;
  width: 60px;
}

#calendarName {
  height: 36px;
  border-radius: 5px;
  font-size: large;
  margin-bottom: 3%;
}

.member-list {
  overflow-y: auto;
  margin-right: 20%;
  height: 200px;
}

.member-list ul {
  list-style-type: none;
  padding: 0;
}

.member-list li {
  text-align: left;
  font-size: x-large;
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
}

#group-container {
  display: flex;
}

#add-container {
  display: flex;
}

#addMembers {
  height: 36px;
  border-radius: 5px;
  font-size: large;
}

#addButton {
  border-radius: 6px;
  margin-left: 2%;
  width: 60px;
}

#deleteGroupButton {
  /* z-index: 10;
  position: absolute;
  left: 44%;
  bottom: 10%; */
  border-radius: 6px;
}

#leaveGroupButton {
  /* z-index: 10;
  position: absolute;
  left: 44%;
  bottom: 10%; */
  margin-right: 5%;
  border-radius: 6px;
}

#buttonContainer {
  width: 100%;
}
</style>
