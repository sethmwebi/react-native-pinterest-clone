import { View, Image, Text, StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";

const Pin = (props) => {
	const { image, title } = props.pin;
	const [ratio, setAspectRatio] = useState(1);

	useEffect(() => {
		if (image) {
			Image.getSize(image, (width, height) => setAspectRatio(width / height));
		}
	}, [image]);

	const onLike = () => {};
	return (
		<View style={styles.pin}>
			<View>
				<Image
					source={{
						uri: image,
					}}
					style={[styles.image, { aspectRatio: ratio }]}
				/>
				<Pressable onPress={onLike} style={styles.heartBtn}>
					<AntDesign name="hearto" size={16} color="black" />
				</Pressable>
			</View>
			<Text style={styles.title} numberOfLines={2}>{title}</Text>
		</View>
	);
};

export default Pin;

const styles = StyleSheet.create({
	pin: {
		width: "100%",
		padding: 4
	},
	title: {
		fontSize: 16,
		fontWeight: "500",
		margin: 5,
		lineHeight: 22,
		color: "#181818"
	},
	image: {
		width: "100%",
		borderRadius: 15,
		aspectRatio: 1 / 2,
	},
	heartBtn: {
		backgroundColor: "#D3CFD4",
		position: "absolute",
		bottom: 10,
		right: 10,
		padding: 5,
		borderRadius: 50,
	},
});
