import React, { useState } from 'react';
import { StoryPage } from '../types/story';
import { Pencil, Save } from 'lucide-react';

interface PageEditorProps {
  page: StoryPage;
  onUpdate: (pageId: string, customPrompt: string) => void;
}

export const PageEditor: React.FC<PageEditorProps> = ({ page, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(page.customPrompt || '');

  const handleSave = () => {
    onUpdate(page.id, customPrompt);
    setIsEditing(false);
  };

  return (
    <div className="mt-4 bg-white/90 p-4 rounded-lg shadow-md">
      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your custom prompt for this page..."
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
  );
};