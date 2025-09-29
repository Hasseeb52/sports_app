/**
 * Event Details Screen
 * Shows detailed event information, comments, and RSVP functionality
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  MessageCircle, 
  Send,
  ExternalLink,
  Star,
  User as UserIcon,
} from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useEvents } from '../../contexts/EventsContext';
import { useAuth } from '../../contexts/AuthContext';
import { Comment } from '../../types';

export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, toggleRSVP, addComment, getComments } = useEvents();
  const { user } = useAuth();
  const [event, setEvent] = useState(events.find(e => e.id === id));
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    // Update event when events change
    const updatedEvent = events.find(e => e.id === id);
    if (updatedEvent) {
      setEvent(updatedEvent);
    }
  }, [events, id]);

  useEffect(() => {
    // Load comments
    loadComments();
  }, [id]);

  const loadComments = async () => {
    if (!id) return;
    
    try {
      setCommentsLoading(true);
      const eventComments = await getComments(id);
      setComments(eventComments);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to RSVP to events');
      return;
    }

    if (!event) return;

    try {
      setLoading(true);
      await toggleRSVP(event.id);
    } catch (error) {
      Alert.alert('Error', 'Failed to update RSVP');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to comment');
      return;
    }

    if (!newComment.trim() || !event) return;

    try {
      await addComment(event.id, newComment.trim());
      setNewComment('');
      // Reload comments to show the new one
      loadComments();
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const openInMaps = () => {
    if (!event) return;
    
    const { address, coordinates } = event.location;
    const url = coordinates.latitude !== 0 
      ? `https://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`
      : `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    
    Linking.openURL(url);
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Event not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isRSVPed = user ? event.rsvpList.includes(user.uid) : false;
  const canRSVP = user && new Date(event.dateTime) > new Date();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        {event.imageURL ? (
          <Image source={{ uri: event.imageURL }} style={styles.heroImage} />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Calendar size={48} color="#d1d5db" />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{event.type}</Text>
              </View>
              <View style={styles.difficultyBadge}>
                <Star size={16} color="#f59e0b" />
                <Text style={styles.difficultyBadgeText}>{event.difficulty}</Text>
              </View>
            </View>
          </View>

          {/* Event Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Calendar size={20} color="#2563eb" />
              <Text style={styles.infoText}>
                {new Date(event.dateTime).toLocaleDateString([], {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Clock size={20} color="#2563eb" />
              <Text style={styles.infoText}>
                {new Date(event.dateTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })} ({event.duration} minutes)
              </Text>
            </View>

            <TouchableOpacity style={styles.infoRow} onPress={openInMaps}>
              <MapPin size={20} color="#2563eb" />
              <Text style={[styles.infoText, styles.linkText]}>
                {event.location.address}
              </Text>
              <ExternalLink size={16} color="#2563eb" />
            </TouchableOpacity>

            <View style={styles.infoRow}>
              <Users size={20} color="#2563eb" />
              <Text style={styles.infoText}>
                {event.rsvpCount} people attending
              </Text>
            </View>
          </View>

          {/* Host Info */}
          <View style={styles.hostSection}>
            <Text style={styles.sectionTitle}>Organized by</Text>
            <View style={styles.hostInfo}>
              <View style={styles.hostAvatar}>
                <UserIcon size={20} color="#6b7280" />
              </View>
              <Text style={styles.hostName}>{event.hostName}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this event</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>

          {/* RSVP Button */}
          {canRSVP && (
            <TouchableOpacity
              style={[
                styles.rsvpButton,
                isRSVPed && styles.rsvpButtonActive,
                loading && styles.rsvpButtonDisabled,
              ]}
              onPress={handleRSVP}
              disabled={loading}
            >
              <Users size={20} color={isRSVPed ? '#ffffff' : '#2563eb'} />
              <Text style={[styles.rsvpButtonText, isRSVPed && styles.rsvpButtonTextActive]}>
                {loading ? 'Updating...' : isRSVPed ? 'You\'re Going!' : 'Join Event'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>
              Comments ({comments.length})
            </Text>

            {/* Add Comment */}
            {user && (
              <View style={styles.addCommentContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  numberOfLines={2}
                />
                <TouchableOpacity
                  style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
                  onPress={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Send size={16} color={newComment.trim() ? '#2563eb' : '#9ca3af'} />
                </TouchableOpacity>
              </View>
            )}

            {/* Comments List */}
            {commentsLoading ? (
              <Text style={styles.loadingText}>Loading comments...</Text>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <View style={styles.commentAvatar}>
                      <UserIcon size={16} color="#6b7280" />
                    </View>
                    <View style={styles.commentMeta}>
                      <Text style={styles.commentAuthor}>{comment.userName}</Text>
                      <Text style={styles.commentDate}>
                        {comment.createdAt.toLocaleDateString()} at{' '}
                        {comment.createdAt.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noCommentsText}>
                No comments yet. {user ? 'Be the first to comment!' : 'Log in to add a comment.'}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  heroPlaceholder: {
    width: '100%',
    height: 240,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#ffffff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    lineHeight: 34,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  difficultyBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  difficultyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  infoSection: {
    marginBottom: 24,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  linkText: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  hostSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hostAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  rsvpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 32,
    gap: 8,
  },
  rsvpButtonActive: {
    backgroundColor: '#2563eb',
  },
  rsvpButtonDisabled: {
    opacity: 0.6,
  },
  rsvpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  rsvpButtonTextActive: {
    color: '#ffffff',
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 24,
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  noCommentsText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentMeta: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  commentDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  commentContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginLeft: 32,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});