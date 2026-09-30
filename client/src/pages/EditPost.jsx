import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, updatePost } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { DEFAULT_COVER_IMAGES } from '../utils/helpers';
import { PenSquare, Eye, Image as ImageIcon, ArrowLeft, Save } from 'lucide-react';

const CATEGORY_OPTIONS = ['Technology', 'Design', 'AI & ML', 'Engineering', 'Web Dev', 'Lifestyle'];

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    tags: ['Technology'],
  });
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostById(id);
        setForm({
          title: res.data.title || '',
          summary: res.data.summary || '',
          content: res.data.content || '',
          coverImage: res.data.coverImage || '',
          tags: res.data.tags || ['Technology'],
        });
      } catch (err) {
        setError('Failed to fetch article details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

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

  const handleSelectPresetCover = (url) => {
    setForm({ ...form, coverImage: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Please provide a title and story content.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await updatePost(id, form);
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update story');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 w-full animate-pulse space-y-6">
          <div className="bg-slate-900 h-10 w-1/3 rounded-xl" />
          <div className="bg-slate-900 h-96 rounded-3xl w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <Link to={`/post/${id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold mb-8 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back to Article</span>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white font-display">Edit Article</h1>
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
              {form.content}
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
                value={form.title}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-lg font-bold focus:outline-none focus:border-indigo-500/60 transition"
                required
              />
            </div>

            {/* Short Summary */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Subtitle / Summary</label>
              <input
                type="text"
                name="summary"
                value={form.summary}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 transition"
              />
            </div>

            {/* Category Tags */}
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

            {/* Content */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Article Content *</label>
              <textarea
                name="content"
                rows={12}
                value={form.content}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/60 transition resize-y font-mono leading-relaxed"
                required
              />
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="gradient-btn px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Saving Changes...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default EditPost;
