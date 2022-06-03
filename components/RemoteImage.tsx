import { useState, useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useNhostClient } from "@nhost/react";

const RemoteImage = ({ fileId }) => {
	const [ratio, setAspectRatio] = useState(1);
	const [imageUri, setImageUri] = useState("");

	const nhost = useNhostClient();

	const fetchImage = async () => {
		const result = await nhost.storage.getPresignedUrl({
			fileId,
		});
		if (result.presignedUrl?.url) {
			setImageUri(result.presignedUrl.url);
		}
	};

	useEffect(() => {
		fetchImage();
	}, [fileId]);

	useEffect(() => {
		if (imageUri) {
			Image.getSize(imageUri, (width, height) =>
				setAspectRatio(width / height)
			);
		}
	}, [imageUri]);

	if(!imageUri){
		return <ActivityIndicator />
	}

	return (
		<Image
			source={{
				uri: imageUri,
			}}
			style={[styles.image, { aspectRatio: ratio }]}
		/>
	);
};

const styles = StyleSheet.create({
	image: {
		width: "100%",
		borderRadius: 15,
		aspectRatio: 1 / 2,
	},
});

export default RemoteImage;
