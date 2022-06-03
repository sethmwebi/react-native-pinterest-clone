import { StyleSheet, Image, ScrollView } from "react-native";
import { Entypo, Feather } from "@expo/vector-icons"
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { Pressable } from "react-native"
import MasonryList from "../components/MasonryList";
import pins from "../assets/data/pins";
import { useSignOut } from "@nhost/react"

export default function ProfileScreen() {
  const { signOut } = useSignOut()

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icons}>
          <Pressable onPress={signOut}>
          <Feather name="share" size={24} color="black" style={styles.icon}/>
          </Pressable>
          <Entypo name="dots-three-horizontal" size={24} color="black" style={styles.icon}/>
        </View>
        <Image
          source={{
            uri: "https://images.pexels.com/photos/10898766/pexels-photo-10898766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          }}
          style={styles.image}
        />
        <Text style={styles.title}>Jessica Ogeto</Text>
        <Text style={styles.subtitle}>123 Followers | 504 Followings</Text>
      </View>
      <MasonryList pins={pins} />
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
    margin: 10
  },
  image: {
    width: 200,
    aspectRatio: 1,
    borderRadius: 200,
    resizeMode: "contain",
    marginVertical: 10
  },
  header: {
    alignItems: "center"
  },
  icons: {
    flexDirection: "row",
    alignSelf: "flex-end",
    padding: 10
  },
  icon: {
    paddingHorizontal: 10
  }
});
