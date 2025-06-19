import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Lightbulb, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { NoteWithScamper } from "@shared/schema";

export default function NoteList() {
  const { toast } = useToast();
  
  const { data: notes, isLoading } = useQuery<NoteWithScamper[]>({
    queryKey: ["/api/notes"],
  });

  const createNoteMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/notes", {
      title: "",
      content: ""
    }),
    onSuccess: async (res) => {
      const newNote = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      // Navigate to the new note
      window.location.href = `/notes/${newNote.id}`;
    },
    onError: () => {
      toast({
        title: "エラー",
        description: "メモの作成に失敗しました",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-white shadow-material-lg sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-3">
            <h1 className="text-xl font-medium">メモ一覧</h1>
          </div>
        </header>
        <main className="max-w-md mx-auto bg-surface min-h-screen">
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white shadow-material-lg sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-medium">メモ一覧</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto bg-surface min-h-screen">
        {!notes || notes.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Lightbulb className="text-3xl text-gray-400" size={32} />
            </div>
            <p className="text-text-secondary mb-2">メモを作成して</p>
            <p className="text-text-secondary mb-6">SCAMPERで創造的思考を始めましょう</p>
          </div>
        ) : (
          <div className="px-4 py-2">
            {notes.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <Card className="mb-3 shadow-sm hover:shadow-material transition-shadow cursor-pointer border border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-text-primary text-base leading-tight">
                        {note.title || "無題のメモ"}
                      </h3>
                      <span className="text-xs text-text-secondary ml-3 whitespace-nowrap flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(note.createdAt.toString())}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {note.content || "内容がありません"}
                    </p>
                    <div className="flex items-center mt-3">
                      <div className="flex items-center text-xs text-text-secondary">
                        <Lightbulb 
                          className={`mr-1 ${note.scamperProgress > 0 ? 'text-secondary' : 'text-gray-400'}`} 
                          size={14} 
                        />
                        <span className={note.scamperProgress > 0 ? '' : 'text-gray-400'}>
                          SCAMPER: {note.scamperProgress > 0 ? `${note.scamperProgress}/7完了` : '未開始'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <Button
          className="fixed bottom-6 right-6 bg-secondary hover:bg-secondary/90 text-white w-14 h-14 rounded-full shadow-material-lg p-0 transition-all duration-200 hover:scale-105"
          onClick={() => createNoteMutation.mutate()}
          disabled={createNoteMutation.isPending}
        >
          <Plus size={24} />
        </Button>
      </main>
    </div>
  );
}
