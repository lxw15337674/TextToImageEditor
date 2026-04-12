import type { Locale } from '@/i18n/config';

interface LocaleMessages {
  common: {
    siteName: string;
    siteTagline: string;
    siteDescription: string;
    navHome: string;
    navStarter: string;
    navNotes: string;
    themeLabel: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    languageLabel: string;
    mobileMenuOpenLabel: string;
    mobileMenuDescription: string;
  };
  home: {
    metadataTitle: string;
    metadataDescription: string;
    metadataKeywords: string[];
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    stackTitle: string;
    stackDescription: string;
    stackItems: string[];
    featureItems: Array<{
      title: string;
      description: string;
    }>;
  };
  starter: {
    metadataTitle: string;
    metadataDescription: string;
    title: string;
    description: string;
    webTitle: string;
    webDescription: string;
    webItems: string[];
    apiTitle: string;
    apiDescription: string;
    apiItems: string[];
    checklistTitle: string;
    checklistDescription: string;
    checklist: string[];
  };
  notes: {
    metadataTitle: string;
    metadataDescription: string;
    title: string;
    description: string;
    loadingDocument: string;
    statusEditing: string;
    statusSaving: string;
    statusSaved: string;
    undo: string;
    redo: string;
    saveMilestone: string;
    history: string;
    fileMenu: string;
    importFile: string;
    exportMarkdown: string;
    exportText: string;
    exportImage: string;
    shareImage: string;
    markdownTab: string;
    editorCardTitle: string;
    editorCardDescription: string;
    editorBodyLabel: string;
    previewTab: string;
    plainTab: string;
    mobileEditorTab: string;
    mobilePreviewTab: string;
    previewCardTitle: string;
    previewCardDescription: string;
    plainCardTitle: string;
    emptyPlainPreview: string;
    localOnlyTitle: string;
    localOnlyDescription: string;
    localOnlyStorage: string;
    localOnlyVersions: string;
    localOnlyExport: string;
    historyTitle: string;
    historyDescription: string;
    emptyHistory: string;
    versionKindAuto: string;
    versionKindMilestone: string;
    versionKindImportBackup: string;
    versionKindRollbackBackup: string;
    versionLabelPlaceholder: string;
    saveVersionLabel: string;
    versionLabelSaved: string;
    restoreVersion: string;
    saveAsMilestone: string;
    renameMilestone: string;
    deleteVersion: string;
    cancel: string;
    emptyVersionSummary: string;
    exportDialogTitle: string;
    exportDialogDescription: string;
    exportThemeLabel: string;
    exportThemeLight: string;
    exportThemeDark: string;
    exportTemplateLabel: string;
    templateXiaohongshu: string;
    templateImageBackground: string;
    templateSpotify: string;
    templateOceanQuote: string;
    templateCalendarEssay: string;
    templateEditorialCard: string;
    exportResolutionLabel: string;
    exportPreviewLabel: string;
    exportPreviewLoading: string;
    exportPreviewPages: string;
    previewZoomOpenLabel: string;
    previewZoomCloseLabel: string;
    exportHint: string;
    overflowWarning: string;
    loadError: string;
    saveError: string;
    versionError: string;
    importError: string;
    importSuccess: string;
    exportMarkdownSuccess: string;
    exportTextSuccess: string;
    exportImageError: string;
    exportImagesSuccessOne: string;
    exportImagesSuccessMany: string;
    shareError: string;
    shareSuccess: string;
    shareFirstPageSuccess: string;
    shareFallback: string;
    milestoneSaved: string;
    restoreSuccess: string;
  };
}

