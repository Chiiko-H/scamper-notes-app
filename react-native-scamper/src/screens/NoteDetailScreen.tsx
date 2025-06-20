import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { TextInput, Button, Card, Title, Chip, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StorageService } from '../services/StorageService';
import { NoteWithScamper } from '../types';

interface Props {
  navigation: any;
  route: {
    params: {
      noteId: string;
    };
  };
}

export const NoteDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { noteId } = route.params;
  const [note, setNote] = useState<NoteWithScamper | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNote();
  }, [noteId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <IconButton
            icon="delete"
            size={24}
            onPress={handleDelete}
          />
          <IconButton
            icon="content-save"
            size={24}
            onPress={handleSave}
          />
        </View>
      ),
    });
  }, [navigation, title, content]);

  const loadNote = async () => {
    try {
      const noteData = await StorageService.getNote(noteId);
      if (noteData) {
        setNote(noteData);
        setTitle(noteData.title);
        setContent(noteData.content);
      } else {
        Alert.alert('エラー', 'メモが見つかりません');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('エラー', 'メモの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await StorageService.updateNote(noteId, { title, content });
      Alert.alert('成功', 'メモが保存されました');
      loadNote(); // Reload to get updated data
    } catch (error) {
      Alert.alert('エラー', 'メモの保存に失敗しました');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '確認',
      'このメモを削除しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteNote(noteId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('エラー', 'メモの削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  const renderScamperSummary = () => {
    if (!note?.scamper) {
      return (
        <Card style={styles.scamperCard}>
          <Card.Content>
            <Text style={styles.noScamperText}>SCAMPERデータがありません</Text>
          </Card.Content>
        </Card>
      );
    }

    const scamperFields = [
      { key: 'substitute', label: 'Substitute (置き換え)', value: note.scamper.substitute },
      { key: 'combine', label: 'Combine (組み合わせ)', value: note.scamper.combine },
      { key: 'adapt', label: 'Adapt (適応)', value: note.scamper.adapt },
      { key: 'modify', label: 'Modify (修正)', value: note.scamper.modify },
      { key: 'putToOtherUse', label: 'Put to Other Use (転用)', value: note.scamper.putToOtherUse },
      { key: 'eliminate', label: 'Eliminate (除去)', value: note.scamper.eliminate },
      { key: 'reverse', label: 'Reverse (逆転)', value: note.scamper.reverse },
    ];

    return (
      <Card style={styles.scamperCard}>
        <Card.Content>
          {scamperFields.map((field) => (
            <View key={field.key} style={styles.scamperField}>
              <View style={styles.scamperFieldHeader}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: field.value?.trim() ? '#28a745' : '#dee2e6' }
                ]} />
                <Text style={[
                  styles.scamperFieldLabel,
                  { color: field.value?.trim() ? '#212529' : '#6c757d' }
                ]}>
                  {field.label}
                </Text>
              </View>
              <Text style={[
                styles.scamperFieldValue,
                { color: field.value?.trim() ? '#6c757d' : '#adb5bd' }
              ]}>
                {field.value?.trim() || '未入力'}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  if (!note) {
    return (
      <View style={styles.errorContainer}>
        <Text>メモが見つかりません</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Note Title */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>タイトル</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="メモのタイトルを入力..."
            mode="outlined"
          />
        </View>

        {/* Note Content */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>内容</Text>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="メモの内容を入力..."
            mode="outlined"
            multiline
            numberOfLines={6}
          />
        </View>

        {/* SCAMPER Summary */}
        <View style={styles.section}>
          <View style={styles.scamperHeader}>
            <Title style={styles.scamperTitle}>SCAMPER概要</Title>
            <Chip 
              style={[
                styles.progressChip,
                { backgroundColor: note.scamperProgress > 0 ? '#d4edda' : '#f8f9fa' }
              ]}
              textStyle={{
                color: note.scamperProgress > 0 ? '#155724' : '#6c757d'
              }}
            >
              {note.scamperProgress}/7 完了
            </Chip>
          </View>
          
          {renderScamperSummary()}

          <Button
            mode="contained"
            style={styles.scamperButton}
            onPress={() => navigation.navigate('ScamperEditor', { noteId })}
            icon="lightbulb"
          >
            SCAMPER編集
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 18,
  },
  contentInput: {
    fontSize: 16,
    textAlignVertical: 'top',
  },
  scamperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scamperTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#212529',
  },
  progressChip: {
    height: 28,
  },
  scamperCard: {
    backgroundColor: '#f8f9fa',
    marginBottom: 16,
  },
  scamperField: {
    marginBottom: 12,
  },
  scamperFieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  scamperFieldLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  scamperFieldValue: {
    fontSize: 14,
    marginLeft: 16,
    lineHeight: 20,
  },
  noScamperText: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
    paddingVertical: 16,
  },
  scamperButton: {
    backgroundColor: '#3B82F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});