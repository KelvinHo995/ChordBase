import { useState } from 'react';
import { SongService } from '../services/BackendService';
import SongBody from '../components/SongBody';
// import { parseChordContent } from '../utils/chordParser';

const CreateSong = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    key: '',
    content: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await SongService.create(formData);
      // Reset or redirect...
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Đăng Hợp Âm Mới</h1>

      <div className="flex flex-col  gap-8">
        
        {/* LEFT COLUMN: The Form */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài hát</label>
              <input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Ví dụ: Cơn Mưa Băng Giá"
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Artist Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
                <input 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ví dụ: Bằng Kiều"
                />
              </div>

              {/* Key Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone chủ đạo</label>
                <input
                  name="key" 
                  value={formData.key} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  placeholder="Ví dụ: C, G, Bm,..."
                />
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
                className="w-full p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
        <div className="flex-1">
          <div className="sticky top-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Xem trước</h2>
            
            {/* The Paper Effect Container */}
            <div className="bg-amber-50 p-8 rounded-xl shadow-inner border border-amber-100 min-h-[500px]">
              
              {/* Header Preview */}
              <div className="border-b border-amber-200 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {formData.title || 'Tên bài hát...'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {formData.artist && `Trình bày: ${formData.artist}`}
                  {formData.artist && formData.key && ' • '}
                  {formData.key && `Tone: ${formData.key}`}
                </p>
              </div>

              {/* The Chords Rendered Here */}
              <div className="font-sans text-lg leading-loose">
                {formData.content 
                ? (
                  <SongBody lyrics={formData.content} songKey={formData.key} showControl={false}/>
                ) : (
                  <p className="text-gray-400 italic text-center mt-20">
                    Bắt đầu nhập bên trái để xem kết quả...
                  </p>
                )}
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateSong;