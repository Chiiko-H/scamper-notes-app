import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, Shuffle, Edit, Recycle, MinusCircle, Undo, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NoteWithScamper, ScamperData } from "@shared/schema";

export default function ScamperEditor() {
  const [, params] = useRoute("/notes/:id/scamper");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const noteId = params?.id ? parseInt(params.id) : null;

  const [scamperData, setScamperData] = useState({
    substitute: "",
    combine: "",
    adapt: "",
    modify: "",
    putToOtherUse: "",
    eliminate: "",
    reverse: "",
  });

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
    if (note?.scamper) {
      setScamperData({
        substitute: note.scamper.substitute || "",
        combine: note.scamper.combine || "",
        adapt: note.scamper.adapt || "",
        modify: note.scamper.modify || "",
        putToOtherUse: note.scamper.putToOtherUse || "",
        eliminate: note.scamper.eliminate || "",
        reverse: note.scamper.reverse || "",
      });
    }
  }, [note]);

  const saveScamperMutation = useMutation({
    mutationFn: (data: typeof scamperData) =>
      apiRequest("POST", `/api/notes/${noteId}/scamper`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notes", noteId] });
      toast({
        title: "保存完了",
        description: "SCAMPERデータが保存されました",
      });
      setLocation(`/notes/${noteId}`);
    },
    onError: () => {
      toast({
        title: "エラー",
        description: "SCAMPERデータの保存に失敗しました",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveScamperMutation.mutate(scamperData);
  };

  const handleCancel = () => {
    setLocation(`/notes/${noteId}`);
  };

  const updateField = (field: keyof typeof scamperData, value: string) => {
    setScamperData(prev => ({ ...prev, [field]: value }));
  };

  const calculateProgress = () => {
    const fields = Object.values(scamperData);
    const completed = fields.filter(field => field.trim().length > 0).length;
    return { completed, total: 7, percentage: (completed / 7) * 100 };
  };

  const progress = calculateProgress();

  const scamperFields = [
    {
      key: 'substitute' as const,
      label: 'Substitute (置き換え)',
      placeholder: '何を他のものに置き換えることができますか？',
      icon: RefreshCw,
    },
    {
      key: 'combine' as const,
      label: 'Combine (組み合わせ)',
      placeholder: '何と何を組み合わせることができますか？',
      icon: Shuffle,
    },
    {
      key: 'adapt' as const,
      label: 'Adapt (適応)',
      placeholder: '他の分野から何を適応できますか？',
      icon: Repeat,
    },
    {
      key: 'modify' as const,
      label: 'Modify (修正)',
      placeholder: '何を変更・修正できますか？',
      icon: Edit,
    },
    {
      key: 'putToOtherUse' as const,
      label: 'Put to Other Use (転用)',
      placeholder: '他の用途に使えますか？',
      icon: Recycle,
    },
    {
      key: 'eliminate' as const,
      label: 'Eliminate (除去)',
      placeholder: '何を取り除くことができますか？',
      icon: MinusCircle,
    },
    {
      key: 'reverse' as const,
      label: 'Reverse (逆転)',
      placeholder: '順序を逆にしたり、役割を入れ替えたりできますか？',
      icon: Undo,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-white shadow-material-lg sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white"
              onClick={handleCancel}
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-xl font-medium">SCAMPER編集</h1>
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

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white shadow-material-lg sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 text-white"
            onClick={handleCancel}
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-xl font-medium">SCAMPER編集</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto bg-surface min-h-screen p-6">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">進捗状況</span>
            <span className="text-sm font-medium text-primary">
              {progress.completed}/{progress.total}
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>

        {/* SCAMPER Form */}
        <div className="space-y-6">
          {scamperFields.map((field) => {
            const IconComponent = field.icon;
            const hasContent = scamperData[field.key].trim().length > 0;
            
            return (
              <div key={field.key} className="scamper-field">
                <label className="flex items-center space-x-2 mb-3">
                  <IconComponent className="text-primary" size={16} />
                  <span className="font-medium text-text-primary">{field.label}</span>
                  <div 
                    className={`w-2 h-2 rounded-full ${
                      hasContent ? 'bg-success' : 'bg-gray-300'
                    }`}
                  />
                </label>
                <Textarea
                  className="min-h-20 resize-y"
                  placeholder={field.placeholder}
                  value={scamperData[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                />
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6 mt-6 border-t border-gray-100">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
            disabled={saveScamperMutation.isPending}
          >
            キャンセル
          </Button>
          <Button
            className="flex-1 bg-primary text-white hover:bg-primary-dark"
            onClick={handleSave}
            disabled={saveScamperMutation.isPending}
          >
            {saveScamperMutation.isPending ? "保存中..." : "保存して戻る"}
          </Button>
        </div>
      </main>
    </div>
  );
}
