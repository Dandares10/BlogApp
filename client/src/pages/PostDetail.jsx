import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getPostById, getComments, addComment, deleteComment, likePost, reactToPost, deletePost } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { calculateReadingTime, formatDate, getCoverImage } from '../utils/helpers';
import { Heart, Clock, User, Share2, Edit, Trash2, ArrowLeft, Send, MessageSquare, Check, Sparkles, Sprout } from 'lucide-react';

const REACTION_TYPES = [
  { key: 'inspiring', label: 'Inspiring', emoji: '✨' },
  { key: 'relatable', label: 'Relatable', emoji: '❤️' },
  { key: 'well_said', label: 'Well said', emoji: '👏' },
  { key: 'mind_blown', label: 'Mind blown', emoji: '🤯' },
];

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postRes, commentsRes] = await Promise.all([
          getPostById(id),
          getComments(id),
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
        setError('');
      } catch (err) {
        setError('Article not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReaction = async (type) => {
    if (!user) {
      showToast('Please sign in to share a reaction!', 'info');
      return;
    }
    try {
      const res = await reactToPost(id, type);
      setPost(res.data);
      showToast(`Reacted with ${type.replace('_', ' ')}!`, 'success');
    } catch (err) {
      showToast('Failed to add reaction', 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      setError('Please log in to leave a comment.');
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await addComment(id, { text: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
      setError('');
      showToast('Comment posted successfully!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      showToast('Comment deleted', 'info');
    } catch (err) {
      showToast('Failed to delete comment', 'error');
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this story? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deletePost(id);
      showToast('Article deleted', 'info');
      navigate('/');
    } catch (err) {
      showToast('Failed to delete article', 'error');
      setDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const currentUserId = user?.id || user?._id;
  const isAuthor = post && currentUserId && (post.author?._id === currentUserId || post.author === currentUserId);

  // Group reactions counts
  const reactionCounts = (post?.reactions || []).reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  const userReactions = (post?.reactions || [])
    .filter(r => (r.user?._id || r.user) === currentUserId)
    .map(r => r.type);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 w-full animate-pulse space-y-6">
          <div className="bg-slate-900 h-72 rounded-3xl w-full" />
          <div className="bg-slate-900 h-8 rounded-xl w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center flex-1 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold text-white mb-2">Article Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">{error || 'This article may have been removed.'}</p>
          <Link to="/" className="gradient-btn px-6 py-2.5 rounded-full text-xs font-semibold">
            Return to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold mb-8 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        {/* Cover Image Header */}
        <div className="relative h-72 sm:h-[400px] w-full rounded-3xl overflow-hidden mb-8 border border-slate-800 shadow-2xl">
          <img
            src={getCoverImage(post)}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {post.tags && post.tags.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
              {post.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 text-xs font-bold rounded-full bg-slate-950/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Header Metadata */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6 font-display">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {post.author?.username ? post.author.username[0].toUpperCase() : <User className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-semibold text-slate-200">{post.author?.username || 'Anonymous'}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Published {formatDate(post.createdAt)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {calculateReadingTime(post.content)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>

              {isAuthor && (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <Link
                    to={`/edit/${post._id}`}
                    className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 transition"
                    title="Edit Story"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleDeletePost}
                    disabled={deleting}
                    className="p-2 rounded-full bg-slate-900 hover:bg-red-500/20 text-red-400 border border-slate-800 transition"
                    title="Delete Story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Article Body Content */}
        <article className="prose prose-invert max-w-none mb-12">
          <div className="text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4">
            {post.content}
          </div>
        </article>

        {/* Welcoming Reactions Bar (Inspiring, Relatable, Well said, Mind blown) */}
        <section className="glass-card rounded-2xl p-6 mb-12 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>How did this story make you feel?</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {REACTION_TYPES.map((r) => {
              const active = userReactions.includes(r.key);
              const count = reactionCounts[r.key] || 0;
              return (
                <button
                  key={r.key}
                  onClick={() => handleReaction(r.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span>{r.label}</span>
                  {count > 0 && <span className="opacity-80 text-[11px] font-mono">({count})</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Comments Section with Newbie Badge Support */}
        <section className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800">
          <div className="flex items-center gap-2 text-xl font-bold text-white mb-6">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <h3>Discussion ({comments.length})</h3>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {user ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="relative">
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share a thoughtful comment..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="absolute right-3 bottom-3 gradient-btn px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingComment ? 'Posting...' : 'Comment'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center mb-8 text-xs text-slate-400">
              <Link to="/login" className="text-indigo-400 font-semibold hover:underline">Sign in</Link> to participate in the conversation.
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-6">
                No comments yet. Be the first to start the discussion!
              </p>
            ) : (
              comments.map((c, index) => {
                const isCommentAuthor = currentUserId && (c.author?._id === currentUserId || c.author === currentUserId);
                const isFirstTimeCommenter = index === comments.findIndex(comm => comm.author?._id === c.author?._id);

                return (
                  <div key={c._id} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {c.author?.username ? c.author.username[0].toUpperCase() : 'A'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-semibold text-slate-200">{c.author?.username || 'Anonymous'}</span>
                          
                          {/* Gentle Welcome Tag */}
                          {isFirstTimeCommenter && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                              <Sprout className="w-3 h-3" />
                              <span>🌱 welcome</span>
                            </span>
                          )}

                          <span className="text-[10px] text-slate-500">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{c.text}</p>
                      </div>
                    </div>

                    {isCommentAuthor && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default PostDetail;