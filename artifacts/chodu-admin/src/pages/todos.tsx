import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ClipboardList, Trash2, Plus, Loader2 } from 'lucide-react';

interface Todo {
  id: string | number;
  name: string;
  is_completed?: boolean;
}

export default function AdminTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on mount
  useEffect(() => {
    async function fetchTodos() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('id', { ascending: true });

        if (error) {
          throw error;
        }

        setTodos(data || []);
      } catch (err: any) {
        console.error('Error fetching todos:', err);
        setError(err.message || 'Failed to fetch todos.');
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  // Add a new todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoName.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const { data, error } = await supabase
        .from('todos')
        .insert([{ name: newTodoName.trim() }])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setTodos((prev) => [...prev, ...data]);
      }
      setNewTodoName('');
    } catch (err: any) {
      console.error('Error adding todo:', err);
      setError(err.message || 'Failed to add todo.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle todo completion
  const handleToggleTodo = async (id: string | number, currentStatus: boolean) => {
    try {
      setError(null);
      const updatedStatus = !currentStatus;

      const { error } = await supabase
        .from('todos')
        .update({ is_completed: updatedStatus })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_completed: updatedStatus } : t))
      );
    } catch (err: any) {
      console.error('Error updating todo:', err);
      setError(err.message || 'Failed to update todo.');
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: string | number) => {
    try {
      setError(null);

      const { error } = await supabase.from('todos').delete().eq('id', id);

      if (error) {
        throw error;
      }

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error('Error deleting todo:', err);
      setError(err.message || 'Failed to delete todo.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supabase Integration Demo</h1>
          <p className="text-muted-foreground">
            A client-side connection demonstrating live data retrieval from Supabase.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/15 text-destructive rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Form Card */}
          <Card className="bg-card border-border shadow-sm md:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm font-medium font-mono uppercase">
                Add Todo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTodo} className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    Todo Title / Name
                  </label>
                  <input
                    type="text"
                    value={newTodoName}
                    onChange={(e) => setNewTodoName(e.target.value)}
                    placeholder="E.g., Complete logistics draft"
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                    disabled={submitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !newTodoName.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#C5A030] text-black font-semibold py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Add Todo
                </button>
              </form>
            </CardContent>
          </Card>

          {/* List Card */}
          <Card className="bg-card border-border shadow-sm md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium font-mono uppercase">
                Active Todos
              </CardTitle>
              <ClipboardList className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm">Loading items from Supabase...</span>
                </div>
              ) : todos.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No todos found. Add a new item to get started!
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {todos.map((todo) => (
                    <li
                      key={todo.id}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleTodo(todo.id, !!todo.is_completed)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            todo.is_completed
                              ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                              : 'border-muted-foreground/30 hover:border-[#D4AF37]'
                          }`}
                        >
                          {todo.is_completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <span
                          className={`text-sm ${
                            todo.is_completed
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {todo.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
