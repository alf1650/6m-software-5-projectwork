import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Calendar from "expo-calendar";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [calendarId, setCalendarId] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tripAdded, setTripAdded] = useState(false);
  const [image, setImage] = useState(null);
  const [tripDetails, setTripDetails] = useState({
    title: "My Trip",
    startDate: new Date(),
    endDate: new Date(),
    allDay: true, // Set allDay to true for an all-day event
    location: "Destination City",
    description: "Trip description",
    timeZone: "America/New_York",
  });

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

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === "ios");
    setTripDetails({
      ...tripDetails,
      startDate: selectedDate || tripDetails.startDate,
    });
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === "ios");
    setTripDetails({
      ...tripDetails,
      endDate: selectedDate || tripDetails.endDate,
    });
  };

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
      setImage(result.assets[0].uri);
    }
  };

  const addTripToCalendar = async () => {
    if (!calendarId) {
      console.error("Calendar not found");
      return;
    }

    try {
      const eventId = await Calendar.createEventAsync(calendarId, tripDetails);
      console.log(`Event added to calendar with ID: ${eventId}`);
      setTripAdded(true);
      setTimeout(() => {
        setTripAdded(false);
      }, 3000); // Reset the "Added to Calendar" message after 3 seconds
    } catch (error) {
      console.error("Error adding event to calendar:", error);
      Alert.alert("Error", "Failed to add event to calendar.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text style={styles.text}>
            Start Date: {tripDetails.startDate.toDateString()}
          </Text>
          <Button
            style={styles.button}
            title="Select Start Date"
            onPress={showStartDatePickerModal}
          />

          <Text style={styles.text}>
            End Date: {tripDetails.endDate.toDateString()}
          </Text>
          <Button
            style={styles.button}
            title="Select End Date"
            onPress={showEndDatePickerModal}
          />

          <Text style={styles.text}>Title:</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleTitleChange}
            value={tripDetails.title}
          />

          <Text style={styles.text}>Location:</Text>
          <TextInput
            style={styles.input}
            onChangeText={handleLocationChange}
            value={tripDetails.location}
          />

          <Text style={styles.text}>Description:</Text>
          <TextInput
            style={styles.textarea}
            multiline
            onChangeText={handleDescriptionChange}
            value={tripDetails.description}
          />
          <Button
            style={styles.button}
            title="Add Image for Itinerary"
            onPress={pickImage}
          />
          {image && <Image source={{ uri: image }} style={styles.image} />}

          {showStartDatePicker && (
            <DateTimePicker
              value={tripDetails.startDate}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={tripDetails.endDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}

          <Button
            style={styles.button}
            title="Add Trip to Calendar"
            onPress={addTripToCalendar}
          />

          {tripAdded && (
            <Text style={styles.successText}>Added to Calendar</Text>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Set your desired background color
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  button: {
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  textarea: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginVertical: 20,
    borderRadius: 10,
  },
  successText: {
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
});
