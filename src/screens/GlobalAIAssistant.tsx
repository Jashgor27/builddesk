'use client';

import { useState } from 'react';
import { getAIQA, getProject, projects } from '@/lib/mockData';
import { Card, SectionHeader } from '@/components/ui';
import { formatINR } from '@/lib/format';
import { Sparkles, Send, FileText, Wallet, Package, FolderOpen, ArrowRight, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const SOURCE_ICONS: Record<string, typeof FileText> = {
  Form: FileText,
  Expense: Wallet,
  Material: Package,
  Project: FolderOpen,
};

const GLOBAL_SUGGESTIONS = [
  { question: 'Which projects are currently over budget?', project: 'All Projects' },
  { question: 'What is the total spent across all projects?', project: 'All Projects' },
  { question: 'Which projects have forms needing review?', project: 'All Projects' },
  { question: 'Show me overdue payments across all projects', project: 'All Projects' },
];

const GLOBAL_ANSWERS: Record<string, { text: string; sources: { label: string; type: string }[] }> = {
  'over budget': {
    text: `Across your 5 projects, 1 project is trending over budget:\n\n• Patel Residence — Cement category is running 10% above the proportional spend rate. Overall project is at 62% of budget with 62% completion.\n\nThe remaining 4 projects are within their planned budget ranges. I recommend reviewing the cement procurement plan for Patel Residence's finishing phase.`,
    sources: [
      { label: 'Patel Residence — Budget Summary', type: 'Project' },
      { label: 'Materials — Cement', type: 'Material' },
    ],
  },
  'total spent': {
    text: `Total spent across all 5 projects: ${formatINR(15982000, { compact: true })}.\n\nBreakdown by project:\n• Patel Residence: ${formatINR(2790000, { compact: true })} (62% of budget)\n• Shah Villa: ${formatINR(930000, { compact: true })} (15% of budget)\n• Mehta Commercial: ${formatINR(8880000, { compact: true })} (48% of budget)\n• Desai Residence: ${formatINR(3050000, { compact: true })} (95% — completed)\n• Kutch Industrial Shed: ${formatINR(3332000, { compact: true })} (34% of budget)\n\nTotal budget across all projects: ${formatINR(42200000, { compact: true })}.`,
    sources: [
      { label: 'All Projects — Budget Summary', type: 'Project' },
      { label: 'Expenses Ledger (All Projects)', type: 'Expense' },
    ],
  },
  'needing review': {
    text: `1 project has forms that need review due to a master info change:\n\n• Patel Residence — 2 forms need review (Building Permission Application, Structural Stability Certificate). Plot Area changed from 2,400 sq.ft → 2,500 sq.ft.\n\nThe other 4 projects have all forms in sync.`,
    sources: [
      { label: 'Patel Residence — Forms', type: 'Form' },
    ],
  },
  'overdue': {
    text: `There is 1 overdue payment across your projects:\n\n• Patel Residence — Aqua Flow Pipes: ₹28,000 (Plumbing, dated 15 Jul 2026). Status: Overdue.\n\nAdditionally, there is 1 pending payment:\n• Patel Residence — Joshi Labour Contractor: ₹85,000 (Masonry labour — August). Status: Pending.`,
    sources: [
      { label: 'Expense — Aqua Flow Pipes (Overdue)', type: 'Expense' },
      { label: 'Expense — Joshi Labour Contractor (Pending)', type: 'Expense' },
    ],
  },
};

type Message = {
  type: 'user' | 'ai';
  text: string;
  sources?: { label: string; type: string }[];
};

export function GlobalAIAssistant() {
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      text: `Hello! I'm your BuildDesk AI Assistant. Choose All Projects for portfolio questions or select one project to keep every answer scoped to that project's records.`,
    },
  ]);
  const [input, setInput] = useState('');

  const findAnswer = (q: string) => {
    const lower = q.toLowerCase();
    if (selectedProjectId !== 'all') {
      const project = getProject(selectedProjectId);
      const match = project && getAIQA(project).find((qa) =>
        qa.question.toLowerCase().includes(lower) || lower.includes(qa.question.toLowerCase().split(' ')[0]),
      );
      return match ? { text: match.answer, sources: match.sources } : null;
    }
    if (lower.includes('over budget')) return GLOBAL_ANSWERS['over budget'];
    if (lower.includes('total spent') || lower.includes('spent across')) return GLOBAL_ANSWERS['total spent'];
    if (lower.includes('review') || lower.includes('needing')) return GLOBAL_ANSWERS['needing review'];
    if (lower.includes('overdue') || lower.includes('pending')) return GLOBAL_ANSWERS['overdue'];
    return null;
  };

  const askQuestion = (question: string) => {
    setMessages((m) => [...m, { type: 'user', text: question }]);
    setInput('');
    const answer = findAnswer(question);
    setTimeout(() => {
      if (answer) {
        setMessages((m) => [...m, { type: 'ai', text: answer.text, sources: answer.sources }]);
      } else {
        setMessages((m) => [...m, {
          type: 'ai',
          text: selectedProjectId === 'all'
            ? `I can help you compare spending across projects, identify over-budget items, find forms needing review, and track overdue payments. Try one of the suggested questions.`
            : `I can answer questions using only ${getProject(selectedProjectId)?.name}'s project records. Try one of the suggested questions for this project.`,
        }]);
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ask Your Project</h1>
            <p className="text-sm text-slate-500 mt-0.5">Mock answers grounded in the selected project scope</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Chat */}
        <Card className="flex flex-col h-[calc(100vh-260px)] min-h-[480px] overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''} animate-slideUp`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0 ${msg.type === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-gradient-to-br from-primary-500 to-primary-700 text-white'
                  }`}>
                  {msg.type === 'user' ? <span className="text-xs font-bold">AK</span> : <Sparkles className="h-4 w-4" />}
                </div>
                <div className="max-w-[80%]">
                  <div className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${msg.type === 'user' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-slate-50 text-slate-700 rounded-tl-sm'
                    }`}>
                    {msg.text}
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs font-medium text-slate-400 mb-1.5">Sources:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, j) => {
                          const Icon = SOURCE_ICONS[src.type] || FileText;
                          return (
                            <span key={j} className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                              <Icon className="h-3 w-3 text-slate-400" />
                              {src.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-2">
              <input
                className="input flex-1"
                placeholder="Ask about any project, expense, form or budget..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && input.trim() && askQuestion(input)}
              />
              <button onClick={() => input.trim() && askQuestion(input)} disabled={!input.trim()} className="btn-primary btn-md">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <label className="label">Project scope</label>
            <select
              className="input"
              value={selectedProjectId}
              onChange={(event) => {
                setSelectedProjectId(event.target.value);
                setMessages([]);
              }}
            >
              <option value="all">All Projects</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
            <p className="mt-2 text-xs text-slate-500">
              {selectedProjectId === 'all' ? 'Portfolio-wide questions only.' : `Answers are limited to ${getProject(selectedProjectId)?.name}.`}
            </p>
          </Card>
          {/* Global suggestions */}
          <Card className="p-5">
            <SectionHeader title={selectedProjectId === 'all' ? 'Portfolio Questions' : 'Project Questions'} />
            <div className="mt-4 space-y-2">
              {(selectedProjectId === 'all'
                ? GLOBAL_SUGGESTIONS
                : getAIQA(getProject(selectedProjectId)!).map((qa) => ({ question: qa.question, project: getProject(selectedProjectId)!.name }))
              ).map((s, i) => (
                <button
                  key={i}
                  onClick={() => askQuestion(s.question)}
                  className="w-full text-left rounded-xl border border-slate-200 p-3 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
                >
                  <div className="flex items-start gap-2.5">
                    <MessageSquare className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{s.question}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Project navigation */}
          <Card className="p-5">
            <SectionHeader title="Project Workspaces" subtitle="Open a project's full workspace" />
            <div className="mt-4 space-y-2">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}/ai`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 font-semibold text-xs flex-shrink-0">
                    {p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.location}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary-500" />
                </Link>
              ))}
            </div>
          </Card>

          {/* Insight */}
          <Card className="p-5 bg-gradient-to-br from-accent-600 to-accent-800 text-white border-0">
            <TrendingUp className="h-6 w-6 text-accent-200 mb-2" />
            <h3 className="text-sm font-bold">Weekly Insight</h3>
            <p className="text-xs text-accent-100 mt-1 leading-relaxed">
              Your overall project portfolio is 48% utilized. Spending is on track except for Patel Residence&apos;s cement category.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
