export interface DorkOperator {
  id: string;
  name: string;
  syntax: string;
  description: string;
  placeholder: string;
  category: string;
}

export interface DorkTemplate {
  id: string;
  name: string;
  description: string;
  query: string;
  category: string;
  icon: string;
}

export const operatorCategories = [
  { id: 'basic', name: 'Базовые', icon: '🔍' },
  { id: 'site', name: 'Сайты и домены', icon: '🌐' },
  { id: 'file', name: 'Файлы', icon: '📄' },
  { id: 'url', name: 'URL и ссылки', icon: '🔗' },
  { id: 'social', name: 'Соцсети', icon: '👤' },
  { id: 'vuln', name: 'Уязвимости', icon: '⚠️' },
  { id: 'advanced', name: 'Продвинутые', icon: '🧠' },
];

export const operators: DorkOperator[] = [
  // Basic
  { id: 'intext', name: 'intext:', syntax: 'intext:', description: 'Поиск текста в содержимом страницы', placeholder: 'ключевое слово', category: 'basic' },
  { id: 'inurl', name: 'inurl:', syntax: 'inurl:', description: 'Поиск слова в URL', placeholder: 'слово в URL', category: 'basic' },
  { id: 'intitle', name: 'intitle:', syntax: 'intitle:', description: 'Поиск слова в заголовке страницы', placeholder: 'слово в заголовке', category: 'basic' },
  { id: 'allintext', name: 'allintext:', syntax: 'allintext:', description: 'Все слова в тексте страницы', placeholder: 'слово1 слово2', category: 'basic' },
  { id: 'allintitle', name: 'allintitle:', syntax: 'allintitle:', description: 'Все слова в заголовке', placeholder: 'слово1 слово2', category: 'basic' },
  { id: 'allinurl', name: 'allinurl:', syntax: 'allinurl:', description: 'Все слова в URL', placeholder: 'слово1 слово2', category: 'basic' },

  // Site
  { id: 'site', name: 'site:', syntax: 'site:', description: 'Поиск на конкретном сайте', placeholder: 'example.com', category: 'site' },
  { id: 'related', name: 'related:', syntax: 'related:', description: 'Похожие сайты', placeholder: 'example.com', category: 'site' },
  { id: 'cache', name: 'cache:', syntax: 'cache:', description: 'Кэшированная версия страницы', placeholder: 'example.com', category: 'site' },

  // File
  { id: 'filetype', name: 'filetype:', syntax: 'filetype:', description: 'Поиск по типу файла', placeholder: 'pdf', category: 'file' },
  { id: 'ext', name: 'ext:', syntax: 'ext:', description: 'Расширение файла', placeholder: 'xlsx', category: 'file' },

  // URL
  { id: 'link', name: 'link:', syntax: 'link:', description: 'Страницы ссылающиеся на URL', placeholder: 'example.com', category: 'url' },

  // Social
  { id: 'social_twitter', name: 'twitter.com', syntax: 'site:twitter.com', description: 'Поиск в Twitter/X', placeholder: 'username или запрос', category: 'social' },
  { id: 'social_linkedin', name: 'linkedin.com', syntax: 'site:linkedin.com', description: 'Поиск в LinkedIn', placeholder: 'имя или компания', category: 'social' },
  { id: 'social_github', name: 'github.com', syntax: 'site:github.com', description: 'Поиск на GitHub', placeholder: 'username или репо', category: 'social' },
  { id: 'social_reddit', name: 'reddit.com', syntax: 'site:reddit.com', description: 'Поиск в Reddit', placeholder: 'тема или пользователь', category: 'social' },
  { id: 'social_facebook', name: 'facebook.com', syntax: 'site:facebook.com', description: 'Поиск в Facebook', placeholder: 'имя или страница', category: 'social' },
  { id: 'social_instagram', name: 'instagram.com', syntax: 'site:instagram.com', description: 'Поиск в Instagram', placeholder: 'username', category: 'social' },
  { id: 'social_vk', name: 'vk.com', syntax: 'site:vk.com', description: 'Поиск в ВКонтакте', placeholder: 'имя или группа', category: 'social' },
  { id: 'social_telegram', name: 't.me', syntax: 'site:t.me', description: 'Поиск в Telegram', placeholder: 'канал или пользователь', category: 'social' },

  // Vulnerabilities
  { id: 'vuln_login', name: 'Login pages', syntax: 'inurl:login OR inurl:admin OR inurl:signin', description: 'Поиск страниц входа', placeholder: '', category: 'vuln' },
  { id: 'vuln_config', name: 'Config files', syntax: 'ext:xml OR ext:conf OR ext:cnf OR ext:ini OR ext:env', description: 'Конфигурационные файлы', placeholder: '', category: 'vuln' },
  { id: 'vuln_backup', name: 'Backup files', syntax: 'ext:bak OR ext:backup OR ext:old OR ext:sql', description: 'Резервные копии', placeholder: '', category: 'vuln' },
  { id: 'vuln_db', name: 'Database files', syntax: 'ext:sql OR ext:dbf OR ext:mdb', description: 'Файлы баз данных', placeholder: '', category: 'vuln' },
  { id: 'vuln_error', name: 'Error messages', syntax: 'intext:"error" OR intext:"warning" OR intext:"deprecated"', description: 'Сообщения об ошибках', placeholder: '', category: 'vuln' },
  { id: 'vuln_phpinfo', name: 'phpinfo()', syntax: 'ext:php intitle:phpinfo "published by the PHP Group"', description: 'Открытые phpinfo', placeholder: '', category: 'vuln' },
  { id: 'vuln_dir', name: 'Directory listing', syntax: 'intitle:"index of /"', description: 'Открытые директории', placeholder: '', category: 'vuln' },
  { id: 'vuln_git', name: 'Git exposed', syntax: 'inurl:.git OR inurl:.svn', description: 'Открытые репозитории', placeholder: '', category: 'vuln' },

  // Advanced
  { id: 'numrange', name: 'numrange:', syntax: 'numrange:', description: 'Диапазон чисел', placeholder: '100..200', category: 'advanced' },
  { id: 'daterange', name: 'after:', syntax: 'after:', description: 'Результаты после даты', placeholder: '2024-01-01', category: 'advanced' },
  { id: 'before', name: 'before:', syntax: 'before:', description: 'Результаты до даты', placeholder: '2024-12-31', category: 'advanced' },
  { id: 'or', name: 'OR', syntax: ' OR ', description: 'Логическое ИЛИ', placeholder: '', category: 'advanced' },
  { id: 'minus', name: 'Исключение (-)', syntax: '-', description: 'Исключить слово', placeholder: 'исключаемое_слово', category: 'advanced' },
  { id: 'quotes', name: '"Точная фраза"', syntax: '"', description: 'Поиск точной фразы', placeholder: 'точная фраза', category: 'advanced' },
];

