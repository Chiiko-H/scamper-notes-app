import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, Lightbulb, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NoteWithScamper } from "@shared/schema";

export default function NoteDetail() {
  const [, params] = useRoute("/notes/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const noteId = params?.id ? parseInt(params.id) : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: note, isLoading } = useQuery<NoteWithScamper>({
    queryKey: ["/api/notes", noteId],
    queryFn: async () => {
      const res = await fetch(`/api/notes/${noteId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch note");
      return res.json();
    },
    enabled: !!noteId,
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const updateNoteMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      apiRequest("PATCH", `/api/notes/${noteId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes", noteId] });
      toast({
        title: "保存完了",
        description: "メモが保存されました",
      });
    },
    onError: () => {
      toast({
        title: "エラー",
        description: "メモの保存に失敗しました",
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/notes/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "削除完了",
        description: "メモが削除されました",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "エラー",
        description: "メモの削除に失敗しました",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateNoteMutation.mutate({ title, content });
  };

  const handleDelete = () => {
    if (confirm("このメモを削除しますか？")) {
      deleteNoteMutation.mutate();
    }
  };

  const renderScamperSummary = () => {
    if (!note?.scamper) {
      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-400">SCAMPER データがありません</p>
        </div>
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
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        {scamperFields.map((field) => (
          <div key={field.key} className="flex items-start space-x-3">
            <div 
              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                field.value && field.value.trim() ? 'bg-success' : 'bg-gray-300'
              }`}
            />
            <div>
              <p className={`text-sm font-medium ${
                field.value && field.value.trim() ? 'text-text-primary' : 'text-gray-400'
              }`}>
                {field.label}
              </p>
              <p className={`text-sm ${
                field.value && field.value.trim() ? 'text-text-secondary' : 'text-gray-400'
              }`}>
                {field.value && field.value.trim() ? field.value : '未入力'}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-white shadow-material-lg sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-xl font-medium">メモ詳細</h1>
          </div>
        </header>
        <main className="max-w-md mx-auto bg-surface min-h-screen p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-white shadow-material-lg sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-xl font-medium">メモ詳細</h1>
          </div>
        </header>
        <main className="max-w-md mx-auto bg-surface min-h-screen p-6">
          <p className="text-center text-text-secondary">メモが見つかりません</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white shadow-material-lg sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-xl font-medium">メモ詳細</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto bg-surface min-h-screen p-6">
        {/* Note Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            タイトル
          </label>
          <Input
            type="text"
            className="text-lg"
            placeholder="メモのタイトルを入力..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Note Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            内容
          </label>
          <Textarea
            className="min-h-32 resize-y"
            placeholder="メモの内容を入力..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* SCAMPER Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-text-primary">SCAMPER概要</h3>
            <Badge 
              className={`${
                note.scamperProgress > 0 
                  ? 'bg-success bg-opacity-10 text-success hover:bg-success hover:bg-opacity-20' 
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {note.scamperProgress}/7 完了
            </Badge>
          </div>
          
          {renderScamperSummary()}

          <Button
            className="w-full mt-4 bg-primary text-white hover:bg-primary-dark flex items-center justify-center space-x-2"
            onClick={() => setLocation(`/notes/${noteId}/scamper`)}
          >
            <Lightbulb size={16} />
            <span>SCAMPER編集</span>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDelete}
            disabled={deleteNoteMutation.isPending}
          >
            <Trash2 size={16} className="mr-2" />
            削除
          </Button>
          <Button
            className="flex-1 bg-primary text-white hover:bg-primary-dark"
            onClick={handleSave}
            disabled={updateNoteMutation.isPending}
          >
            {updateNoteMutation.isPending ? "保存中..." : "保存"}
          </Button>
        </div>
      </main>
    </div>
  );
}
