import { useState, useCallback, useEffect } from 'react';
import { operators, operatorCategories, templates, searchEngines } from './data/dorks';
import type { DorkOperator } from './data/dorks';

interface QueryPart {
  id: string;
  operator: DorkOperator;
  value: string;
}

interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  engine: string;
}

function App() {
  const [queryParts, setQueryParts] = useState<QueryPart[]>([]);
  const [activeCategory, setActiveCategory] = useState('basic');
  const [searchEngine, setSearchEngine] = useState('google');
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [customQuery, setCustomQuery] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('dorkforge_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('dorkforge_history', JSON.stringify(history.slice(0, 50)));
  }, [history]);

  const addOperator = useCallback((operator: DorkOperator) => {
    const newPart: QueryPart = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      operator,
      value: '',
    };
    setQueryParts(prev => [...prev, newPart]);
  }, []);

  const updateValue = useCallback((id: string, value: string) => {
    setQueryParts(prev => prev.map(part =>
      part.id === id ? { ...part, value } : part
    ));
  }, []);

  const removePart = useCallback((id: string) => {
    setQueryParts(prev => prev.filter(part => part.id !== id));
  }, []);

  const movePart = useCallback((fromIdx: number, toIdx: number) => {
    setQueryParts(prev => {
      const newParts = [...prev];
      const [removed] = newParts.splice(fromIdx, 1);
      newParts.splice(toIdx, 0, removed);
      return newParts;
    });
  }, []);

  const buildQuery = useCallback(() => {
    const parts = queryParts
      .filter(part => part.value.trim() !== '')
      .map(part => {
        if (part.operator.id === 'quotes') {
          return `"${part.value}"`;
        } else if (part.operator.id === 'minus') {
          return `-${part.value}`;
        } else if (part.operator.id === 'or') {
          return ` OR ${part.value}`;
        } else if (part.operator.id.startsWith('social_')) {
          return `${part.operator.syntax} ${part.value}`;
        } else {
          return `${part.operator.syntax}${part.value}`;
        }
      });

    return parts.join(' ');
  }, [queryParts]);

  const fullQuery = customQuery || buildQuery();

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(fullQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [fullQuery]);

  const saveToHistory = useCallback((query: string) => {
    const item: HistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: Date.now(),
      engine: searchEngine,
    };
    setHistory(prev => [item, ...prev].slice(0, 50));
  }, [searchEngine]);

  const openInSearchEngine = useCallback(() => {
    const engine = searchEngines.find(e => e.id === searchEngine);
    if (engine && fullQuery) {
      saveToHistory(fullQuery);
      window.open(engine.url + encodeURIComponent(fullQuery), '_blank');
    }
  }, [fullQuery, searchEngine, saveToHistory]);

  const applyTemplate = useCallback((query: string) => {
    setCustomQuery(query);
    setQueryParts([]);
    setShowTemplates(false);
  }, []);

  const loadFromHistory = useCallback((query: string) => {
    setCustomQuery(query);
    setQueryParts([]);
    setShowHistory(false);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('dorkforge_history');
  }, []);

  const clearAll = useCallback(() => {
    setQueryParts([]);
    setCustomQuery('');
  }, []);

  const filteredOperators = operators.filter(op => op.category === activeCategory);

  const handleDragStart = (idx: number) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx !== null && draggedIdx !== idx) {
      movePart(draggedIdx, idx);
      setDraggedIdx(idx);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      {/* Background effect */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/10 via-transparent to-green-950/5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-900/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b border-green-900/30 bg-gray-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="text-3xl">🔍</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider">
                <span className="text-green-400">DORK</span>
                <span className="text-green-600">FORGE</span>
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">OSINT Search Constructor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              className={`px-3 py-1.5 rounded-md text-xs transition-all border ${
                showCheatSheet
                  ? 'bg-blue-600/20 text-blue-400 border-blue-600/50'
                  : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-blue-600/30'
              }`}
            >
              📖 Справка
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-3 py-1.5 rounded-md text-xs transition-all border ${
                showHistory
                  ? 'bg-purple-600/20 text-purple-400 border-purple-600/50'
                  : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-purple-600/30'
              }`}
            >
              🕐 История {history.length > 0 && <span className="ml-1 bg-purple-600/30 px-1.5 py-0.5 rounded-full text-[10px]">{history.length}</span>}
            </button>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className={`px-3 py-1.5 rounded-md text-xs transition-all border ${
                showTemplates
                  ? 'bg-green-600/20 text-green-400 border-green-600/50'
                  : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-green-600/30'
              }`}
            >
              📋 Шаблоны
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-md text-xs bg-red-900/30 text-red-400 border border-red-900/30 hover:bg-red-900/50 transition-all"
            >
              🗑️
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        {/* History Panel */}
        {showHistory && (
          <div className="mb-6 p-4 bg-gray-900/80 border border-purple-900/30 rounded-lg animate-fade-in backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-purple-400 font-bold flex items-center gap-2">
                <span>🕐</span> История запросов
              </h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-xs text-red-400/70 hover:text-red-400 transition-colors">
                  Очистить всё
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-4">История пуста. Выполненные запросы будут сохранены здесь.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {history.map(item => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item.query)}
                    className="w-full text-left p-2.5 bg-gray-800/50 border border-gray-700/30 rounded hover:border-purple-600/30 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-xs text-green-400/80 truncate flex-1 mr-3">{item.query}</code>
                      <span className="text-[10px] text-gray-600 whitespace-nowrap">{formatTime(item.timestamp)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cheat Sheet Panel */}
        {showCheatSheet && (
          <div className="mb-6 p-4 bg-gray-900/80 border border-blue-900/30 rounded-lg animate-fade-in backdrop-blur-sm">
            <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
              <span>📖</span> Шпаргалка по Google Dorks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-800/30 rounded border border-gray-700/20">
                <h4 className="text-xs font-bold text-green-400 mb-2">🔍 Базовые операторы</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li><code className="text-green-500">"точная фраза"</code> — точное совпадение</li>
                  <li><code className="text-green-500">OR</code> — логическое ИЛИ</li>
                  <li><code className="text-green-500">-слово</code> — исключить слово</li>
                  <li><code className="text-green-500">*</code> — wildcard (любой текст)</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-800/30 rounded border border-gray-700/20">
                <h4 className="text-xs font-bold text-green-400 mb-2">🌐 Поиск по сайтам</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li><code className="text-green-500">site:example.com</code> — только этот сайт</li>
                  <li><code className="text-green-500">-site:example.com</code> — исключить сайт</li>
                  <li><code className="text-green-500">related:example.com</code> — похожие сайты</li>
                  <li><code className="text-green-500">inurl:admin</code> — слово в URL</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-800/30 rounded border border-gray-700/20">
                <h4 className="text-xs font-bold text-green-400 mb-2">📄 Поиск файлов</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li><code className="text-green-500">filetype:pdf</code> — PDF файлы</li>
                  <li><code className="text-green-500">ext:xlsx</code> — Excel файлы</li>
                  <li><code className="text-green-500">filetype:sql</code> — SQL дампы</li>
                  <li><code className="text-green-500">filetype:log</code> — файлы логов</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-800/30 rounded border border-gray-700/20">
                <h4 className="text-xs font-bold text-green-400 mb-2">📅 Даты и числа</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li><code className="text-green-500">after:2024-01-01</code> — после даты</li>
                  <li><code className="text-green-500">before:2024-12-31</code> — до даты</li>
                  <li><code className="text-green-500">numrange:1-100</code> — диапазон чисел</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-800/30 rounded border border-gray-700/20">
                <h4 className="text-xs font-bold text-green-400 mb-2">⚠️ Уязвимости</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li><code className="text-green-500">intitle:"index of /"</code> — открытые папки</li>
                  <li><code className="text-green-500">inurl:.git</code> — открытые репо</li>
                  <li><code className="text-green-500">ext:env</code> — env файлы</li>
                  <li><code className="text-green-500">intext:"sql syntax"</code> — SQL ошибки</li>
                </ul>
              </div>
              <div className="p-3 bg-gray-800/30 rounded border border-gray-700/20">
                <h4 className="text-xs font-bold text-green-400 mb-2">💡 Советы</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                  <li>Комбинируйте операторы для точности</li>
                  <li>Используйте кавычки для точных фраз</li>
                  <li>Исключайте шум через -оператор</li>
                  <li>Пробуйте разные поисковики</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Templates Panel */}
        {showTemplates && (
          <div className="mb-6 p-4 bg-gray-900/80 border border-green-900/30 rounded-lg animate-fade-in backdrop-blur-sm">
            <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
              <span>📋</span> Готовые шаблоны запросов
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template.query)}
                  className="text-left p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:border-green-600/50 hover:bg-gray-800 transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{template.icon}</span>
                    <span className="text-sm font-bold text-gray-200 group-hover:text-green-400 transition-colors">
                      {template.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{template.description}</p>
                  <code className="text-[11px] text-green-600/80 break-all line-clamp-2">
                    {template.query}
                  </code>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Operators */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/60 border border-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
              <h3 className="text-green-400 font-bold mb-3 text-sm flex items-center gap-2">
                <span>⚡</span> Операторы
              </h3>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1 mb-3">
                {operatorCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2 py-1 rounded-md text-[11px] transition-all ${
                      activeCategory === cat.id
                        ? 'bg-green-600/20 text-green-400 border border-green-600/50 shadow-sm shadow-green-900/20'
                        : 'bg-gray-800/50 text-gray-500 border border-gray-700/30 hover:text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              {/* Operators List */}
              <div className="space-y-1.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 custom-scrollbar">
                {filteredOperators.map(operator => (
                  <button
                    key={operator.id}
                    onClick={() => addOperator(operator)}
                    className="w-full text-left p-2.5 bg-gray-800/30 border border-gray-700/30 rounded-md hover:border-green-600/40 hover:bg-green-900/10 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <code className="text-green-500 text-xs font-bold">{operator.name}</code>
                      <span className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold">+</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{operator.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Builder & Preview */}
          <div className="lg:col-span-9 space-y-4">
            {/* Query Builder */}
            <div className="bg-gray-900/60 border border-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-green-400 font-bold text-sm flex items-center gap-2">
                  <span>🔧</span> Конструктор запроса
                </h3>
                {queryParts.length > 0 && (
                  <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                    {queryParts.length} блок{queryParts.length === 1 ? '' : queryParts.length < 5 ? 'а' : 'ов'}
                  </span>
                )}
              </div>

              {queryParts.length === 0 && !customQuery && (
                <div className="text-center py-10 text-gray-600">
                  <div className="text-5xl mb-4 opacity-50">🛠️</div>
                  <p className="text-sm text-gray-400">Выберите операторы слева для построения запроса</p>
                  <p className="text-xs mt-2 text-gray-600">Или используйте готовые шаблоны из кнопки «📋 Шаблоны»</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="text-xs px-3 py-1.5 bg-green-900/20 text-green-500 border border-green-800/30 rounded-md hover:bg-green-900/30 transition-all"
                    >
                      📋 Открыть шаблоны
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {queryParts.map((part, idx) => (
                  <div
                    key={part.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-2 group rounded-md p-1.5 transition-all ${
                      draggedIdx === idx ? 'bg-green-900/20 border border-green-700/30' : 'hover:bg-gray-800/30'
                    }`}
                  >
                    <div className="cursor-grab text-gray-600 hover:text-gray-400 transition-colors px-1" title="Перетащите для изменения порядка">
                      ⠿
                    </div>
                    <code className="text-green-500 text-xs whitespace-nowrap min-w-[90px] font-bold">
                      {part.operator.name}
                    </code>
                    <input
                      type="text"
                      value={part.value}
                      onChange={(e) => updateValue(part.id, e.target.value)}
                      placeholder={part.operator.placeholder}
                      className="flex-1 bg-gray-800/80 border border-gray-700/50 rounded px-3 py-1.5 text-sm text-gray-200 placeholder-gray-600 focus:border-green-600/50 focus:outline-none focus:ring-1 focus:ring-green-600/20 transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const nextInput = e.currentTarget.parentElement?.nextElementSibling?.querySelector('input');
                          if (nextInput) (nextInput as HTMLInputElement).focus();
                        }
                      }}
                    />
                    <button
                      onClick={() => removePart(part.id)}
                      className="text-red-500/40 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg px-1"
                      title="Удалить"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Custom query input */}
              {customQuery && (
                <div className="mt-3 pt-3 border-t border-gray-800/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-wider">Ручной режим (из шаблона)</label>
                    <button
                      onClick={() => setCustomQuery('')}
                      className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Переключить на конструктор
                    </button>
                  </div>
                  <textarea
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-md px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-green-600/50 focus:outline-none focus:ring-1 focus:ring-green-600/20 transition-colors resize-none"
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Query Preview */}
            <div className="bg-gray-900/60 border border-green-900/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-green-400 font-bold mb-3 text-sm flex items-center gap-2">
                <span>📝</span> Готовый запрос
              </h3>

              <div className="bg-gray-950 border border-gray-800/50 rounded-md p-3 mb-4 min-h-[56px] relative group">
                {fullQuery ? (
                  <>
                    <code className="text-green-300 text-sm break-all whitespace-pre-wrap leading-relaxed">{fullQuery}</code>
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-gray-800 px-2 py-1 rounded text-gray-400 hover:text-green-400"
                    >
                      📋
                    </button>
                  </>
                ) : (
                  <span className="text-gray-600 text-sm italic">Запрос появится здесь после заполнения полей...</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={copyToClipboard}
                  disabled={!fullQuery}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all border ${
                    copied
                      ? 'bg-green-600/20 text-green-400 border-green-600/50 shadow-sm shadow-green-900/20'
                      : 'bg-gray-800/50 text-green-400 border-green-800/30 hover:bg-green-900/20 disabled:opacity-30 disabled:cursor-not-allowed'
                  }`}
                >
                  {copied ? '✓ Скопировано!' : '📋 Копировать'}
                </button>

                <div className="flex items-center gap-2 bg-gray-800/30 rounded-md px-3 py-1.5 border border-gray-700/30">
                  <span className="text-[11px] text-gray-500">Поиск:</span>
                  <select
                    value={searchEngine}
                    onChange={(e) => setSearchEngine(e.target.value)}
                    className="bg-transparent text-sm text-gray-300 focus:outline-none cursor-pointer"
                  >
                    {searchEngines.map(engine => (
                      <option key={engine.id} value={engine.id} className="bg-gray-900">{engine.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={openInSearchEngine}
                  disabled={!fullQuery}
                  className="px-4 py-2 rounded-md text-sm font-bold bg-green-900/30 text-green-400 border border-green-800/30 hover:bg-green-900/50 hover:shadow-sm hover:shadow-green-900/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  🚀 Искать
                </button>

                {fullQuery && (
                  <button
                    onClick={() => saveToHistory(fullQuery)}
                    className="px-3 py-2 rounded-md text-xs text-gray-500 hover:text-purple-400 transition-colors"
                    title="Сохранить в историю"
                  >
                    💾
                  </button>
                )}
              </div>
            </div>

            {/* Quick Reference - always visible on desktop */}
            <div className="bg-gray-900/60 border border-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-green-400 font-bold mb-3 text-sm flex items-center gap-2">
                <span>💡</span> Быстрая справка
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 bg-gray-800/20 rounded-md border border-gray-700/20">
                  <code className="text-green-500 whitespace-nowrap font-bold">site:</code>
                  <span className="text-gray-500">Только этот домен</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-800/20 rounded-md border border-gray-700/20">
                  <code className="text-green-500 whitespace-nowrap font-bold">filetype:</code>
                  <span className="text-gray-500">Тип файла</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-800/20 rounded-md border border-gray-700/20">
                  <code className="text-green-500 whitespace-nowrap font-bold">intitle:</code>
                  <span className="text-gray-500">В заголовке</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-800/20 rounded-md border border-gray-700/20">
                  <code className="text-green-500 whitespace-nowrap font-bold">inurl:</code>
                  <span className="text-gray-500">В URL</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-800/20 rounded-md border border-gray-700/20">
                  <code className="text-green-500 whitespace-nowrap font-bold">intext:</code>
                  <span className="text-gray-500">В тексте</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-800/20 rounded-md border border-gray-700/20">
                  <code className="text-green-500 whitespace-nowrap font-bold">"фраза"</code>
                  <span className="text-gray-500">Точное совпадение</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-800/20 rounded-md border border-gray-700/20">
                  <code className="text-green-500 whitespace-nowrap font-bold">OR</code>
                  <span className="text-gray-500">Или</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-800/20 rounded-md border border-gray-700/20">
                  <code className="text-green-500 whitespace-nowrap font-bold">-слово</code>
                  <span className="text-gray-500">Исключить</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-12 py-6 text-center relative z-10">
        <p className="text-xs text-gray-600">
          <span className="text-green-600">DORKFORGE</span> — Визуальный конструктор Google Dorks для OSINT
        </p>
        <p className="mt-1 text-[10px] text-gray-700">
          ⚠️ Используйте только для поиска публично доступной информации в законных целях
        </p>
      </footer>
    </div>
  );
}

export default App;
