import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { FAB, Card, Title, Paragraph, ProgressBar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { StorageService } from '../services/StorageService';
import { NoteWithScamper } from '../types';

interface Props {
  navigation: any;
}

export const NoteListScreen: React.FC<Props> = ({ navigation }) => {
  const [notes, setNotes] = useState<NoteWithScamper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
    const unsubscribe = navigation.addListener('focus', loadNotes);
    return unsubscribe;
  }, [navigation]);

  const loadNotes = async () => {
    try {
      const notesData = await StorageService.getNotes();
      setNotes(notesData);
    } catch (error) {
      Alert.alert('エラー', 'メモの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createNewNote = async () => {
    try {
      const newNote = await StorageService.createNote({
        title: '',
        content: ''
      });
      navigation.navigate('NoteDetail', { noteId: newNote.id });
    } catch (error) {
      Alert.alert('エラー', 'メモの作成に失敗しました');
    }
  };

  const renderNoteItem = ({ item }: { item: NoteWithScamper }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.noteHeader}>
            <Title style={styles.noteTitle}>
              {item.title || '無題のメモ'}
            </Title>
            <Text style={styles.dateText}>
              {format(item.createdAt, 'MM/dd', { locale: ja })}
            </Text>
          </View>
          
          <Paragraph style={styles.noteContent} numberOfLines={2}>
            {item.content || '内容がありません'}
          </Paragraph>
          
          <View style={styles.scamperSection}>
            <View style={styles.scamperInfo}>
              <Icon 
                name="lightbulb" 
                size={16} 
                color={item.scamperProgress > 0 ? '#FF6B35' : '#999'} 
              />
              <Text style={[
                styles.scamperText,
                { color: item.scamperProgress > 0 ? '#FF6B35' : '#999' }
              ]}>
                SCAMPER: {item.scamperProgress > 0 ? `${item.scamperProgress}/7完了` : '未開始'}
              </Text>
            </View>
            {item.scamperProgress > 0 && (
              <ProgressBar 
                progress={item.scamperProgress / 7} 
                color="#FF6B35"
                style={styles.progressBar}
              />
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="lightbulb-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>メモを作成して</Text>
      <Text style={styles.emptySubtitle}>SCAMPERで創造的思考を始めましょう</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>メモ一覧</Text>
      </View>
      
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={notes.length === 0 ? styles.emptyContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={loadNotes}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={createNewNote}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#3B82F6',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteCard: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    flex: 1,
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
  },
  noteContent: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
    lineHeight: 20,
  },
  scamperSection: {
    marginTop: 8,
  },
  scamperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  scamperText: {
    fontSize: 12,
    marginLeft: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B35',
  },
});