const MESSAGES: Record<Locale, LocaleMessages> = {
  en: {
    common: {
      siteName: 'CF Monorepo Template',
      siteTagline: 'A reusable monorepo for localized full-stack apps.',
      siteDescription: 'Localized Next.js frontend and Cloudflare Worker API template.',
      navHome: 'Home',
      navStarter: 'Starter Guide',
      navNotes: 'Poster Editor',
      themeLabel: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'System',
      languageLabel: 'Language',
      mobileMenuOpenLabel: 'Open navigation menu',
      mobileMenuDescription: 'Browse the core starter pages and switch language or theme.',
    },
    home: {
      metadataTitle: 'CF Monorepo Template',
      metadataDescription: 'A clean monorepo starter with localization, theme switching, Hono, OpenAPI docs, and D1 example routes.',
      metadataKeywords: ['starter template', 'next.js', 'cloudflare workers', 'hono', 'd1', 'monorepo'],
      eyebrow: 'Localized Full-Stack Starter',
      title: 'Start from a clean baseline instead of carving business logic out later.',
      description: 'This template keeps the shell that matters: routing by locale, theme switching, shared UI primitives, Cloudflare Worker deployment, OpenAPI docs, and one minimal D1-backed example.',
      primaryCta: 'Open Poster Editor',
      secondaryCta: 'Read Starter Guide',
      stackTitle: 'What stays in the template',
      stackDescription: 'The project keeps the infrastructure layer and removes product-specific workflows.',
      stackItems: [
        'Next.js app router with locale-prefixed routes',
        'Theme switcher and reusable UI primitives',
        'Hono API with OpenAPI JSON and Scalar docs',
        'A local-first Markdown editor with poster export',
      ],
      featureItems: [
        {
          title: 'Localized shell',
          description: 'Route structure, language switching, and SEO primitives are already wired up.',
        },
        {
          title: 'Intentional UI base',
          description: 'Theme support and a practical component layer stay available for future features.',
        },
        {
          title: 'Worker-ready API',
          description: 'The backend keeps Hono middleware, OpenAPI docs, and Cloudflare-friendly defaults.',
        },
        {
          title: 'Minimal data example',
          description: 'The editor route shows how to turn the starter shell into a real local-first product.',
        },
      ],
    },
    starter: {
      metadataTitle: 'Starter Guide',
      metadataDescription: 'Overview of the retained template structure for the web app and API worker.',
      title: 'Starter Guide',
      description: 'Use this scaffold as the first stable layer for a new product. Replace the sample editor copy, expand the shared package, and add domain modules where they belong.',
      webTitle: 'Web foundation',
      webDescription: 'What the frontend keeps after removing business-specific pages.',
      webItems: [
        'Locale-aware route groups under `app/[locale]`',
        'Theme switching, query provider, and reusable UI components',
        'Canonical URLs, sitemap, robots, and social image generation',
      ],
      apiTitle: 'API foundation',
      apiDescription: 'What the Worker keeps after removing storage, upload, and archival logic.',
      apiItems: [
        'Hono with secure headers, CORS, ETag, and request logging',
        'OpenAPI JSON plus interactive Scalar documentation',
        'A single D1 schema and simple REST example routes',
      ],
      checklistTitle: 'Next steps',
      checklistDescription: 'Typical work you should do before turning this template into a real app.',
      checklist: [
        'Replace template copy, app names, and public URLs.',
        'Replace the sample editor copy and keep the reusable shell.',
        'Add auth, background jobs, or storage only when a product need exists.',
      ],
    },
    notes: {
      metadataTitle: 'Markdown Poster Editor',
      metadataDescription: 'Local-first Markdown editor with autosave, history, rollback, and poster image export.',
      title: 'Markdown Poster Editor',
      description: 'Write in Markdown, keep your history locally, and export polished poster images without creating an account.',
      loadingDocument: 'Loading your local document…',
      statusEditing: 'Editing',
      statusSaving: 'Saving',
      statusSaved: 'Saved',
      undo: 'Undo',
      redo: 'Redo',
      saveMilestone: 'Save milestone',
      history: 'Versions',
      fileMenu: 'Files',
      importFile: 'Import .md or .txt',
      exportMarkdown: 'Export Markdown',
      exportText: 'Export text',
      exportImage: 'Export PNG',
      shareImage: 'Share image',
      markdownTab: 'Markdown',
      editorCardTitle: 'Editor',
      editorCardDescription: 'Write in Markdown on the left and shape a single-page poster on the right.',
      editorBodyLabel: 'Content',
      previewTab: 'Preview',
      plainTab: 'Plain text',
      mobileEditorTab: 'Edit',
      mobilePreviewTab: 'Preview',
      previewCardTitle: 'Live poster',
      previewCardDescription: 'These controls drive the live preview and the exported PNG.',
      plainCardTitle: 'Plain text view',
      emptyPlainPreview: 'Nothing here yet. Start writing on the left.',
      localOnlyTitle: 'Local-first',
      localOnlyDescription: 'Everything stays in this browser unless you explicitly export it.',
      localOnlyStorage: 'Autosave writes the current content to IndexedDB on this device.',
      localOnlyVersions: 'Version history keeps automatic snapshots, milestones, import backups, and rollback backups.',
      localOnlyExport: 'You can export Markdown, plain text, or poster PNG files to local storage.',
      historyTitle: 'Version history',
      historyDescription: 'Review local snapshots, turn any version into a milestone, or roll back in one click.',
      emptyHistory: 'No versions yet. Keep writing and the editor will create local snapshots.',
      versionKindAuto: 'Auto snapshot',
      versionKindMilestone: 'Milestone',
      versionKindImportBackup: 'Import backup',
      versionKindRollbackBackup: 'Rollback backup',
      versionLabelPlaceholder: 'Add a milestone label',
      saveVersionLabel: 'Save label',
      versionLabelSaved: 'Version label updated.',
      restoreVersion: 'Restore version',
      saveAsMilestone: 'Save as milestone',
      renameMilestone: 'Rename',
      deleteVersion: 'Delete',
      cancel: 'Cancel',
      emptyVersionSummary: 'This version has no content yet.',
      exportDialogTitle: 'Export poster image',
      exportDialogDescription: 'Choose a theme and size, then export one or more PNG posters.',
      exportThemeLabel: 'Poster theme',
      exportThemeLight: 'Light',
      exportThemeDark: 'Dark',
      exportTemplateLabel: 'Template',
      templateXiaohongshu: 'Template 1',
      templateImageBackground: 'Template 2',
      templateSpotify: 'Template 3',
      templateOceanQuote: 'Template 4',
      templateCalendarEssay: 'Template 5',
      templateEditorialCard: 'Editorial Card',
      exportResolutionLabel: 'Resolution',
      exportPreviewLabel: 'Live preview',
      exportPreviewLoading: 'Building preview…',
      exportPreviewPages: '{count} pages',
      previewZoomOpenLabel: 'Expand live preview',
      previewZoomCloseLabel: 'Minimize live preview',
      exportHint: 'Export size: {size}. This editor always exports one PNG and extends height automatically.',
      overflowWarning: 'Content beyond the maximum poster height will be clipped in the exported PNG.',
      loadError: 'Could not load your local document.',
      saveError: 'Could not save locally.',
      versionError: 'Could not update local version history.',
      importError: 'Could not import this file.',
      importSuccess: 'File imported and the previous state was backed up.',
      exportMarkdownSuccess: 'Markdown file exported.',
      exportTextSuccess: 'Text file exported.',
      exportImageError: 'Could not export PNG images.',
      exportImagesSuccessOne: 'PNG image exported.',
      exportImagesSuccessMany: '{count} PNG images exported.',
      shareError: 'Could not share the image.',
      shareSuccess: 'Image shared.',
      shareFirstPageSuccess: 'First poster page shared. Remaining pages can be exported as PNG files.',
      shareFallback: 'This browser cannot share image files. The first PNG was downloaded instead.',
      milestoneSaved: 'Milestone saved.',
      restoreSuccess: 'Version restored and the previous state was backed up.',
    },
  },
  zh: {
    common: {
      siteName: 'CF Monorepo Template',
      siteTagline: '适合本地化全栈项目的通用 monorepo 模板。',
      siteDescription: '内置多语言 Next.js 前端和 Cloudflare Worker API 模板。',
      navHome: '首页',
      navStarter: '模板说明',
      navNotes: '海报编辑器',
      themeLabel: '主题',
      themeLight: '浅色',
      themeDark: '深色',
      themeSystem: '跟随系统',
      languageLabel: '语言',
      mobileMenuOpenLabel: '打开导航菜单',
      mobileMenuDescription: '浏览模板核心页面，并切换语言和主题。',
    },
    home: {
      metadataTitle: 'CF Monorepo Template',
      metadataDescription: '一个干净的 monorepo 模板，保留多语言、主题切换、Hono、OpenAPI 文档和 D1 示例接口。',
      metadataKeywords: ['模板项目', 'next.js', 'cloudflare workers', 'hono', 'd1', 'monorepo'],
      eyebrow: '本地化全栈模板',
      title: '从干净的基础层开始，而不是以后再一点点剥离业务代码。',
      description: '这个模板只保留真正有复用价值的部分：按 locale 的路由、多主题、通用 UI、Cloudflare Worker 部署、OpenAPI 文档，以及一个最小 D1 示例。',
      primaryCta: '打开海报编辑器',
      secondaryCta: '查看模板说明',
      stackTitle: '模板保留内容',
      stackDescription: '保留基础设施，移除产品特定流程。',
      stackItems: [
        '带 locale 前缀的 Next.js App Router',
        '主题切换和可复用 UI primitives',
        '带 OpenAPI JSON 与 Scalar 文档的 Hono API',
        '本地优先的 Markdown 编辑器与海报导出',
      ],
      featureItems: [
        {
          title: '多语言壳层',
          description: '路由结构、语言切换和 SEO 基础能力已经接好。',
        },
        {
          title: '可继续扩展的 UI 基座',
          description: '保留主题能力和组件层，后续可以直接叠加业务页面。',
        },
        {
          title: '可部署的 Worker API',
          description: '后端保留了 Hono 中间件、OpenAPI 文档和 Cloudflare 友好的默认配置。',
        },
        {
          title: '最小数据闭环',
          description: '编辑器路由展示了如何把模板壳层变成一个真正的本地优先产品。',
        },
      ],
    },
    starter: {
      metadataTitle: '模板说明',
      metadataDescription: '概览当前模板中保留下来的 Web 和 API 结构。',
      title: '模板说明',
      description: '这个骨架适合作为新产品的第一层稳定基础。后续你可以替换示例文案、扩展 shared 包，并按业务域拆出自己的模块。',
      webTitle: 'Web 基础层',
      webDescription: '移除业务页之后，前端保留下来的部分。',
      webItems: [
        '`app/[locale]` 下的多语言路由结构',
        '主题切换、query provider 和可复用 UI 组件',
        'canonical、sitemap、robots 和社交图生成',
      ],
      apiTitle: 'API 基础层',
      apiDescription: '移除存储、上传和归档逻辑之后，Worker 保留的部分。',
      apiItems: [
        '带 secure headers、CORS、ETag 和请求日志的 Hono',
        'OpenAPI JSON 和可交互的 Scalar 文档',
        '单表 D1 schema 和简单 REST 示例路由',
      ],
      checklistTitle: '后续建议',
      checklistDescription: '把模板变成真实项目之前，通常还需要做这些事。',
      checklist: [
        '替换模板文案、应用名和公开域名。',
        '替换示例文案，并保留这套可复用的产品壳层。',
        '只有在产品确实需要时，再引入鉴权、后台任务或对象存储。',
      ],
    },
    notes: {
      metadataTitle: 'Markdown 海报编辑器',
      metadataDescription: '本地优先的 Markdown 编辑器，支持自动保存、历史版本、回滚和海报导出。',
      title: 'Markdown 海报编辑器',
      description: '用 Markdown 写内容，把版本记录留在本机，再导出成适合分享的海报图片。',
      loadingDocument: '正在加载本地文档…',
      statusEditing: '编辑中',
      statusSaving: '保存中',
      statusSaved: '已保存',
      undo: '撤回',
      redo: '重做',
      saveMilestone: '保存里程碑',
      history: '版本记录',
      fileMenu: '文件',
      importFile: '导入 .md 或 .txt',
      exportMarkdown: '导出 Markdown',
      exportText: '导出纯文本',
      exportImage: '导出 PNG',
      shareImage: '分享图片',
      markdownTab: 'Markdown',
      editorCardTitle: '编辑器',
      editorCardDescription: '左侧编辑 Markdown，右侧直接调整单页海报效果。',
      editorBodyLabel: '内容',
      previewTab: '渲染预览',
      plainTab: '纯文本',
      mobileEditorTab: '编辑',
      mobilePreviewTab: '预览',
      previewCardTitle: '实时海报',
      previewCardDescription: '这里的设置会同时驱动实时预览和最终导出的 PNG。',
      plainCardTitle: '纯文本视图',
      emptyPlainPreview: '这里还是空的，先在左侧开始写吧。',
      localOnlyTitle: '仅保存在本机',
      localOnlyDescription: '除非你主动导出，否则所有内容都只保存在当前浏览器里。',
      localOnlyStorage: '自动保存会把当前内容写入这台设备的 IndexedDB。',
      localOnlyVersions: '版本记录会保存自动快照、手动里程碑、导入前备份和回滚前备份。',
      localOnlyExport: '你可以把内容导出为 Markdown、纯文本或海报 PNG 图片。',
      historyTitle: '版本记录',
      historyDescription: '查看本地快照，把任意版本另存为里程碑，或一键回滚。',
      emptyHistory: '还没有版本记录。继续编辑，系统会自动创建本地快照。',
      versionKindAuto: '自动快照',
      versionKindMilestone: '手动里程碑',
      versionKindImportBackup: '导入前备份',
      versionKindRollbackBackup: '回滚前备份',
      versionLabelPlaceholder: '输入里程碑标签',
      saveVersionLabel: '保存标签',
      versionLabelSaved: '版本标签已更新。',
      restoreVersion: '恢复此版本',
      saveAsMilestone: '另存为里程碑',
      renameMilestone: '重命名',
      deleteVersion: '删除',
      cancel: '取消',
      emptyVersionSummary: '这个版本里还没有内容。',
      exportDialogTitle: '导出海报图片',
      exportDialogDescription: '选择主题和尺寸，然后导出一张或多张 PNG 海报。',
      exportThemeLabel: '海报主题',
      exportThemeLight: '浅色',
      exportThemeDark: '深色',
      exportTemplateLabel: '模板',
      templateXiaohongshu: '模板 1',
      templateImageBackground: '模板 2',
      templateSpotify: '模板 3',
      templateOceanQuote: '模板 4',
      templateCalendarEssay: '模板 5',
      templateEditorialCard: '内容卡片',
      exportResolutionLabel: '导出分辨率',
      exportPreviewLabel: '实时预览',
      exportPreviewLoading: '正在生成预览…',
      exportPreviewPages: '{count} 页',
      previewZoomOpenLabel: '放大实时预览',
      previewZoomCloseLabel: '收起实时预览',
      exportHint: '当前导出尺寸：{size}。始终只导出 1 张 PNG，并按内容自动拉长高度。',
      overflowWarning: '内容超过最大海报高度后，超出部分会在导出的 PNG 中被裁切。',
      loadError: '加载本地文档失败。',
      saveError: '本地保存失败。',
      versionError: '更新本地版本记录失败。',
      importError: '导入文件失败。',
      importSuccess: '文件已导入，导入前状态已自动备份。',
      exportMarkdownSuccess: 'Markdown 文件已导出。',
      exportTextSuccess: '纯文本文件已导出。',
      exportImageError: '导出 PNG 图片失败。',
      exportImagesSuccessOne: 'PNG 图片已导出。',
      exportImagesSuccessMany: '已导出 {count} 张 PNG 图片。',
      shareError: '分享图片失败。',
      shareSuccess: '图片已分享。',
      shareFirstPageSuccess: '已分享第一页海报，其余页面可继续导出为 PNG。',
      shareFallback: '当前浏览器不支持分享图片文件，已改为下载第一张 PNG。',
      milestoneSaved: '里程碑已保存。',
      restoreSuccess: '版本已恢复，恢复前状态已自动备份。',
    },
  },
  es: {
    common: {
      siteName: 'CF Monorepo Template',
      siteTagline: 'Monorepo reutilizable para aplicaciones full-stack con localización.',
      siteDescription: 'Plantilla con frontend Next.js localizado y API Worker de Cloudflare.',
      navHome: 'Inicio',
      navStarter: 'Guía',
      navNotes: 'Poster Editor',
      themeLabel: 'Tema',
      themeLight: 'Claro',
      themeDark: 'Oscuro',
      themeSystem: 'Sistema',
      languageLabel: 'Idioma',
      mobileMenuOpenLabel: 'Abrir menú de navegación',
      mobileMenuDescription: 'Explora las páginas base y cambia idioma o tema.',
    },
    home: {
      metadataTitle: 'CF Monorepo Template',
      metadataDescription: 'Plantilla limpia con localización, cambio de tema, Hono, OpenAPI y rutas de ejemplo con D1.',
      metadataKeywords: ['plantilla', 'next.js', 'cloudflare workers', 'hono', 'd1', 'monorepo'],
      eyebrow: 'Starter full-stack localizado',
      title: 'Empieza desde una base limpia en lugar de extraer lógica de negocio más tarde.',
      description: 'La plantilla conserva solo lo útil para futuros proyectos: rutas por locale, cambio de tema, UI reutilizable, despliegue en Workers, documentación OpenAPI y un ejemplo mínimo con D1.',
      primaryCta: 'Open Poster Editor',
      secondaryCta: 'Leer la guía',
      stackTitle: 'Qué permanece',
      stackDescription: 'Se conserva la infraestructura y se elimina la lógica específica del producto.',
      stackItems: [
        'Next.js App Router con rutas por locale',
        'Cambio de tema y componentes reutilizables',
        'API Hono con OpenAPI JSON y docs de Scalar',
        'A local-first Markdown editor with poster export',
      ],
      featureItems: [
        {
          title: 'Base localizada',
          description: 'La estructura de rutas, el cambio de idioma y el SEO ya están conectados.',
        },
        {
          title: 'UI lista para crecer',
          description: 'El soporte de tema y la capa de componentes siguen disponibles para nuevas funciones.',
        },
        {
          title: 'API lista para Workers',
          description: 'El backend conserva middleware útil, documentación OpenAPI y defaults razonables.',
        },
        {
          title: 'Ejemplo de datos mínimo',
          description: 'The editor route shows how to turn the starter shell into a real local-first product.',
        },
      ],
    },
    starter: {
      metadataTitle: 'Guía',
      metadataDescription: 'Resumen de la estructura web y API que se mantiene en la plantilla.',
      title: 'Guía de inicio',
      description: 'Use this scaffold as a stable first layer for a new product. Replace the sample copy, extend the shared package, and add domain modules where they belong.',
      webTitle: 'Base web',
      webDescription: 'Qué conserva el frontend tras retirar las páginas de negocio.',
      webItems: [
        'Rutas localizadas bajo `app/[locale]`',
        'Cambio de tema, query provider y UI reutilizable',
        'Canonical, sitemap, robots e imágenes sociales',
      ],
      apiTitle: 'Base API',
      apiDescription: 'Qué conserva el Worker tras retirar cargas, almacenamiento y archivado.',
      apiItems: [
        'Hono con secure headers, CORS, ETag y logs de petición',
        'OpenAPI JSON y documentación interactiva con Scalar',
        'Un schema D1 sencillo y rutas REST de ejemplo',
      ],
      checklistTitle: 'Siguientes pasos',
      checklistDescription: 'Trabajo habitual antes de convertir la plantilla en una app real.',
      checklist: [
        'Reemplaza el texto de plantilla, los nombres y las URLs públicas.',
        'Replace the sample copy and keep the reusable shell.',
        'Añade auth, jobs o storage solo cuando el producto lo necesite.',
      ],
    },
    notes: {
      metadataTitle: 'Markdown Poster Editor',
      metadataDescription: 'Local-first Markdown editor with autosave, history, rollback, and poster export.',
      title: 'Markdown Poster Editor',
      description: 'Write in Markdown, keep version history in this browser, and export polished poster images.',
      loadingDocument: 'Loading your local document…',
      statusEditing: 'Editing',
      statusSaving: 'Saving',
      statusSaved: 'Saved',
      undo: 'Undo',
      redo: 'Redo',
      saveMilestone: 'Save milestone',
      history: 'Versions',
      fileMenu: 'Files',
      importFile: 'Import .md or .txt',
      exportMarkdown: 'Export Markdown',
      exportText: 'Export text',
      exportImage: 'Export PNG',
      shareImage: 'Share image',
      markdownTab: 'Markdown',
      editorCardTitle: 'Editor',
      editorCardDescription: 'Write in Markdown on the left and shape a single-page poster on the right.',
      editorBodyLabel: 'Content',
      previewTab: 'Preview',
      plainTab: 'Plain text',
      mobileEditorTab: 'Edit',
      mobilePreviewTab: 'Preview',
      previewCardTitle: 'Live poster',
      previewCardDescription: 'These controls drive the live preview and the exported PNG.',
      plainCardTitle: 'Plain text view',
      emptyPlainPreview: 'Nothing here yet. Start writing on the left.',
      localOnlyTitle: 'Local-first',
      localOnlyDescription: 'Everything stays in this browser unless you export it yourself.',
      localOnlyStorage: 'Autosave writes the current content to IndexedDB on this device.',
      localOnlyVersions: 'Version history keeps automatic snapshots, milestones, import backups, and rollback backups.',
      localOnlyExport: 'You can export Markdown, plain text, or poster PNG files locally.',
      historyTitle: 'Version history',
      historyDescription: 'Review local snapshots, turn any version into a milestone, or roll back in one click.',
      emptyHistory: 'No versions yet. Keep writing and the editor will create local snapshots.',
      versionKindAuto: 'Auto snapshot',
      versionKindMilestone: 'Milestone',
      versionKindImportBackup: 'Import backup',
      versionKindRollbackBackup: 'Rollback backup',
      versionLabelPlaceholder: 'Add a milestone label',
      saveVersionLabel: 'Save label',
      versionLabelSaved: 'Version label updated.',
      restoreVersion: 'Restore version',
      saveAsMilestone: 'Save as milestone',
      renameMilestone: 'Rename',
      deleteVersion: 'Delete',
      cancel: 'Cancel',
      emptyVersionSummary: 'This version has no content yet.',
      exportDialogTitle: 'Export poster image',
      exportDialogDescription: 'Choose a theme and size, then export one or more PNG posters.',
      exportThemeLabel: 'Poster theme',
      exportThemeLight: 'Light',
      exportThemeDark: 'Dark',
      exportTemplateLabel: 'Template',
      templateXiaohongshu: 'Plantilla 1',
      templateImageBackground: 'Plantilla 2',
      templateSpotify: 'Plantilla 3',
      templateOceanQuote: 'Plantilla 4',
      templateCalendarEssay: 'Plantilla 5',
      templateEditorialCard: 'Editorial Card',
      exportResolutionLabel: 'Resolution',
      exportPreviewLabel: 'Live preview',
      exportPreviewLoading: 'Building preview…',
      exportPreviewPages: '{count} pages',
      previewZoomOpenLabel: 'Ampliar vista previa en vivo',
      previewZoomCloseLabel: 'Cerrar vista previa ampliada',
      exportHint: 'Export size: {size}. This editor always exports one PNG and extends height automatically.',
      overflowWarning: 'Content beyond the maximum poster height will be clipped in the exported PNG.',
      loadError: 'Could not load your local document.',
      saveError: 'Could not save locally.',
      versionError: 'Could not update local version history.',
      importError: 'Could not import this file.',
      importSuccess: 'File imported and the previous state was backed up.',
      exportMarkdownSuccess: 'Markdown file exported.',
      exportTextSuccess: 'Text file exported.',
      exportImageError: 'Could not export PNG images.',
      exportImagesSuccessOne: 'PNG image exported.',
      exportImagesSuccessMany: '{count} PNG images exported.',
      shareError: 'Could not share the image.',
      shareSuccess: 'Image shared.',
      shareFirstPageSuccess: 'First poster page shared. Remaining pages can be exported as PNG files.',
      shareFallback: 'This browser cannot share image files. The first PNG was downloaded instead.',
      milestoneSaved: 'Milestone saved.',
      restoreSuccess: 'Version restored and the previous state was backed up.',
    },
  },
  ja: {
    common: {
      siteName: 'CF Monorepo Template',
      siteTagline: '多言語対応のフルスタック開発向けに再利用できる monorepo テンプレートです。',
      siteDescription: '多言語 Next.js フロントエンドと Cloudflare Worker API を備えたテンプレートです。',
      navHome: 'ホーム',
      navStarter: 'ガイド',
      navNotes: 'Poster Editor',
      themeLabel: 'テーマ',
      themeLight: 'ライト',
      themeDark: 'ダーク',
      themeSystem: 'システム',
      languageLabel: '言語',
      mobileMenuOpenLabel: 'ナビゲーションメニューを開く',
      mobileMenuDescription: 'テンプレートの主要ページを確認し、言語とテーマを切り替えます。',
    },
    home: {
      metadataTitle: 'CF Monorepo Template',
      metadataDescription: 'ローカライズ、テーマ切替、Hono、OpenAPI、D1 例を備えたクリーンな monorepo テンプレートです。',
      metadataKeywords: ['starter template', 'next.js', 'cloudflare workers', 'hono', 'd1', 'monorepo'],
      eyebrow: '多言語フルスタック スターター',
      title: 'あとで業務コードを削ぎ落とすのではなく、最初からクリーンな土台で始める。',
      description: 'このテンプレートは、本当に再利用したい層だけを残します。locale 付きルーティング、テーマ切替、共通 UI、Workers へのデプロイ、OpenAPI ドキュメント、そして最小の D1 例です。',
      primaryCta: 'Poster Editor を開く',
      secondaryCta: 'ガイドを読む',
      stackTitle: 'テンプレートに残すもの',
      stackDescription: 'インフラ層だけを保持し、製品固有のワークフローは削除します。',
      stackItems: [
        'locale プレフィックス付きの Next.js App Router',
        'テーマ切替と再利用可能な UI primitives',
        'OpenAPI JSON と Scalar docs を備えた Hono API',
        'ポスター画像を書き出せるローカルファーストの Markdown エディタ',
      ],
      featureItems: [
        {
          title: '多言語シェル',
          description: 'ルーティング、言語切替、SEO の基本機能が最初から接続されています。',
        },
        {
          title: '拡張しやすい UI ベース',
          description: 'テーマ機能とコンポーネント層をそのまま新しい機能に活かせます。',
        },
        {
          title: 'Worker 向け API',
          description: 'バックエンドには Hono ミドルウェア、OpenAPI ドキュメント、Cloudflare 向けの妥当な初期設定が残ります。',
        },
        {
          title: '最小のデータ例',
          description: 'エディタルートは、スターターのシェルをローカルファーストな実製品へ変える流れを示します。',
        },
      ],
    },
    starter: {
      metadataTitle: 'ガイド',
      metadataDescription: 'テンプレートに残した Web と API の構成を確認します。',
      title: 'スターターガイド',
      description: 'この scaffold を新しい製品の最初の安定層として使ってください。サンプル文言を差し替え、shared パッケージを拡張し、ドメイン単位で機能を追加していけます。',
      webTitle: 'Web の土台',
      webDescription: '業務ページを取り除いたあとにフロントエンドへ残るもの。',
      webItems: [
        '`app/[locale]` 配下の多言語ルート構造',
        'テーマ切替、query provider、再利用可能な UI',
        'canonical、sitemap、robots、OG 画像生成',
      ],
      apiTitle: 'API の土台',
      apiDescription: 'アップロードや保管処理を外したあとに Worker に残るもの。',
      apiItems: [
        'secure headers、CORS、ETag、リクエストログ付きの Hono',
        'OpenAPI JSON と Scalar の対話型ドキュメント',
        '単純な D1 schema と REST のサンプルルート',
      ],
      checklistTitle: '次の作業',
      checklistDescription: 'このテンプレートを実プロダクトにする前に、通常は次を行います。',
      checklist: [
        'テンプレート文言、アプリ名、公開 URL を置き換える。',
        'サンプル文言を置き換えつつ、再利用できるシェルを維持する。',
        '認証、バックグラウンド処理、ストレージは必要になってから追加する。',
      ],
    },
    notes: {
      metadataTitle: 'Markdown Poster Editor',
      metadataDescription: 'Local-first Markdown editor with autosave, history, rollback, and poster export.',
      title: 'Markdown Poster Editor',
      description: 'Write in Markdown, keep version history in this browser, and export polished poster images.',
      loadingDocument: 'ローカルのドキュメントを読み込み中…',
      statusEditing: '編集中',
      statusSaving: '保存中',
      statusSaved: '保存済み',
      undo: '元に戻す',
      redo: 'やり直す',
      saveMilestone: 'マイルストーンを保存',
      history: 'バージョン',
      fileMenu: 'ファイル',
      importFile: '.md / .txt を読み込む',
      exportMarkdown: 'Markdown を書き出す',
      exportText: 'テキストを書き出す',
      exportImage: 'PNG を書き出す',
      shareImage: '画像を共有',
      markdownTab: 'Markdown',
      editorCardTitle: 'エディタ',
      editorCardDescription: '左で Markdown を編集し、右で単一ページのポスターを整えます。',
      editorBodyLabel: '本文',
      previewTab: 'プレビュー',
      plainTab: 'プレーンテキスト',
      mobileEditorTab: '編集',
      mobilePreviewTab: 'プレビュー',
      previewCardTitle: 'ライブポスター',
      previewCardDescription: 'ここでの設定がライブプレビューと書き出し PNG の両方に反映されます。',
      plainCardTitle: 'プレーンテキスト表示',
      emptyPlainPreview: 'まだ何もありません。左側から書き始めてください。',
      localOnlyTitle: 'ローカル保存',
      localOnlyDescription: '自分で書き出さない限り、内容はこのブラウザ内だけに残ります。',
      localOnlyStorage: 'オートセーブは現在の内容をこの端末の IndexedDB に保存します。',
      localOnlyVersions: '履歴には自動スナップショット、マイルストーン、インポート前バックアップ、ロールバック前バックアップが残ります。',
      localOnlyExport: 'Markdown、プレーンテキスト、ポスター PNG をローカルに書き出せます。',
      historyTitle: 'バージョン履歴',
      historyDescription: 'ローカルのスナップショットを確認し、任意の版をマイルストーン化したり、1 クリックで戻したりできます。',
      emptyHistory: 'まだ履歴はありません。編集を続けると自動スナップショットが作成されます。',
      versionKindAuto: '自動スナップショット',
      versionKindMilestone: 'マイルストーン',
      versionKindImportBackup: 'インポート前バックアップ',
      versionKindRollbackBackup: 'ロールバック前バックアップ',
      versionLabelPlaceholder: 'マイルストーン名を入力',
      saveVersionLabel: 'ラベルを保存',
      versionLabelSaved: 'ラベルを更新しました。',
      restoreVersion: 'この版を復元',
      saveAsMilestone: 'マイルストーンとして保存',
      renameMilestone: '名前変更',
      deleteVersion: '削除',
      cancel: 'キャンセル',
      emptyVersionSummary: 'この版にはまだ内容がありません。',
      exportDialogTitle: 'ポスター画像を書き出す',
      exportDialogDescription: 'テーマとサイズを選び、1 枚または複数枚の PNG を書き出します。',
      exportThemeLabel: 'ポスターテーマ',
      exportThemeLight: 'ライト',
      exportThemeDark: 'ダーク',
      exportTemplateLabel: 'テンプレート',
      templateXiaohongshu: 'テンプレート 1',
      templateImageBackground: 'テンプレート 2',
      templateSpotify: 'テンプレート 3',
      templateOceanQuote: 'テンプレート 4',
      templateCalendarEssay: 'テンプレート 5',
      templateEditorialCard: 'Editorial Card',
      exportResolutionLabel: '解像度',
      exportPreviewLabel: 'ライブプレビュー',
      exportPreviewLoading: 'プレビューを生成中…',
      exportPreviewPages: '{count} ページ',
      previewZoomOpenLabel: 'ライブプレビューを拡大',
      previewZoomCloseLabel: '拡大プレビューを閉じる',
      exportHint: '現在の書き出しサイズ: {size}。常に 1 枚の PNG を書き出し、内容に応じて高さを自動拡張します。',
      overflowWarning: 'ポスターの最大高さを超えた内容は、書き出した PNG で切り取られます。',
      loadError: 'ローカルのドキュメントを読み込めませんでした。',
      saveError: 'ローカル保存に失敗しました。',
      versionError: 'ローカル履歴の更新に失敗しました。',
      importError: 'ファイルを読み込めませんでした。',
      importSuccess: 'ファイルを読み込み、直前の状態をバックアップしました。',
      exportMarkdownSuccess: 'Markdown を書き出しました。',
      exportTextSuccess: 'テキストを書き出しました。',
      exportImageError: 'PNG の書き出しに失敗しました。',
      exportImagesSuccessOne: 'PNG を書き出しました。',
      exportImagesSuccessMany: '{count} 枚の PNG を書き出しました。',
      shareError: '画像を共有できませんでした。',
      shareSuccess: '画像を共有しました。',
      shareFirstPageSuccess: '1 ページ目を共有しました。残りは PNG として書き出せます。',
      shareFallback: 'このブラウザは画像ファイルの共有に対応していないため、1 枚目の PNG をダウンロードしました。',
      milestoneSaved: 'マイルストーンを保存しました。',
      restoreSuccess: '版を復元し、復元前の状態もバックアップしました。',
    },
  },
};

export function getMessages(locale: Locale): LocaleMessages {
  return MESSAGES[locale];
}
