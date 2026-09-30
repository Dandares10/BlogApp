import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, likePost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Sparkles, TrendingUp, Compass, PenSquare, Search, Flame } from 'lucide-react';
import { getCoverImage, formatDate, calculateReadingTime } from '../utils/helpers';

const CATEGORIES = ['All', 'Technology', 'Design', 'AI & ML', 'Engineering', 'Web Dev', 'Lifestyle'];

function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async (tag = selectedTag, query = searchQuery) => {
    setLoading(true);
    try {
      const res = await getAllPosts({ tag: tag === 'All' ? '' : tag, search: query });
      setPosts(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load stories. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(selectedTag, searchQuery);
  }, [selectedTag]);

  const handleSearchSubmit = (val) => {
    setSearchQuery(val);
    fetchPosts(selectedTag, val);
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert('Please sign in to like articles!');
      return;
    }
    try {
      const res = await likePost(postId);
      setPosts(posts.map(p => p._id === postId ? res.data : p));
    } catch (err) {
      console.error('Failed to toggle like', err);
    }
  };

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onSearchChange={handleSearchSubmit} searchValue={searchQuery} />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to NexusBlog Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto font-display mb-6">
            Discover Stories, Tech Insights & <span className="gradient-text">Creative Ideas</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            A high-performance blog platform for writers, developers, and thinkers to share knowledge and inspire.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={user ? "/create" : "/register"}
              className="gradient-btn px-6 py-3.5 rounded-full font-semibold text-sm shadow-xl flex items-center gap-2"
            >
              <PenSquare className="w-4 h-4" />
              <span>Start Writing Today</span>
            </Link>
            <a
              href="#explore"
              className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Explore Articles</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        
        {/* Category Pills & Filters */}
        <div className="flex items-center justify-between gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTag(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                  selectedTag === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Story Spotlight (If posts exist) */}
        {!loading && !error && featuredPost && selectedTag === 'All' && !searchQuery && (
          <section className="mb-14">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
              <Flame className="w-4 h-4 text-pink-500 fill-pink-500" />
              <span>Featured Spotlight</span>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden grid md:grid-cols-12 gap-0 border border-indigo-500/20 shadow-2xl">
              <div className="md:col-span-7 relative min-h-[280px] md:min-h-[380px]">
                <img
                  src={getCoverImage(featuredPost)}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
              </div>
              
              <div className="md:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  {featuredPost.tags && featuredPost.tags.length > 0 && (
                    <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">
                      {featuredPost.tags[0]}
                    </span>
                  )}
                  <Link to={`/post/${featuredPost._id}`}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white hover:text-indigo-300 transition-colors leading-snug mb-3">
                      {featuredPost.title}
                    </h2>
                  </Link>
                  <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed mb-6">
                    {featuredPost.summary || featuredPost.content.slice(0, 160) + '...'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {featuredPost.author?.username ? featuredPost.author.username[0].toUpperCase() : 'A'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{featuredPost.author?.username}</p>
                      <p className="text-[11px] text-slate-500">{formatDate(featuredPost.createdAt)}</p>
                    </div>
                  </div>
                  <Link
                    to={`/post/${featuredPost._id}`}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    Read Article &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Header Title for Post List */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-200">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h2>{selectedTag !== 'All' ? `${selectedTag} Articles` : 'Latest Articles'}</h2>
          </div>
          <span className="text-xs text-slate-500">{posts.length} {posts.length === 1 ? 'story' : 'stories'}</span>
        </div>

        {/* Loading State Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass-card rounded-2xl h-80 animate-pulse p-6 flex flex-col justify-between">
                <div className="bg-slate-800/60 h-40 rounded-xl mb-4" />
                <div className="bg-slate-800/60 h-6 w-3/4 rounded mb-2" />
                <div className="bg-slate-800/60 h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card border-red-500/30 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
            <p className="text-red-400 font-medium mb-3">{error}</p>
            <button
              onClick={() => fetchPosts()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
            >
              Try Refreshing
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="glass-card rounded-3xl p-12 text-center max-w-lg mx-auto my-12">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Articles Found</h3>
            <p className="text-slate-400 text-sm mb-6">
              {searchQuery
                ? `No stories matched your search "${searchQuery}".`
                : 'Be the pioneer to publish a story in this section!'}
            </p>
            <Link
              to={user ? "/create" : "/register"}
              className="gradient-btn px-6 py-2.5 rounded-full text-xs font-semibold inline-block shadow-md"
            >
              Write First Story
            </Link>
          </div>
        )}

        {/* Post Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedTag === 'All' && !searchQuery ? regularPosts : posts).map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onLike={handleLike}
                currentUserId={user?.id || user?._id}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Home;