/**
 * Filter Modal Component
 * Allows users to filter events by type, difficulty, and date range
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { X, Check, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { EventType, DifficultyLevel } from '../types';

interface FilterModalProps {
  visible: boolean;
  filters: {
    type: EventType | null;
    difficulty: DifficultyLevel | null;
    dateRange: { start: Date; end: Date } | null;
  };
  onApplyFilters: (filters: {
    type: EventType | null;
    difficulty: DifficultyLevel | null;
    dateRange: { start: Date; end: Date } | null;
  }) => void;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onApplyFilters,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const eventTypes: EventType[] = ['Yoga', 'Run', 'Match'];
  const difficultyLevels: DifficultyLevel[] = [
    'Beginner', 'Intermediate', 'Advanced', 'All Ages', 'Low', 'High', 'Mixed', 'Amateur', 'Family & Kids'
  ];

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      type: null,
      difficulty: null,
      dateRange: null,
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  const handleDateRangeToggle = () => {
    if (localFilters.dateRange) {
      setLocalFilters({ ...localFilters, dateRange: null });
    } else {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      setLocalFilters({ 
        ...localFilters, 
        dateRange: { start: today, end: nextWeek } 
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.title}>Filter Events</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Event Type Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Event Type</Text>
            <View style={styles.optionsGrid}>
              {eventTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionButton,
                    localFilters.type === type && styles.optionButtonActive,
                  ]}
                  onPress={() => setLocalFilters({ 
                    ...localFilters, 
                    type: localFilters.type === type ? null : type 
                  })}
                >
                  {localFilters.type === type && (
                    <Check size={16} color="#2563eb" />
                  )}
                  <Text style={[
                    styles.optionText,
                    localFilters.type === type && styles.optionTextActive,
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Difficulty Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Difficulty Level</Text>
            <View style={styles.optionsGrid}>
              {difficultyLevels.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.optionButton,
                    localFilters.difficulty === difficulty && styles.optionButtonActive,
                  ]}
                  onPress={() => setLocalFilters({ 
                    ...localFilters, 
                    difficulty: localFilters.difficulty === difficulty ? null : difficulty 
                  })}
                >
                  {localFilters.difficulty === difficulty && (
                    <Check size={16} color="#2563eb" />
                  )}
                  <Text style={[
                    styles.optionText,
                    localFilters.difficulty === difficulty && styles.optionTextActive,
                  ]}>
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Range Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date Range</Text>
            <TouchableOpacity
              style={[
                styles.dateRangeButton,
                localFilters.dateRange && styles.dateRangeButtonActive,
              ]}
              onPress={handleDateRangeToggle}
            >
              <Calendar size={20} color={localFilters.dateRange ? '#2563eb' : '#6b7280'} />
              <Text style={[
                styles.dateRangeText,
                localFilters.dateRange && styles.dateRangeTextActive,
              ]}>
                {localFilters.dateRange ? 'Custom Date Range' : 'Any Date'}
              </Text>
              {localFilters.dateRange && (
                <Check size={16} color="#2563eb" />
              )}
            </TouchableOpacity>

            {localFilters.dateRange && (
              <View style={styles.dateInputs}>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.dateLabel}>Start Date</Text>
                  <Text style={styles.dateValue}>
                    {localFilters.dateRange.start.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.dateLabel}>End Date</Text>
                  <Text style={styles.dateValue}>
                    {localFilters.dateRange.end.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showStartDatePicker && localFilters.dateRange && (
          <DateTimePicker
            value={localFilters.dateRange.start}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate && localFilters.dateRange) {
                setLocalFilters({
                  ...localFilters,
                  dateRange: {
                    ...localFilters.dateRange,
                    start: selectedDate,
                  },
                });
              }
            }}
          />
        )}

        {showEndDatePicker && localFilters.dateRange && (
          <DateTimePicker
            value={localFilters.dateRange.end}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate && localFilters.dateRange) {
                setLocalFilters({
                  ...localFilters,
                  dateRange: {
                    ...localFilters.dateRange,
                    end: selectedDate,
                  },
                });
              }
            }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  clearText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  optionButtonActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  optionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionTextActive: {
    color: '#2563eb',
    fontWeight: '500',
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  dateRangeButtonActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  dateRangeText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
  },
  dateRangeTextActive: {
    color: '#2563eb',
    fontWeight: '500',
  },
  dateInputs: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  applyButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;