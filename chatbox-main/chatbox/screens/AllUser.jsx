import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Avatar, FAB, IconButton, Snackbar } from "react-native-paper";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const AllUser = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const { userId } = useContext(AuthContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [requestsSent, setRequestsSent] = useState({});

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`);
      const datas = await response.json();
      setUsers(datas);
      console.log(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("User Id is: ");
    console.log(userId);
    fetchUsers();
  }, []);

  const handlePress = (id) => {
    const request = { senderId: userId, receiverId: id };
    axios
      .post("http://localhost:3000/sendrequest", request)
      .then((response) => {
        console.log(response);
      });
    setRequestsSent((prev) => ({ ...prev, [id]: true }));
    setSnackbarVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Avatar.Image size={50} source={{ uri: item.image }} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>Hello,Can we connect?</Text>
      </View>
      {requestsSent[item.id] ? (
        <IconButton
          icon="check"
          color="#1A3636"
          size={30}
          style={styles.checkIcon}
          onPress={() => {}}
        />
      ) : (
        <IconButton
          icon="plus"
          color="black"
          size={30}
          onPress={() => handlePress(item._id)}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Request sent
      </Snackbar>
    </SafeAreaView>
  );
};

export default AllUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  itemContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontWeight: "bold",
  },
  message: {
    color: "#666",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 1,
    bottom: 0,
    backgroundColor: "#000",
  },
  checkIcon: {
    backgroundColor: "transparent",
  },
});
