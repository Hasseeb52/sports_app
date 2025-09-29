/**
 * Create Event Screen
 * Allows organizers to create new events with form validation and image upload
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Calendar, Clock, MapPin, Camera, Users, FileText } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useEvents } from '../../contexts/EventsContext';
import { useAuth } from '../../contexts/AuthContext';
import { EventType, DifficultyLevel } from '../../types';
import { router } from 'expo-router';
import PickerModal from '../../components/PickerModal';

export default function CreateEvent() {
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('Yoga');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [dateTime, setDateTime] = useState(new Date());
  const [duration, setDuration] = useState('60');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);

  const eventTypes: EventType[] = ['Yoga', 'Run', 'Match'];
  const difficultyLevels: DifficultyLevel[] = [
    'Beginner', 'Intermediate', 'Advanced', 'All Ages', 'Low', 'High', 'Mixed', 'Amateur', 'Family & Kids'
  ];

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter an event title');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Please enter an event address');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter an event description');
      return false;
    }
    if (!shortDescription.trim()) {
      Alert.alert('Validation Error', 'Please enter a short description');
      return false;
    }
    if (parseInt(duration) <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid duration');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!user || user.role !== 'organizer') {
      Alert.alert('Access Denied', 'Only organizers can create events');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      const eventData = {
        title: title.trim(),
        type,
        dateTime,
        duration: parseInt(duration),
        location: {
          address: address.trim(),
          coordinates: {
            latitude: 0, // TODO: Implement geocoding
            longitude: 0,
          },
        },
        difficulty,
        imageURL: imageUri || '', // TODO: Upload to Firebase Storage
        description: description.trim(),
        shortDescription: shortDescription.trim(),
      };

      await createEvent(eventData);
      Alert.alert('Success', 'Event created successfully!', [
        { text: 'OK', onPress: () => router.push('/(tabs)/') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'organizer') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.accessDenied}>
          <Users size={64} color="#6b7280" />
          <Text style={styles.accessDeniedText}>
            Only organizers can create events. Please contact an administrator to upgrade your account.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Event</Text>
        </View>

        <View style={styles.form}>
          {/* Event Title */}
          <View style={styles.field}>
            <Text style={styles.label}>Event Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Morning Yoga Session"
            />
          </View>

          {/* Event Type */}
          <View style={styles.field}>
            <Text style={styles.label}>Event Type *</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowTypePicker(true)}
            >
              <Text style={styles.pickerText}>{type}</Text>
              <FileText size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Difficulty */}
          <View style={styles.field}>
            <Text style={styles.label}>Difficulty Level *</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowDifficultyPicker(true)}
            >
              <Text style={styles.pickerText}>{difficulty}</Text>
              <FileText size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Date and Time */}
          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Date *</Text>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.pickerText}>
                  {dateTime.toLocaleDateString()}
                </Text>
                <Calendar size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Time *</Text>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.pickerText}>
                  {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Clock size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Duration */}
          <View style={styles.field}>
            <Text style={styles.label}>Duration (minutes) *</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="60"
              keyboardType="numeric"
            />
          </View>

          {/* Location */}
          <View style={styles.field}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. Central Park, 5th Avenue, New York"
            />
          </View>

          {/* Short Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Short Description *</Text>
            <TextInput
              style={styles.input}
              value={shortDescription}
              onChangeText={setShortDescription}
              placeholder="Brief description for the event list"
              maxLength={100}
            />
          </View>

          {/* Full Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Full Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Detailed description of the event..."
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Event Image */}
          <View style={styles.field}>
            <Text style={styles.label}>Event Image</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.selectedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Camera size={32} color="#6b7280" />
                  <Text style={styles.imagePickerText}>Tap to select image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating Event...' : 'Create Event'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={dateTime}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const newDateTime = new Date(dateTime);
              newDateTime.setFullYear(selectedDate.getFullYear());
              newDateTime.setMonth(selectedDate.getMonth());
              newDateTime.setDate(selectedDate.getDate());
              setDateTime(newDateTime);
            }
          }}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={dateTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              const newDateTime = new Date(dateTime);
              newDateTime.setHours(selectedTime.getHours());
              newDateTime.setMinutes(selectedTime.getMinutes());
              setDateTime(newDateTime);
            }
          }}
        />
      )}

      {/* Type Picker */}
      <PickerModal
        visible={showTypePicker}
        title="Select Event Type"
        options={eventTypes}
        selectedOption={type}
        onSelect={(value) => {
          setType(value as EventType);
          setShowTypePicker(false);
        }}
        onClose={() => setShowTypePicker(false)}
      />

      {/* Difficulty Picker */}
      <PickerModal
        visible={showDifficultyPicker}
        title="Select Difficulty Level"
        options={difficultyLevels}
        selectedOption={difficulty}
        onSelect={(value) => {
          setDifficulty(value as DifficultyLevel);
          setShowDifficultyPicker(false);
        }}
        onClose={() => setShowDifficultyPicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#374151',
  },
  imagePickerButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePickerText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 14,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  accessDenied: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
  },
});