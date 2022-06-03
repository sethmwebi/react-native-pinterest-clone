import { StyleSheet, Image, ScrollView } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Pressable , Alert, ActivityIndicator } from "react-native";
import MasonryList from "../components/MasonryList";
import pins from "../assets/data/pins";
import { useSignOut, useUserId, useNhostClient } from "@nhost/react";
import { useEffect, useState } from "react"

const GET_USER_QUERY = `
  query MyQuery($id: uuid!) {
    user(id: $id) {
      id
      avatarUrl
      displayName
      pins {
        id
        image
        title
        created_at
      }
    }
  }
`;

export default function ProfileScreen() {
  const [user, setUser] = useState(null)
  const { signOut } = useSignOut();
  const nhost = useNhostClient();

  const userId = useUserId();
  const fetchUserData = async () => {
    const result = await nhost.graphql.request(GET_USER_QUERY, {id: userId});
    if(result.error){
      Alert.alert("Error fetching the user")
    } else {
      setUser(result.data.user)
    }
  };

  useEffect(() => {
    fetchUserData()
  },[])

  if(!user){
    return <ActivityIndicator />
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icons}>
          <Pressable onPress={signOut}>
            <Feather name="share" size={24} color="black" style={styles.icon} />
          </Pressable>
          <Entypo
            name="dots-three-horizontal"
            size={24}
            color="black"
            style={styles.icon}
          />
        </View>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/10898766/pexels-photo-10898766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          }}
          style={styles.image}
        />
        <Text style={styles.title}>{user.displayName}</Text>
        <Text style={styles.subtitle}>123 Followers | 504 Followings</Text>
      </View>
      <MasonryList pins={user.pins} onRefresh={fetchUserData}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  subtitle: {
    color: "#181818",
    fontWeight: "500",
    margin: 10,
  },
  image: {
    width: 200,
    aspectRatio: 1,
    borderRadius: 200,
    resizeMode: "contain",
    marginVertical: 10,
  },
  header: {
    alignItems: "center",
  },
  icons: {
    flexDirection: "row",
    alignSelf: "flex-end",
    padding: 10,
  },
  icon: {
    paddingHorizontal: 10,
  },
});
