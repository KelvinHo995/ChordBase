import { useState, useEffect, useRef } from 'react';
import { SongService, GenreService } from '../services/BackendService';
import SongBody from '../components/SongBody';
import { useAuth } from '@/context/AuthContext';
import { Search, X } from 'lucide-react';
// import { parseChordContent } from '../utils/chordParser';

const CreateSong = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    key: '',
    genre_id: '',
    difficulty: 'Beginner',
    content: ''
  });
  const [genres, setGenres] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await GenreService.getAll();
        setGenres(response.data?.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setGenres([]);
      }
    };
    fetchGenres();
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search songs with debounce
  const searchSongs = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await SongService.getAll({ q: query, type: 'song', limit: 10 });
      setSearchResults(response.data.songs || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, title: value });
    setSelectedSong(null);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchSongs(value);
    }, 300);
  };

  const handleSelectSong = (song) => {
    setSelectedSong(song);
    const artistNames = song.artists?.map(a => a.name).join(', ') || '';
    const originalKey = song.chord_versions?.[0]?.original_key || song.original_key || '';
    
    setFormData({
      ...formData,
      title: song.title,
      author: artistNames,
      key: originalKey,
      genre_id: song.genre_id || '',
      difficulty: song.difficulty || 'Beginner'
    });
    setShowSuggestions(false);
  };

  const handleClearSelection = () => {
    setSelectedSong(null);
    setFormData({
      title: '',
      author: '',
      key: '',
      genre_id: '',
      difficulty: 'Beginner',
      content: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uploader_id = user?.user_id;
      
      const param = {
        song_id: selectedSong?.song_id || null,
        songname: formData.title, // Map title to songname for backend
        author: formData.author,
        genre_id: formData.genre_id || null,
        key: formData.key,
        difficulty: formData.difficulty,
        content: formData.content,
        uploader_id
      };
      
      await SongService.create(param);
      
      // Show success message
      alert(selectedSong 
        ? 'Đã thêm version mới cho bài hát!' 
        : 'Đã tạo bài hát mới thành công!');
      
      // Reset form
      setFormData({ title: '', author: '', key: '', genre_id: '', difficulty: 'Beginner', content: '' });
      setSelectedSong(null);
      setSearchResults([]);
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Đăng Hợp Âm Mới</h1>
        <p className="text-gray-600">Chia sẻ hợp âm của bạn với cộng đồng</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start max-w-[1600px] mx-auto">
        
        {/* LEFT COLUMN: The Form */}
        <div className="w-full lg:w-[700px] lg:min-w-[700px] bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit shrink-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title Input with Autocomplete */}
            <div className="relative" ref={suggestionsRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên bài hát
                {selectedSong && (
                  <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    ✓ Đã chọn bài hát từ danh sách
                  </span>
                )}
              </label>
              <div className="relative">
                <input 
                  name="title" 
                  value={formData.title} 
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Nhập tên bài hát để tìm kiếm..."
                  required 
                  autoComplete="off"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
                {selectedSong && (
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  <div className="p-2 text-xs text-gray-500 border-b">
                    <Search className="inline h-3 w-3 mr-1" />
                    Chọn bài hát có sẵn để thêm version mới hoặc tiếp tục nhập để tạo mới
                  </div>
                  {searchResults.map((song) => {
                    const artistNames = song.artists?.map(a => a.name).join(', ') || 'Không rõ tác giả';
                    const versionCount = song.chord_versions?.length || 0;
                    const originalKey = song.chord_versions?.[0]?.original_key || song.original_key;
                    
                    return (
                      <button
                        key={song.song_id}
                        type="button"
                        onClick={() => handleSelectSong(song)}
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 transition"
                      >
                        <div className="font-medium text-gray-900">{song.title}</div>
                        <div className="text-sm text-gray-600 mt-0.5">
                          {artistNames}
                          {originalKey && (
                            <span className="ml-2 text-indigo-600">• Tone: {originalKey}</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {versionCount} version
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Artist Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tác giả
                  {selectedSong && <span className="text-xs text-gray-500 ml-1">(không chỉnh sửa)</span>}
                </label>
                <input 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  disabled={selectedSong !== null}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Ví dụ: Bằng Kiều"
                />
              </div>

              {/* Key Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone chủ đạo
                  {selectedSong && <span className="text-xs text-gray-500 ml-1">(không chỉnh sửa)</span>}
                </label>
                <input
                  name="key" 
                  value={formData.key} 
                  onChange={handleChange}
                  disabled={selectedSong !== null}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Ví dụ: C, G, Bm,..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Genre Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thể loại
                  {selectedSong && <span className="text-xs text-gray-500 ml-1">(không chỉnh sửa)</span>}
                </label>
                <select
                  name="genre_id"
                  value={formData.genre_id}
                  onChange={handleChange}
                  disabled={selectedSong !== null}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn thể loại</option>
                  {genres.map(genre => (
                    <option key={genre.genre_id} value={genre.genre_id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ khó
                  {selectedSong && <span className="text-xs text-gray-500 ml-1">(không chỉnh sửa)</span>}
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  disabled={selectedSong !== null}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="Beginner">Dễ (Beginner)</option>
                  <option value="Intermediate">Trung bình (Intermediate)</option>
                  <option value="Advanced">Khó (Advanced)</option>
                </select>
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Dùng [Em] để viết hợp âm
                </span>
              </div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={15}
                className="w-full p-4 font-mono text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none whitespace-pre-wrap"
                placeholder={`Nhập lời và hợp âm...\n\nVí dụ:\n[Em]Mùa xuân sang có [C]hoa anh đào\nMàu [D]hoa tôi trót [G]yêu...`}
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đăng Hợp Âm'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: The Preview */}
        <div className="w-full lg:w-[700px] lg:min-w-[700px] shrink-0">
          <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-800">Xem trước</h2>
            </div>
            
            {/* The Paper Effect Container */}
            <div className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 p-8 rounded-2xl shadow-xl border border-gray-200 min-h-[500px] overflow-hidden">
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-30"></div>
              
              <div className="relative z-10">
                {/* Header Preview */}
                <div className="border-b-2 border-gray-200 pb-5 mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        {formData.title || 'Tên bài hát...'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-gray-600">
                        {(formData.author || selectedSong) && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{formData.author || selectedSong?.artists?.map(a => a.name).join(', ') || 'Không rõ tác giả'}</span>
                          </div>
                        )}
                        {formData.key && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            <span className="font-semibold text-indigo-600">Tone: {formData.key}</span>
                          </div>
                        )}
                        {selectedSong && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Version mới
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Chords Rendered Here */}
                <div className="font-sans text-base leading-relaxed">
                  {formData.content ? (
                    <SongBody lyrics={formData.content} songKey={formData.key} showControl={false}/>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-400 text-lg font-medium mb-1">
                        Chưa có nội dung
                      </p>
                      <p className="text-gray-400 text-sm">
                        Bắt đầu nhập hợp âm bên trái để xem kết quả
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateSong;