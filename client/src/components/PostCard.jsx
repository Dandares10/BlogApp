import { Link } from 'react-router-dom';
import { Heart, Clock, User, Tag } from 'lucide-react';
import { calculateReadingTime, formatDate, getCoverImage } from '../utils/helpers';

function PostCard({ post, onLike, currentUserId }) {
  const isLiked = currentUserId && post.likes?.some(like => (like._id || like) === currentUserId);
  const likesCount = post.likes?.length || 0;
  const coverUrl = getCoverImage(post);

  return (
    <article className="group glass-card rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col h-full">
      {/* Cover Image Container */}
      <Link to={`/post/${post._id}`} className="relative h-48 sm:h-52 w-full overflow-hidden block">
        <img
          src={coverUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        
        {/* Tags Badges */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {post.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full bg-slate-950/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-md shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Author & Date info */}
          <div className="flex items-center gap-2.5 mb-3 text-xs text-slate-400">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
              {post.author?.username ? post.author.username[0].toUpperCase() : <User className="w-3 h-3" />}
            </div>
            <span className="font-medium text-slate-300">{post.author?.username || 'Anonymous'}</span>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>

          {/* Title */}
          <Link to={`/post/${post._id}`}>
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug mb-2">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
            {post.summary || post.content.slice(0, 130) + '...'}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{calculateReadingTime(post.content)}</span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              if (onLike) onLike(post._id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition ${
              isLiked
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/40'
                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
            <span>{likesCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
