import { useState, useEffect } from 'react';

const DEFAULT_TABS = {
  'Infrastructure': [
    { name: 'Unraid', url: 'http://10.0.101.3', icon: '🖥️' },
    { name: 'Portainer', url: 'http://10.0.101.50:9000', icon: '🐳' },
    { name: 'Home Assistant', url: 'http://10.0.102.10:8123', icon: '🏠' },
    { name: 'AdGuard', url: 'http://10.0.101.51:3000', icon: '🛡️' },
    { name: 'NPM', url: 'http://10.0.101.70:81', icon: '🔀' },
  ],
  'Dashboards': [
    { name: 'Command Center', url: 'http://10.0.101.55', icon: '🎛️' },
    { name: 'Dashboard Manager', url: 'http://10.0.101.63:3000', icon: '📊' },
    { name: 'Music UI', url: 'http://10.0.101.66', icon: '🎵' },
  ],
  'External': [
    { name: 'GitHub', url: 'https://github.com', icon: '💻' },
  ]
};

function QuickLaunch() {
  const [tabs, setTabs] = useState(() => {
    const saved = localStorage.getItem('quicklaunch-tabs');
    return saved ? JSON.parse(saved) : DEFAULT_TABS;
  });
  const [activeTab, setActiveTab] = useState(Object.keys(tabs)[0] || 'Infrastructure');
  const [isManaging, setIsManaging] = useState(false);
  const [editingTab, setEditingTab] = useState(null);
  const [newTabName, setNewTabName] = useState('');
  const [newSite, setNewSite] = useState({ name: '', url: '', icon: '🔗' });
  const [movingSite, setMovingSite] = useState(null);
  const [editingSite, setEditingSite] = useState(null);

  useEffect(() => {
    localStorage.setItem('quicklaunch-tabs', JSON.stringify(tabs));
  }, [tabs]);

  const addTab = () => {
    if (!newTabName.trim()) return;
    setTabs({ ...tabs, [newTabName]: [] });
    setActiveTab(newTabName);
    setNewTabName('');
  };

  const deleteTab = (tabName) => {
    if (!confirm(`Delete tab "${tabName}"?`)) return;
    const newTabs = { ...tabs };
    delete newTabs[tabName];
    setTabs(newTabs);
    setActiveTab(Object.keys(newTabs)[0] || '');
  };

  const renameTab = (oldName, newName) => {
    if (!newName.trim() || oldName === newName) {
      setEditingTab(null);
      return;
    }
    const newTabs = {};
    Object.keys(tabs).forEach(key => {
      if (key === oldName) {
        newTabs[newName] = tabs[key];
      } else {
        newTabs[key] = tabs[key];
      }
    });
    setTabs(newTabs);
    setActiveTab(newName);
    setEditingTab(null);
  };

  const addSite = () => {
    if (!newSite.name.trim() || !newSite.url.trim()) return;
    setTabs({
      ...tabs,
      [activeTab]: [...(tabs[activeTab] || []), { ...newSite }]
    });
    setNewSite({ name: '', url: '', icon: '🔗' });
  };

  const startEditSite = (tabName, index) => {
    const site = tabs[tabName][index];
    setNewSite({ ...site });
    setEditingSite({ tabName, index });
  };

  const saveEditSite = () => {
    if (!editingSite) return;
    const updatedTabs = {
      ...tabs,
      [editingSite.tabName]: tabs[editingSite.tabName].map((site, idx) =>
        idx === editingSite.index ? newSite : site
      ),
    };
    setTabs(updatedTabs);
    setNewSite({ name: '', url: '', icon: '🔗' });
    setEditingSite(null);
  };

  const cancelEdit = () => {
    setNewSite({ name: '', url: '', icon: '🔗' });
    setEditingSite(null);
  };

  const moveSite = (fromTab, index, toTab) => {
    console.log('MOVE FUNCTION CALLED:', { fromTab, index, toTab });
    if (fromTab === toTab) return;
    const site = tabs[fromTab][index];
    const updatedTabs = {
      ...tabs,
      [fromTab]: tabs[fromTab].filter((_, idx) => idx !== index),
      [toTab]: [...tabs[toTab], site],
    };
    setTabs(updatedTabs);
    setMovingSite(null);
  };

  const deleteSite = (tabName, index) => {
    if (!confirm(`Delete "${tabs[tabName][index].name}"?`)) return;
    setTabs({
      ...tabs,
      [tabName]: tabs[tabName].filter((_, i) => i !== index)
    });
  };

  const resetToDefaults = () => {
    if (!confirm('Reset all tabs to defaults? This will delete your custom tabs and sites!')) return;
    setTabs(DEFAULT_TABS);
    setActiveTab('Infrastructure');
  };

  return (
    <div className="bg-bison-card rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-bison-green">
        <h2 className="text-2xl text-bison-yellow">Playbook</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsManaging(!isManaging)}
            className={`px-4 py-2 rounded-lg transition-all ${
              isManaging 
                ? 'bg-bison-yellow text-bison-dark font-bold' 
                : 'bg-bison-dark border-2 border-bison-yellow text-bison-yellow hover:bg-bison-yellow hover:text-bison-dark'
            }`}
          >
            {isManaging ? '✅ Done' : '⚙️ Manage'}
          </button>
          {isManaging && (
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
            >
              🔄 Reset
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.keys(tabs).map((tabName) => (
          <div key={tabName} className="relative group">
            {editingTab === tabName ? (
              <input
                type="text"
                defaultValue={tabName}
                autoFocus
                onBlur={(e) => renameTab(tabName, e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && renameTab(tabName, e.target.value)}
                className="px-4 py-2 rounded-lg bg-bison-dark border-2 border-bison-yellow text-white"
              />
            ) : (
              <button
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === tabName
                    ? 'bg-bison-yellow text-bison-dark font-bold'
                    : 'bg-bison-dark border-2 border-gray-600 hover:border-bison-yellow'
                }`}
              >
                {tabName} ({tabs[tabName]?.length || 0})
              </button>
            )}
            {isManaging && (
              <div className="absolute -top-2 -right-2 flex gap-1 opacity-100 transition-opacity">
                <button
                  onClick={() => setEditingTab(tabName)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-6 h-6 text-xs"
                  title="Rename"
                >
                  ✏️
                </button>
                <button
                  onClick={() => deleteTab(tabName)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 text-xs"
                  title="Delete"
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        ))}
        
        {isManaging && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New tab name..."
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTab()}
              className="px-4 py-2 rounded-lg bg-bison-dark border-2 border-bison-green text-white placeholder-gray-500"
            />
            <button
              onClick={addTab}
              className="px-4 py-2 rounded-lg bg-bison-green text-bison-dark font-bold hover:bg-green-400 transition-all"
            >
              ➕ Add Tab
            </button>
          </div>
        )}
      </div>

      {/* Site Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {tabs[activeTab]?.map((app, index) => (
          <div key={index} className="relative group">
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-bison-dark hover:bg-bison-green/20 rounded-lg p-4 text-center transition-all border-2 border-transparent hover:border-bison-yellow hover:scale-105"
            >
              <div className="text-3xl mb-2">{app.icon}</div>
              <div className="text-sm font-medium">{app.name}</div>
            </a>
            {isManaging && (
              <div className="absolute -top-2 -right-2 flex gap-1 opacity-100 transition-opacity">
                <button
                  onClick={() => startEditSite(activeTab, index)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  title="Edit site"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setMovingSite({ tab: activeTab, idx: index })}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  title="Move to another tab"
                >
                  🔀
                </button>
                <button
                  onClick={() => deleteSite(activeTab, index)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                  title="Delete site"
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Site Form */}
      {isManaging && (
        <div className="bg-bison-dark rounded-lg p-4 border-2 border-bison-green">
          <h3 className="text-lg text-bison-yellow mb-3">
            {editingSite ? `Edit Site in "${activeTab}"` : `Add Site to "${activeTab}"`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Site name..."
              value={newSite.name}
              onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
              className="px-4 py-2 rounded-lg bg-bison-card border-2 border-gray-600 text-white placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="URL (http://...)..."
              value={newSite.url}
              onChange={(e) => setNewSite({ ...newSite, url: e.target.value })}
              className="px-4 py-2 rounded-lg bg-bison-card border-2 border-gray-600 text-white placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Icon (emoji)..."
              value={newSite.icon}
              onChange={(e) => setNewSite({ ...newSite, icon: e.target.value })}
              className="px-4 py-2 rounded-lg bg-bison-card border-2 border-gray-600 text-white placeholder-gray-500"
              title="Press Windows + . for emoji picker"
              maxLength="10"
            />
            {editingSite ? (
              <div className="flex gap-2">
                <button
                  onClick={saveEditSite}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
                >
                  💾 Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-600 text-white font-bold hover:bg-gray-700 transition-all"
                >
                  ❌ Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={addSite}
                className="px-4 py-2 rounded-lg bg-bison-yellow text-bison-dark font-bold hover:bg-yellow-400 transition-all"
              >
                ➕ Add Site
              </button>
            )}
          </div>
        </div>
      )}

      {/* Move Modal */}
      {movingSite && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center" 
          onClick={() => setMovingSite(null)}
        >
          <div 
            className="bg-bison-dark border-4 border-bison-yellow rounded-xl p-6 shadow-2xl max-w-md" 
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl text-bison-yellow mb-4 font-bold">
              Move "{tabs[movingSite.tab]?.[movingSite.idx]?.name}" to:
            </h3>
            <div className="flex flex-col gap-2">
              {Object.keys(tabs).filter(t => t !== movingSite.tab).map(tab => (
                <button
                  key={tab}
                  onClick={() => moveSite(movingSite.tab, movingSite.idx, tab)}
                  className="px-6 py-3 bg-bison-green text-white rounded-lg hover:bg-bison-yellow hover:text-bison-dark font-bold transition-all text-lg"
                >
                  📍 {tab}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMovingSite(null)}
              className="mt-4 w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickLaunch;
