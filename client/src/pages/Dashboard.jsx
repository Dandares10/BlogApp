import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPosts, deletePost } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatDate, getCoverImage } from '../utils/helpers';
import { PenSquare, LayoutDashboard, Heart, BookOpen, Trash2, Edit, ExternalLink, User, Sparkles, Flame, Type, TrendingUp } from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const currentUserId = user.id || user._id;
        const res = await getAllPosts({ author: currentUserId });
        setMyPosts(res.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch your articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, navigate]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    try {
      await deletePost(postId);
      setMyPosts(myPosts.filter(p => p._id !== postId));
    } catch (err) {
      alert('Failed to delete story.');
    }
  };

  // Personal Growth Stats Calculations
  const totalWordsWritten = myPosts.reduce((acc, p) => {
    const wordCount = (p.content || '').trim().split(/\s+/).filter(Boolean).length;
    return acc + wordCount;
  }, 0);

  const totalReactionsReceived = myPosts.reduce((acc, p) => {
    const likesCount = p.likes?.length || 0;
    const reactionsCount = p.reactions?.length || 0;
    return acc + likesCount + reactionsCount;
  }, 0);

  // Simple streak calculation based on post dates
  const calculateStreak = () => {
    if (myPosts.length === 0) return 0;
    const dates = myPosts.map(p => new Date(p.createdAt).toDateString());
    const uniqueDates = [...new Set(dates)];
    return Math.min(uniqueDates.length, 7); // Active streak count
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        {/* Profile Banner */}
        <div className="glass-card rounded-3xl p-8 mb-10 border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-xl">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-extrabold text-2xl">
                  {user?.username ? user.username[0].toUpperCase() : <User className="w-8 h-8" />}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-2xl font-extrabold text-white">{user?.username}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                    Active Creator
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
              </div>
            </div>

            <Link
              to="/create"
              className="gradient-btn px-6 py-3 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg"
            >
              <PenSquare className="w-4 h-4" />
              <span>Write New Article</span>
            </Link>
          </div>
        </div>

        {/* Personal Growth Stats Grid */}
        <div className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-300">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <span>Personal Growth & Writing Stats</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Published Stories</p>
              <p className="text-2xl font-extrabold text-white">{myPosts.length}</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Type className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Words Written</p>
              <p className="text-2xl font-extrabold text-white">{totalWordsWritten.toLocaleString()}</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Writing Streak</p>
              <p className="text-2xl font-extrabold text-white">{calculateStreak()} Days</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Community Impact</p>
              <p className="text-2xl font-extrabold text-white">{totalReactionsReceived}</p>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-indigo-400" />
              <span>Your Published Stories</span>
            </h2>
            <span className="text-xs text-slate-500">{myPosts.length} stories</span>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-20 bg-slate-900 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <p className="text-red-400 text-xs text-center py-8">{error}</p>
          ) : myPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300 mb-1">No articles published yet</h3>
              <p className="text-xs text-slate-500 mb-4">Start sharing your thoughts and knowledge!</p>
              <Link to="/create" className="gradient-btn px-5 py-2 rounded-full text-xs font-semibold inline-block">
                Write First Story
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <div
                  key={post._id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={getCoverImage(post)}
                      alt={post.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <Link to={`/post/${post._id}`}>
                        <h3 className="text-base font-bold text-white hover:text-indigo-300 transition line-clamp-1">
                          {post.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>Published {formatDate(post.createdAt)}</span>
                        <span>•</span>
                        <span className="text-slate-300 font-mono">
                          {(post.content || '').trim().split(/\s+/).filter(Boolean).length} words
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      to={`/post/${post._id}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="View Article"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/edit/${post._id}`}
                      className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition"
                      title="Edit Article"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
