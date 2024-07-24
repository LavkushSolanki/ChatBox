import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const RequestScreen = () => {
  const [requests, setRequests] = useState([]);
  const { userId } = useContext(AuthContext);
  useEffect(() => {
    if (userId) {
      getrequests();
    }
  }, [userId]);

  const getrequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/getrequests/${userId}`
      );
      const datas = await response.json();
      setRequests(datas);
    } catch (error) {
      console.log("Error in request", error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      console.log("runned ");
      const response = await axios.post("http://localhost:3000/acceptrequest", {
        userId: userId,
        requestId: requestId,
      });

      if (response.status == 200) {
        await getrequests();
      }
    } catch (error) {
      console.log("Request Accept Error", console.error());
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image source={{ uri: item.from.image }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{item.from.name}</Text>
              <Text style={styles.message}>{item.from.mobile}</Text>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.acceptButton}>
                <Icon
                  onPress={() => acceptRequest(item.from._id)}
                  name="check-square"
                  style={[styles.buttonText]}
                ></Icon>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineButton}>
                <Icon name="x-square" style={[styles.buttonText]}></Icon>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default RequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 27,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginTop: 25,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    color: "gray",
  },
  buttons: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#1A3636", // Green background
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  declineButton: {
    backgroundColor: "#9d0208", // Red background
    padding: 10,
    borderRadius: 10,
    marginLeft: 3.5,
  },
  buttonText: {
    color: "white", // White text
    fontSize: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginBottom: 25, // Adjust for Android status bar
  },
  footerButton: {
    padding: 10,
  },
  footerButtonText: {
    fontSize: 16,
  },
});
