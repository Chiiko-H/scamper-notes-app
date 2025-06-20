import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { TextInput, Button, ProgressBar, IconButton } from 'react-native-paper';
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

export const ScamperEditorScreen: React.FC<Props> = ({ navigation, route }) => {
  const { noteId } = route.params;
  const [note, setNote] = useState<NoteWithScamper | null>(null);
  const [scamperData, setScamperData] = useState({
    substitute: '',
    combine: '',
    adapt: '',
    modify: '',
    putToOtherUse: '',
    eliminate: '',
    reverse: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNote();
  }, [noteId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="content-save"
          size={24}
          onPress={handleSave}
          disabled={saving}
        />
      ),
    });
  }, [navigation, scamperData, saving]);

  const loadNote = async () => {
    try {
      const noteData = await StorageService.getNote(noteId);
      if (noteData) {
        setNote(noteData);
        if (noteData.scamper) {
          setScamperData({
            substitute: noteData.scamper.substitute || '',
            combine: noteData.scamper.combine || '',
            adapt: noteData.scamper.adapt || '',
            modify: noteData.scamper.modify || '',
            putToOtherUse: noteData.scamper.putToOtherUse || '',
            eliminate: noteData.scamper.eliminate || '',
            reverse: noteData.scamper.reverse || '',
          });
        }
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
    setSaving(true);
    try {
      await StorageService.saveScamperData({
        noteId,
        ...scamperData,
      });
      Alert.alert('成功', 'SCAMPERデータが保存されました');
      navigation.goBack();
    } catch (error) {
      Alert.alert('エラー', 'SCAMPERデータの保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof typeof scamperData, value: string) => {
    setScamperData(prev => ({ ...prev, [field]: value }));
  };

  const calculateProgress = () => {
    const fields = Object.values(scamperData);
    const completed = fields.filter(field => field.trim().length > 0).length;
    return { completed, total: 7, percentage: completed / 7 };
  };

  const progress = calculateProgress();

  const scamperFields = [
    {
      key: 'substitute' as const,
      label: 'Substitute (置き換え)',
      placeholder: '何を他のものに置き換えることができますか？',
      icon: 'refresh',
    },
    {
      key: 'combine' as const,
      label: 'Combine (組み合わせ)',
      placeholder: '何と何を組み合わせることができますか？',
      icon: 'merge-type',
    },
    {
      key: 'adapt' as const,
      label: 'Adapt (適応)',
      placeholder: '他の分野から何を適応できますか？',
      icon: 'repeat',
    },
    {
      key: 'modify' as const,
      label: 'Modify (修正)',
      placeholder: '何を変更・修正できますか？',
      icon: 'edit',
    },
    {
      key: 'putToOtherUse' as const,
      label: 'Put to Other Use (転用)',
      placeholder: '他の用途に使えますか？',
      icon: 'recycling',
    },
    {
      key: 'eliminate' as const,
      label: 'Eliminate (除去)',
      placeholder: '何を取り除くことができますか？',
      icon: 'remove-circle',
    },
    {
      key: 'reverse' as const,
      label: 'Reverse (逆転)',
      placeholder: '順序を逆にしたり、役割を入れ替えたりできますか？',
      icon: 'undo',
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>読み込み中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>進捗状況</Text>
            <Text style={styles.progressText}>
              {progress.completed}/{progress.total}
            </Text>
          </View>
          <ProgressBar 
            progress={progress.percentage} 
            color="#3B82F6"
            style={styles.progressBar}
          />
        </View>

        {/* SCAMPER Form */}
        <View style={styles.formSection}>
          {scamperFields.map((field) => {
            const hasContent = scamperData[field.key].trim().length > 0;
            
            return (
              <View key={field.key} style={styles.fieldSection}>
                <View style={styles.fieldHeader}>
                  <Icon 
                    name={field.icon} 
                    size={16} 
                    color="#3B82F6" 
                    style={styles.fieldIcon}
                  />
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: hasContent ? '#28a745' : '#dee2e6' }
                  ]} />
                </View>
                <TextInput
                  style={styles.textInput}
                  value={scamperData[field.key]}
                  onChangeText={(value) => updateField(field.key, value)}
                  placeholder={field.placeholder}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                />
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <Button
            mode="outlined"
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            キャンセル
          </Button>
          <Button
            mode="contained"
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            loading={saving}
            disabled={saving}
          >
            {saving ? '保存中...' : '保存して戻る'}
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
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6c757d',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  formSection: {
    marginBottom: 24,
  },
  fieldSection: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  textInput: {
    fontSize: 14,
    textAlignVertical: 'top',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    marginLeft: 0,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    marginRight: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});