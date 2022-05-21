import { View, Text, StyleSheet, Image, Pressable} from "react-native";
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons"
import pins from "../assets/data/pins";
import SafeViewAndroid from "../SafeViewAndroid"
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native"

const PinScreen = () => {
	const [aspectRatio, setAspectRatio] = useState(1);

	const route = useRoute()
	const navigation = useNavigation()
	const insets = useSafeAreaInsets()

	const pinId = route.params?.id;
	const pin = pins.find(p => p.id === pinId)

	if(!pin){
		return <Text>Pin not found</Text>
	}

	useEffect(() => {
		if (pin?.image) {
			Image.getSize(pin.image, (width, height) =>
				setAspectRatio(width / height)
			);
		}
	}, [pin.image]);

	const goBack = () => {
		navigation.goBack()
	}

	return (
		<SafeAreaView style={{backgroundColor: "black"}}>
			<StatusBar style="light"/>
			<View style={styles.root}>
				<Image
					source={{ uri: pin.image }}
					style={[styles.image, { aspectRatio }]}
				/>
				<Text style={styles.title}>{pin.title}</Text>
			</View>
			<Pressable onPress={goBack} style={[styles.backBtn, {top: insets.top + 10}]}>
				<Ionicons name={"chevron-back"} size={35} color="white"/>
			</Pressable>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	root: {
		height: "100%",
		backgroundColor: "white",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30  
	},
	image: {
		width: "100%",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30
	},
	title: {
		margin: 10,
		fontWeight: "500",
		fontSize: 24,
		textAlign: "center",
		lineHeight: 35
	},
	backBtn: {
		position: "absolute",
		left: 10
	}
});

export default PinScreen;
