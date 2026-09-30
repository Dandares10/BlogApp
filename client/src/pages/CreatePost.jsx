import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPost } from '../services/api';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { DEFAULT_COVER_IMAGES } from '../utils/helpers';
import { PenSquare, Eye, Image as ImageIcon, ArrowLeft, Send, Sparkles, Save, Lightbulb, Check } from 'lucide-react';

const CATEGORY_OPTIONS = ['Technology', 'Design', 'AI & ML', 'Engineering', 'Web Dev', 'Lifestyle'];

const WRITING_STARTERS = [
  { label: "💡 What I learned this week", title: "Something new I learned this week in tech", content: "This week, I dove into..." },
  { label: "🚀 Project Showcase", title: "Building my latest project with modern tools", content: "I've been working on a new project that solves..." },
  { label: "🛠️ Tool Breakdown", title: "Why I recommend this developer tool", content: "One tool that completely changed my workflow is..." },
  { label: "🐛 Bug Debugging Story", title: "How I tracked down a mysterious bug", content: "Here is the story of a tricky bug I encountered and how I fixed it..." },
];

function CreatePost() {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => {
    const savedDraft = localStorage.getItem('nexus_draft');
    if (savedDraft) {
      try { return JSON.parse(savedDraft); } catch (e) {}
    }
    return { title: '', summary: '', content: '', coverImage: '', tags: ['Technology'] };
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const navigate = useNavigate();

  // Autosave draft every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      if (form.title.trim() || form.content.trim()) {
        localStorage.setItem('nexus_draft', JSON.stringify(form));
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleTag = (cat) => {
    if (form.tags.includes(cat)) {
      setForm({ ...form, tags: form.tags.filter(t => t !== cat) });
    } else {
      setForm({ ...form, tags: [...form.tags, cat] });
    }
  };

  const applyWritingStarter = (starter) => {
    setForm((prev) => ({
      ...prev,
      title: prev.title || starter.title,
      content: prev.content ? `${prev.content}\n\n${starter.content}` : starter.content,
    }));
    showToast(`Applied starter: "${starter.label}"`, 'info');
  };

  const handleSelectPresetCover = (url) => {
    setForm({ ...form, coverImage: url });
  };

  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Please provide a title and story content.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await createPost(form);
      localStorage.removeItem('nexus_draft');
      showToast('🎉 Your article has been published!', 'success');
      navigate(`/post/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish story');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </Link>

          {lastSavedTime && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Draft saved {lastSavedTime}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcoming Story Editor</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">Write Article</h1>
          </div>

          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-white transition"
          >
            {previewMode ? <PenSquare className="w-4 h-4 text-indigo-400" /> : <Eye className="w-4 h-4 text-indigo-400" />}
            <span>{previewMode ? 'Back to Edit' : 'Live Preview'}</span>
          </button>
        </div>

        {/* Gentle Writing Starters Banner */}
        {!previewMode && (
          <div className="glass-card rounded-2xl p-4 mb-6 border border-indigo-500/20 bg-indigo-950/20">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Gentle Writing Starters (Staring at a blank page?)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {WRITING_STARTERS.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => applyWritingStarter(s)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-800 transition"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {previewMode ? (
          <div className="glass-card rounded-3xl p-8 border border-slate-800">
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Cover Preview"
                className="w-full h-64 object-cover rounded-2xl mb-6"
              />
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {form.tags.map((t, i) => (
                <span key={i} className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{form.title || 'Untitled Article'}</h1>
            {form.summary && <p className="text-slate-400 italic mb-6">{form.summary}</p>}
            <div className="text-slate-300 whitespace-pre-line leading-relaxed">
              {form.content || 'Start typing your story below...'}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Article Title *</label>
              <input
                type="text"
                name="title"
                placeholder="Enter a compelling title..."
                value={form.title}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-lg font-bold focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition"
                required
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Subtitle / Summary</label>
              <input
                type="text"
                name="summary"
                placeholder="A brief overview of your post..."
                value={form.summary}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Category Tags</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const active = form.tags.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleTag(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        active
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Cover Image URL</label>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <input
                  type="url"
                  name="coverImage"
                  placeholder="https://images.unsplash.com/..."
                  value={form.coverImage}
                  onChange={handleChange}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60 transition"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {DEFAULT_COVER_IMAGES.map((url, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleSelectPresetCover(url)}
                    className={`relative w-20 h-12 rounded-lg overflow-hidden border-2 transition ${
                      form.coverImage === url ? 'border-indigo-500 scale-105' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea & Word Count */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Article Content *</label>
                <span className="text-xs text-slate-500 font-mono">{wordCount} words</span>
              </div>
              <textarea
                name="content"
                rows={12}
                placeholder="Write your story here..."
                value={form.content}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition resize-y font-mono leading-relaxed"
                required
              />
            </div>

            {/* Submit & Save */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Draft saved automatically to your device</span>
              <button
                type="submit"
                disabled={submitting}
                className="gradient-btn px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Publishing Story...' : 'Publish Article'}</span>
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default CreatePost;