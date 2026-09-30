import { Sparkles, Heart, Globe, Share2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white font-display">Nexus<span className="gradient-text">Blog</span></span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              A modern, welcoming publishing platform for creative thinkers, tech enthusiasts, and storytellers. Share your thoughts with the world.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-indigo-400 transition">Explore Stories</Link></li>
              <li><Link to="/create" className="text-slate-400 hover:text-indigo-400 transition">Write Article</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-indigo-400 transition">Join Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex gap-3 text-slate-400">
              <a href="https://github.com/dandares10" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition" title="GitHub">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition" title="Twitter">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition" title="Share">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NexusBlog. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 inline" /> using MERN Stack & TailwindCSS
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
