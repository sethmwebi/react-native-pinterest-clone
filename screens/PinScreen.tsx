import { View, Text, StyleSheet, Image, Pressable, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import SafeViewAndroid from "../SafeViewAndroid";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useNhostClient } from "@nhost/react";

const GET_PIN_QUERY = `
	query MyQuery($id: uuid!) {
	  pins_by_pk(id: $id) {
	    created_at
	    id
	    image
	    title
	    user_id
	    user {
	      avatarUrl
	      displayName
	      id
	    }
	  }
	}
`;
const PinScreen = () => {
	const [pin, setPin] = useState<any>(null);

	const nhost = useNhostClient();
	const route = useRoute();
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();

	const pinId = route.params?.id;

	const fetchPin = async (pinId) => {
		const response = await nhost.graphql.request(GET_PIN_QUERY, {
			id: pinId,
		});

		if (response.error) {
			Alert.alert("Error fetching the pin");
		} else {
			setPin(response.data.pins_by_pk);
		}
	};

	useEffect(() => {
		fetchPin(pinId);
	}, [pinId]);

	const goBack = () => {
		navigation.goBack();
	};

	if (!pin) {
		return <Text>Pin not found</Text>;
	}

	return (
		<SafeAreaView style={{ backgroundColor: "black" }}>
			<StatusBar style="light" />
			<View style={styles.root}>
				<RemoteImage fileId={pin.image}/>
				<Text style={styles.title}>{pin.title}</Text>
			</View>
			<Pressable
				onPress={goBack}
				style={[styles.backBtn, { top: insets.top + 10 }]}
			>
				<Ionicons name={"chevron-back"} size={35} color="white" />
			</Pressable>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	root: {
		height: "100%",
		backgroundColor: "white",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	image: {
		width: "100%",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	title: {
		margin: 10,
		fontWeight: "500",
		fontSize: 24,
		textAlign: "center",
		lineHeight: 35,
	},
	backBtn: {
		position: "absolute",
		left: 10,
	},
});

export default PinScreen;
