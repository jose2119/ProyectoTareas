import React, { useState } from 'react';
import { X, Hash, Plus, Trash2, Folder, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { catalogService } from '../../services/catalogService';

interface TagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TagsModal: React.FC<TagsModalProps> = ({ isOpen, onClose }) => {
  const { tags, categories, createTag, deleteTag, refreshData, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'etiquetas' | 'categorias'>('etiquetas');

  // Nueva etiqueta
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#6366f1');

  // Nueva categoría
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('#8b5cf6');

  if (!isOpen) return null;

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      await createTag(newTagName.trim(), newTagColor);
      setNewTagName('');
    } catch {
      showToast('Error al crear etiqueta');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await catalogService.createCategory(newCatName.trim(), newCatColor, 'briefcase');
      showToast(`Categoría "${newCatName}" creada`);
      setNewCatName('');
      await refreshData();
    } catch {
      showToast('Error al crear categoría');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await catalogService.deleteCategory(id);
      showToast('Categoría eliminada');
      await refreshData();
    } catch {
      showToast('Error al eliminar categoría');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Gestor de Etiquetas & Categorías</h3>
              <p className="text-[11px] text-slate-400">CRUD conectado a /api/etiquetas y /api/categorias</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 pb-0">
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/60 text-xs font-bold">
            <button
              onClick={() => setActiveTab('etiquetas')}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'etiquetas' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Etiquetas ({tags.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categorias')}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'categorias' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Categorías ({categories.length})</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'etiquetas' ? (
            <>
              {/* Form Crear Etiqueta */}
              <form onSubmit={handleCreateTag} className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
                <input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-7 h-7 rounded-lg border-none cursor-pointer bg-transparent"
                  title="Elegir color"
                />
                <input
                  type="text"
                  required
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nueva etiqueta (ej: sprint, bug)..."
                  className="flex-1 bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="py-1.5 px-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </form>

              {/* Lista de Etiquetas */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-600">Etiquetas registradas en la base de datos:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.etiqueta_id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tag.color || '#6366f1' }}></span>
                        <span className="text-xs font-bold text-slate-800">#{tag.nombre}</span>
                      </div>
                      <button
                        onClick={() => deleteTag(tag.etiqueta_id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Eliminar etiqueta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Form Crear Categoría */}
              <form onSubmit={handleCreateCategory} className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-7 h-7 rounded-lg border-none cursor-pointer bg-transparent"
                  title="Elegir color"
                />
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Nueva categoría (ej: Marketing, Legal)..."
                  className="flex-1 bg-transparent border-none text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="py-1.5 px-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </form>

              {/* Lista de Categorías */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-600">Categorías activas:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.categoria_id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color || '#6366f1' }}></span>
                        <span className="text-xs font-bold text-slate-800">{cat.nombre}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.categoria_id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
