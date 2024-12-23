import React from 'react';
import { StoryPage } from '../../types/story';
import { Pencil, Save, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useStoryStore } from '../../stores/useStoryStore';
import { mockApi } from '../../api/mockApi'; // Import mockApi

interface EditModeProps {
  page: StoryPage;
  onUpdatePage: (pageId: string, customPrompt: string) => void;
}

export const EditMode: React.FC<EditModeProps> = ({ page, onUpdatePage }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [customPrompt, setCustomPrompt] = React.useState(page.text || '');
  const { currentStory, nextPage, previousPage, updatePanelImage } = useStoryStore(); // Add updatePanelImage

  const canGoNext = currentStory && currentStory.currentPage < currentStory.pages.length - 1;
  const canGoPrevious = currentStory && currentStory.currentPage > 0;

  const handleSave = () => {
    onUpdatePage(page.id, customPrompt);
    setIsEditing(false);
  };

  const handleRegenerate = async (panelId: string) => {
    const newImageUrl = await mockApi.regenerateImage(panelId);
    updatePanelImage(page.id, panelId, newImageUrl); // Update the panel image
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => previousPage()}
          disabled={!canGoPrevious}
          className="p-2 text-gray-600 hover:text-purple-600 disabled:text-gray-300 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-gray-600">
          Page {(currentStory?.currentPage || 0) + 1} of {currentStory?.pages.length}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canGoNext}
          className="p-2 text-gray-600 hover:text-purple-600 disabled:text-gray-300 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {page.panels.map((panel) => (
          <div 
            key={panel.id} 
            className="relative group"
            onMouseEnter={() => setHoveredPanel(panel.id)}
            onMouseLeave={() => setHoveredPanel(null)}
          >
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg relative">
              <img
                src={panel.imageUrl}
                alt={`Story panel ${panel.order + 1}`}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-200 flex items-center justify-center">
                <button
                  onClick={() => handleRegenerate(panel.id)}
                  className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 
                           rounded-lg bg-white/10 hover:bg-white/20 
                           transition-colors text-white text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>

                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm 
                              p-3 rounded-lg shadow-lg">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Image Prompt:</h4>
                  <p className="text-sm text-gray-700">{panel.imagePrompt}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Story Text:</h3>
          <p className="text-gray-700">{page.text}</p>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Enter custom prompt to regenerate this page..."
              rows={3}
            />
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <Pencil className="w-4 h-4" />
            Customize this page
          </button>
        )}
      </div>
    </div>
  );
};