import { useState } from "react";
import {
	Button,
	Image,
	View,
	Platform,
	TextInput,
	StyleSheet,
	Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNhostClient } from "@nhost/react";
import { useNavigation } from "@react-navigation/native";

const CREATE_PIN_MUTATION = `
	mutation MyMutation($image: String!, $title: String) {
  insert_pins(objects: {image: $image, title: $title}){
    returning {
      created_at
      id
      image
      title
      user_id
    }
  }
}
`;

export default function CreatePinScreen() {
	const [imageUri, setImageUri] = useState<null | string>(null);
	const [title, setTitle] = useState("");

	const nhost = useNhostClient();
	const navigation = useNavigation();

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			quality: 1,
		});

		if (!result.cancelled) {
			setImageUri(result.uri);
		}
	};

	const uploadFile = async () => {
		if (!imageUri) {
			return {
				error: { message: "No image selected" },
			};
		}

		const paths = imageUri.split("/");
		const name = paths[paths.length - 1];
		const namePaths = name.split(".");
		const extension = namePaths[namePaths.length - 1];

		const uri =
			Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri;
		const result = await nhost.storage.upload({
			file: {
				name,
				type: `image/${extension}`,
				uri,
			},
		});
		return result;
	};

	const onSubmit = async () => {
		// upload image to storage
		const uploadResult = await uploadFile();

		if (uploadResult.error) {
			Alert.alert("Error uploading the image", uploadResult.error.message);
			return;
		}
		const result = await nhost.graphql.request(CREATE_PIN_MUTATION, {
			title,
			image: uploadResult.fileMetadata.id,
		});

		if (result.error) {
			Alert.alert("Error creating the post ", result.error.message);
		} else {
			navigation.goBack();
		}
	};

	return (
		<View style={styles.root}>
			<Button title="Upload your pin" onPress={pickImage} />
			{imageUri && (
				<>
					<Image source={{ uri: imageUri }} style={styles.image} />
					<TextInput
						placeholder="Title"
						value={title}
						onChangeText={setTitle}
						style={styles.input}
					/>
					<Button title="Submit pin" onPress={onSubmit} />
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	image: {
		width: "100%",
		aspectRatio: 1,
		marginVertical: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: "gainsboro",
		padding: 5,
		width: "100%",
		borderRadius: 5,
		marginVertical: 5,
	},
});
