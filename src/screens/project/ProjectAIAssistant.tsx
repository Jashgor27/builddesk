'use client';

import { useState, useRef, useEffect } from 'react';
import { getProject, getAIQA, type AIQA } from '@/lib/mockData';
import { ProjectScreenWrapper } from './ProjectShell';
import { Card, SectionHeader } from '@/components/ui';
import { Sparkles, Send, FileText, Wallet, Package, FolderOpen, MessageSquare, Lightbulb, ArrowRight, User } from 'lucide-react';

const SOURCE_ICONS: Record<string, typeof FileText> = {
  Form: FileText,
  Expense: Wallet,
  Material: Package,
  Project: FolderOpen,
};

type Message = {
  type: 'user' | 'ai';
  text: string;
  sources?: { label: string; type: string }[];
};

export function ProjectAIAssistant({ projectId }: { projectId: string }) {
  const project = getProject(projectId)!;
  const qaList = getAIQA(project);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      text: `Hi! I'm your AI assistant for ${project.name}. I can answer questions about expenses, forms, materials, budget and documents. Try one of the suggested questions below to get started.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const askQuestion = (qa: AIQA) => {
    setMessages((m) => [...m, { type: 'user', text: qa.question }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { type: 'ai', text: qa.answer, sources: qa.sources }]);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const lower = input.toLowerCase();
    const match = qaList.find((q) => q.question.toLowerCase().includes(lower.split(' ')[0]) || lower.includes(q.question.toLowerCase().split(' ')[1] || ''));
    const userMsg = { type: 'user' as const, text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      if (match) {
        setMessages((m) => [...m, { type: 'ai', text: match.answer, sources: match.sources }]);
      } else {
        setMessages((m) => [...m, {
          type: 'ai',
          text: `Based on the project records for ${project.name}, I can help you with spending breakdowns, form synchronization, material tracking, budget status and document references. Could you rephrase your question? Try one of the suggested questions below.`,
        }]);
      }
    }, 1500);
  };

  return (
    <ProjectScreenWrapper projectId={projectId} active="ai">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Chat area */}
        <Card className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Ask Your Project</h3>
              <p className="text-xs text-slate-500">AI Assistant for {project.name}</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success-500" />
              <span className="text-xs text-slate-500">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''} animate-slideUp`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${msg.type === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-gradient-to-br from-primary-500 to-primary-700 text-white'
                  }`}>
                  {msg.type === 'user' ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>
                <div className={`max-w-[80%] ${msg.type === 'user' ? 'items-end' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${msg.type === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-sm'
                    : 'bg-slate-50 text-slate-700 rounded-tl-sm'
                    }`}>
                    {msg.text}
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <div className="text-xs font-medium text-slate-400">Sources:</div>
                      {msg.sources.map((src, j) => {
                        const Icon = SOURCE_ICONS[src.type] || FileText;
                        return (
                          <div key={j} className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs text-slate-600 mr-1.5">
                            <Icon className="h-3 w-3 text-slate-400" />
                            {src.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3 animate-fadeIn">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-2">
              <input
                className="input flex-1"
                placeholder="Ask about expenses, forms, materials, budget..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} disabled={!input.trim()} className="btn-primary btn-md">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>

        {/* Suggestions sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionHeader title="Suggested Questions" />
            <div className="mt-4 space-y-2">
              {qaList.map((qa, i) => (
                <button
                  key={i}
                  onClick={() => askQuestion(qa)}
                  className="w-full text-left rounded-xl border border-slate-200 p-3 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
                >
                  <div className="flex items-start gap-2.5">
                    <MessageSquare className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{qa.question}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-primary-500 flex-shrink-0 mt-0.5 ml-auto" />
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600 flex-shrink-0">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">AI Insight</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The Cement category is trending 10% above the proportional spend rate. Consider reviewing the procurement plan for the finishing phase.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0">
            <Sparkles className="h-6 w-6 text-accent-400 mb-2" />
            <h3 className="text-sm font-bold">Project Context</h3>
            <p className="text-xs text-primary-200 mt-1">
              This assistant answers based on {project.name}&apos;s forms, expenses, materials and documents.
            </p>
          </Card>
        </div>
      </div>
    </ProjectScreenWrapper>
  );
}