export const templates: DorkTemplate[] = [
  {
    id: 't1',
    name: 'Утечки паролей',
    description: 'Поиск файлов с паролями в открытом доступе',
    query: 'filetype:txt "password" OR "пароль" OR "login" OR "username"',
    category: 'vuln',
    icon: '🔑'
  },
  {
    id: 't2',
    name: 'Открытые документы',
    description: 'Конфиденциальные документы в открытом доступе',
    query: 'filetype:pdf OR filetype:docx OR filetype:xlsx "confidential" OR "секретно" OR "internal"',
    category: 'file',
    icon: '📋'
  },
  {
    id: 't3',
    name: 'Поиск email',
    description: 'Найти email адреса на сайте',
    query: 'site:example.com intext:"@" intext:"email" OR "mail" OR "контакт"',
    category: 'social',
    icon: '📧'
  },
  {
    id: 't4',
    name: 'Камеры наблюдения',
    description: 'Публично доступные веб-камеры',
    query: 'inurl:"view.shtml" OR inurl:"ViewerFrame" OR inurl:"CameraAdmin"',
    category: 'vuln',
    icon: '📹'
  },
  {
    id: 't5',
    name: 'Админ-панели',
    description: 'Поиск панелей администрирования',
    query: 'inurl:admin OR inurl:dashboard OR inurl:panel intitle:"login" OR "sign in"',
    category: 'vuln',
    icon: '🛡️'
  },
  {
    id: 't6',
    name: 'API ключи',
    description: 'Утёкшие API ключи и токены',
    query: '"api_key" OR "api-key" OR "apikey" OR "access_token" filetype:json OR filetype:env OR filetype:txt',
    category: 'vuln',
    icon: '🗝️'
  },
  {
    id: 't7',
    name: 'Профиль человека',
    description: 'Поиск информации о человеке в соцсетях',
    query: '"Имя Фамилия" (site:linkedin.com OR site:facebook.com OR site:twitter.com OR site:vk.com)',
    category: 'social',
    icon: '👤'
  },
  {
    id: 't8',
    name: 'SQL ошибки',
    description: 'Страницы с ошибками SQL',
    query: 'intext:"sql syntax" OR intext:"mysql_fetch" OR intext:"warning: mysql" OR intext:"pg_query"',
    category: 'vuln',
    icon: '💉'
  },
  {
    id: 't9',
    name: 'WordPress уязвимости',
    description: 'Уязвимые WordPress сайты',
    query: 'inurl:wp-content OR inurl:wp-includes "wordpress" ext:xml OR ext:log',
    category: 'vuln',
    icon: '📝'
  },
  {
    id: 't10',
    name: 'Поиск по телефону',
    description: 'Найти информацию по номеру телефона',
    query: '"+7 XXX XXX XX XX" OR "8 XXX XXX XX XX" (site:vk.com OR site:ok.ru OR site:linkedin.com)',
    category: 'social',
    icon: '📱'
  },
  {
    id: 't11',
    name: 'Серверные логи',
    description: 'Открытые логи серверов',
    query: 'ext:log OR ext:txt "server" OR "access" OR "error" -site:github.com',
    category: 'vuln',
    icon: '📊'
  },
  {
    id: 't12',
    name: 'DNS зоны',
    description: 'Открытые DNS zone файлы',
    query: 'ext:txt "zone" OR "DNS" OR "domain" inurl:zone OR inurl:dns',
    category: 'vuln',
    icon: '🌍'
  },
];

export const searchEngines = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { id: 'yandex', name: 'Яндекс', url: 'https://yandex.ru/search/?text=' },
  { id: 'shodan', name: 'Shodan', url: 'https://www.shodan.io/search?query=' },
];
