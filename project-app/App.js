import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Calendar from "expo-calendar";
import * as ImagePicker from "expo-image-picker";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { RNCamera } from 'react-native-camera'; // Import the RNCamera component
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }) {
  const [calendarId, setCalendarId] = useState(null);
  const [tripAdded, setTripAdded] = useState(false);
  const [image, setImage] = useState(null);
  const [tripDetails, setTripDetails] = useState({
    title: "My Trip",
    startDate: new Date(),
    endDate: new Date(),
    allDay: true,
    location: "Destination City",
    description: "Trip description",
    timeZone: "America/New_York",
  });

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        setCalendarId(calendars[0].id);
      }
    })();
  }, []);

  const handleTitleChange = (text) => {
    setTripDetails({
      ...tripDetails,
      title: text,
    });
  };

  const handleLocationChange = (text) => {
    setTripDetails({
      ...tripDetails,
      location: text,
    });
  };

  const handleDescriptionChange = (text) => {
    setTripDetails({
      ...tripDetails,
      description: text,
    });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const addTripToCalendar = async () => {
    if (!calendarId) {
      console.error("Calendar not found");
      return;
    }

    try {
      // Include the description as notes
      const eventDetails = {
        ...tripDetails,
        notes: tripDetails.description, // Set the description as notes
      };

      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      console.log(`Event added to calendar with ID: ${eventId}`);
      setTripAdded(true);
      setTimeout(() => {
        setTripAdded(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      Alert.alert("Error", "Failed to add event to calendar.");
    }
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  const hideStartDatePickerModal = () => {
    setShowStartDatePicker(false);
  };

  const hideEndDatePickerModal = () => {
    setShowEndDatePicker(false);
  };

  const handleStartDateChange = (event, selectedDate) => {
    hideStartDatePickerModal();
    if (selectedDate) {
      setTripDetails({
        ...tripDetails,
        startDate: selectedDate,
      });
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    hideEndDatePickerModal();
    if (selectedDate) {
      setTripDetails({
        ...tripDetails,
        endDate: selectedDate,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.label}>Title:</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleTitleChange}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) =>
            (e.target.placeholder = tripDetails.title || "My Trip")
          }
          placeholder={tripDetails.title || "My Trip"}
        />

        <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleLocationChange}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) =>
            (e.target.placeholder = tripDetails.location || "Destination City")
          }
          placeholder={tripDetails.location || "Destination City"}
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          onChangeText={handleDescriptionChange}
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) =>
            (e.target.placeholder =
              tripDetails.description || "Trip description")
          }
          placeholder={tripDetails.description || "Trip description"}
        />
        <Button
          style={styles.button}
          title="Add Image for Itinerary"
          onPress={pickImage}
        />
        {image && <Image source={{ uri: image }} style={styles.image} />}

        <Button title="Add Trip to Calendar" onPress={addTripToCalendar} />

        {tripAdded && (
          <Text style={styles.successMessage}>Added to Calendar</Text>
        )}

        <Button title="Select Start Date" onPress={showStartDatePickerModal} />

        <Button title="Select End Date" onPress={showEndDatePickerModal} />

        <Modal
          visible={showStartDatePicker}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={tripDetails.startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
              <Button title="Close" onPress={hideStartDatePickerModal} />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showEndDatePicker}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={tripDetails.endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
              <Button title="Close" onPress={hideEndDatePickerModal} />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// function CameraScreen() {
//   return (
//     <View style={styles.container}>
//       {/* RNCamera component from react-native-camera */}
//       <RNCamera
//         style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
//         type={RNCamera.Constants.Type.back}
//         flashMode={RNCamera.Constants.FlashMode.on}
//       />
//     </View>
//   );
// }

// function CameraScreen() {
//   useEffect(() => {
//     const checkCameraPermission = async () => {
//       const result = await check(PERMISSIONS.IOS.CAMERA);

//       if (result === RESULTS.DENIED) {
//         const permissionResult = await request(PERMISSIONS.IOS.CAMERA);
//         if (permissionResult !== RESULTS.GRANTED) {
//           // Handle permission denial
//           console.error('Camera permission denied');
//         }
//       }
//     };

//     checkCameraPermission();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* RNCamera component from react-native-camera */}
//       <RNCamera
//         style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
//         type={RNCamera.Constants.Type.back}
//         flashMode={RNCamera.Constants.FlashMode.on}
//       />
//     </View>
//   );
// }

function CameraScreen() {
  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);

      if (status !== "granted") {
        console.error("Camera permission denied");
      }
    };

    getCameraPermission();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Expo Camera component */}
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  button: {
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 5,
    padding: 5,
    width: "100%",
  },
  multilineInput: {
    height: 80,
    width: "100%",
  },
  successMessage: {
    color: "green",
    marginTop: 10,
  },
});
