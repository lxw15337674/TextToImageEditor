import type { Locale } from '@/i18n/config';

interface LocaleMessages {
  common: {
    siteName: string;
    siteTagline: string;
    siteDescription: string;
    navHome: string;
    navUseCases: string;
    navStarter: string;
    navNotes: string;
    openEditor: string;
    featureLauncher: string;
    featureMenuDescription: string;
    featureGroupCore: string;
    featureGroupMore: string;
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
    primaryCardTitle: string;
    primaryCardDescription: string;
    primaryCardCta: string;
    primaryCardTags: string[];
    secondaryCardTitle: string;
    secondaryCardDescription: string;
    secondaryCardCta: string;
    detailCards: Array<{
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
  useCases: {
    metadataTitle: string;
    metadataDescription: string;
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    proofItems: Array<{
      title: string;
      description: string;
    }>;
    problemTitle: string;
    problemDescription: string;
    valueItems: Array<{
      title: string;
      description: string;
    }>;
    useCasesTitle: string;
    useCasesDescription: string;
    useCaseItems: Array<{
      title: string;
      description: string;
    }>;
    comparisonTitle: string;
    comparisonDescription: string;
    comparisonItems: Array<{
      title: string;
      description: string;
    }>;
    faqTitle: string;
    faqDescription: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
    ctaTitle: string;
    ctaDescription: string;
    ctaPrimary: string;
    ctaSecondary: string;
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
    exportMenu: string;
    exportHtml: string;
    exportImage: string;
    exportJpeg: string;
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
    versionKindResetBackup: string;
    resetSuccess: string;
    resetError: string;
    resetNote: string;
    resetConfirmTitle: string;
    resetConfirmDescription: string;
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
    fontSizeLabel: string;
    fontSizeSmall: string;
    fontSizeMedium: string;
    fontSizeLarge: string;
    exportTemplateLabel: string;
    templateSearchPlaceholder: string;
    templateSearchEmpty: string;
    templateXiaohongshu: string;
    templateSpotify: string;
    templateOceanQuote: string;
    templateCalendarEssay: string;
    templateEditorialCard: string;
    templateCinemaBook: string;
    templateCodeSnippet: string;
    templateTicketStub: string;
    templateZenVertical: string;
    templateNewsFlash: string;
    templatePolaroid: string;
    templateLiterature: string;
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
    exportHtmlSuccess: string;
    exportJpegSuccess: string;
    exportImageError: string;
    exportHtmlError: string;
    exportJpegError: string;
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
      siteName: 'MintyHub',
      siteTagline: 'A reusable monorepo for localized full-stack apps.',
      siteDescription: 'Localized Next.js frontend and Cloudflare Worker API template.',
      navHome: 'Home',
      navUseCases: 'Use Cases',
      navStarter: 'Starter Guide',
      navNotes: 'Poster Editor',
      openEditor: 'Open Editor',
      featureLauncher: 'Features',
      featureMenuDescription: 'Jump between the main product surfaces from one place.',
      featureGroupCore: 'Core',
      featureGroupMore: 'More',
      themeLabel: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'System',
      languageLabel: 'Language',
      mobileMenuOpenLabel: 'Open navigation menu',
      mobileMenuDescription: 'Open the editor, browse use cases, and switch language or theme.',
    },
    home: {
      metadataTitle: 'A text editor where your writing does not get lost',
      metadataDescription:
        'Local-first writing editor with autosave, version history, restore, and share-image export.',
      metadataKeywords: ['writing editor', 'autosave notes', 'version history editor', 'local-first editor', 'share image'],
      eyebrow: 'Local-first writing workspace',
      title: 'Write without wondering whether the text will still be there later.',
      description:
        'This editor keeps drafts, notes, and evolving copy in one local-first workspace with autosave, version history, and share-image export.',
      primaryCardTitle: 'Open the editor',
      primaryCardDescription:
        'Start writing in plain text or Markdown, keep autosave running, and restore earlier versions when you need to.',
      primaryCardCta: 'Open Editor',
      primaryCardTags: ['Autosave', 'Version history', 'Local-first'],
      secondaryCardTitle: 'Explore use cases',
      secondaryCardDescription:
        'See how the workflow fits article drafts, notes, social captions, campaign copy, and polished share images.',
      secondaryCardCta: 'Use Cases',
      detailCards: [
        {
          title: 'Version history',
          description: 'Automatic snapshots and milestones give you clear restore points before and after major edits.',
        },
        {
          title: 'Local-first',
          description: 'Your draft stays in this browser unless you explicitly export it.',
        },
        {
          title: 'Share image export',
          description: 'Turn finished writing into a polished image without rebuilding the content somewhere else.',
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
    useCases: {
      metadataTitle: 'A text editor where your writing does not get lost',
      metadataDescription:
        'Write drafts, notes, and social copy with autosave, version history, local-first protection, and share-image export.',
      eyebrow: 'Local-first writing editor',
      title: 'A text editor where your writing does not get lost',
      description:
        'Write drafts, notes, and social copy in one place. Autosave protects your latest changes, version history lets you roll back, and share-image export turns finished writing into a polished visual.',
      primaryCta: 'Open the editor',
      secondaryCta: 'See use cases',
      proofItems: [
        {
          title: 'Autosave in the browser',
          description: 'Your current draft is stored locally while you write.',
        },
        {
          title: 'Recoverable version history',
          description: 'Automatic snapshots and milestones help you restore earlier states.',
        },
        {
          title: 'Share-image export',
          description: 'Turn finished writing into a polished graphic without moving to another tool.',
        },
      ],
      problemTitle: 'Built for writing that changes often',
      problemDescription:
        'Most text boxes are disposable. This editor is built for work that gets revised, rescued, and published without losing the writing itself.',
      valueItems: [
        {
          title: 'Autosave without account friction',
          description: 'You can start writing immediately and still keep the latest state on this device.',
        },
        {
          title: 'Version history you can actually use',
          description: 'Automatic snapshots and manual milestones give you a practical rollback path.',
        },
        {
          title: 'Plain text and Markdown in one workspace',
          description: 'Use simple text for speed or switch to Markdown when structure matters.',
        },
        {
          title: 'From draft to share image',
          description: 'When the wording is ready, export the same content as a polished share image.',
        },
      ],
      useCasesTitle: 'Common use cases',
      useCasesDescription: 'The workflow fits writing that moves through many revisions before it gets shared.',
      useCaseItems: [
        {
          title: 'Draft articles and long-form writing',
          description: 'Keep early versions, cut sections safely, and return to previous drafts when the structure changes.',
        },
        {
          title: 'Organize notes and research',
          description: 'Capture rough thinking first, then clean it up later without worrying about accidental loss.',
        },
        {
          title: 'Iterate on social captions and campaign copy',
          description: 'Try multiple versions, save milestones, and export the final wording as a visual asset.',
        },
        {
          title: 'Track milestone revisions',
          description: 'Save clear checkpoints before major rewrites so you can compare or restore them later.',
        },
        {
          title: 'Export polished share images',
          description: 'Turn selected content into a consistent visual output without rebuilding it in a design tool.',
        },
        {
          title: 'Keep a reliable local writing workspace',
          description: 'Use it as a durable drafting surface for writing that should stay close to you and easy to recover.',
        },
      ],
      comparisonTitle: 'How it differs from ordinary editors',
      comparisonDescription: 'This is not just another input field or a template-only image generator.',
      comparisonItems: [
        {
          title: 'More durable than a basic text box',
          description: 'Autosave and version recovery reduce the cost of mistakes, refreshes, and abandoned revisions.',
        },
        {
          title: 'More focused than a general note app',
          description: 'Plain text, Markdown, history, and export sit in one direct workflow instead of being spread across features.',
        },
        {
          title: 'More practical than design-first tools',
          description: 'You write first, refine the wording, and only then export a share image from the same source.',
        },
      ],
      faqTitle: 'FAQ',
      faqDescription: 'The core questions people usually ask before trusting a writing tool with real work.',
      faqs: [
        {
          question: 'Does it save automatically?',
          answer: 'Yes. The current draft is saved locally in your browser while you write.',
        },
        {
          question: 'Can I restore an earlier version?',
          answer: 'Yes. Version history keeps automatic snapshots and manual milestones that you can restore later.',
        },
        {
          question: 'Do I need to upload my writing to a server?',
          answer: 'No. The editor is local-first by default, so your draft stays in this browser unless you export it yourself.',
        },
        {
          question: 'Does it support both Markdown and plain text?',
          answer: 'Yes. You can switch between Markdown and plain text depending on how much structure you want.',
        },
        {
          question: 'Can I export the final result as an image?',
          answer: 'Yes. Once the writing is ready, you can export it as a share image.',
        },
      ],
      ctaTitle: 'Write first. Decide how to share later.',
      ctaDescription:
        'Keep your draft safe while it evolves, then export it when the wording is ready for publishing or sharing.',
      ctaPrimary: 'Start writing',
      ctaSecondary: 'Jump to FAQ',
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
      exportMenu: 'Export',
      exportHtml: 'Export HTML',
      exportImage: 'Export PNG',
      exportJpeg: 'Export JPEG',
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
      versionKindResetBackup: 'Reset Backup',
      resetSuccess: 'Content reset to default.',
      resetError: 'Failed to reset.',
      resetNote: 'Reset Content',
      resetConfirmTitle: 'Are you sure?',
      resetConfirmDescription: 'This will clear the current content and create a backup. Continue?',
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
      fontSizeLabel: 'Body size',
      fontSizeSmall: 'Small',
      fontSizeMedium: 'Medium',
      fontSizeLarge: 'Large',
      exportTemplateLabel: 'Template',
      templateSearchPlaceholder: 'Search templates',
      templateSearchEmpty: 'No matching templates.',
      templateXiaohongshu: 'Crimson',
      templateSpotify: 'Vibe',
      templateOceanQuote: 'Azure',
      templateCalendarEssay: 'Chronicle',
      templateEditorialCard: 'Ink',
      templateCinemaBook: 'Cinema',
      templateCodeSnippet: 'Kernel',
      templateTicketStub: 'Entry',
      templateZenVertical: 'Zen',
      templateNewsFlash: 'Herald',
      templatePolaroid: 'Polaroid',
      templateLiterature: 'Literature',
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
      exportHtmlSuccess: 'HTML file exported.',
      exportJpegSuccess: 'JPEG image exported.',
      exportImageError: 'Could not export PNG images.',
      exportHtmlError: 'Could not export HTML file.',
      exportJpegError: 'Could not export JPEG image.',
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
      siteName: 'MintyHub',
      siteTagline: '适合本地化全栈项目的通用 monorepo 模板。',
      siteDescription: '内置多语言 Next.js 前端和 Cloudflare Worker API 模板。',
      navHome: '首页',
      navUseCases: '适用场景',
      navStarter: '模板说明',
      navNotes: '海报编辑器',
      openEditor: '打开编辑器',
      featureLauncher: '功能',
      featureMenuDescription: '把主要功能入口集中在这里，后面扩展也只需要改配置。',
      featureGroupCore: '核心功能',
      featureGroupMore: '更多',
      themeLabel: '主题',
      themeLight: '浅色',
      themeDark: '深色',
      themeSystem: '跟随系统',
      languageLabel: '语言',
      mobileMenuOpenLabel: '打开导航菜单',
      mobileMenuDescription: '打开编辑器、查看适用场景，并切换语言和主题。',
    },
    home: {
      metadataTitle: '文字不会轻易丢失的文本编辑器',
      metadataDescription: '本地优先的文字编辑器，支持自动保存、历史版本、恢复和分享图导出。',
      metadataKeywords: ['文本编辑器', '自动保存', '历史版本', '本地优先', '分享图'],
      eyebrow: '本地优先写作空间',
      title: '写字的时候，不用再担心内容会不会一转身就没了。',
      description:
        '这是一个面向持续写作的本地优先编辑器，适合草稿、笔记和反复修改的内容，自动保存、历史版本和分享图导出都在同一个界面里。',
      primaryCardTitle: '打开编辑器',
      primaryCardDescription: '支持纯文本和 Markdown，自动保存当前内容，并在需要时恢复到之前的版本。',
      primaryCardCta: '进入编辑器',
      primaryCardTags: ['自动保存', '历史版本', '本地优先'],
      secondaryCardTitle: '查看适用场景',
      secondaryCardDescription: '看看它如何用于文章草稿、笔记整理、社交文案迭代，以及最终导出分享图。',
      secondaryCardCta: '适用场景',
      detailCards: [
        {
          title: '历史版本',
          description: '自动快照和手动里程碑一起工作，方便你在大改前后随时恢复。',
        },
        {
          title: '本地优先',
          description: '除非你主动导出，否则内容默认只保存在当前浏览器里。',
        },
        {
          title: '分享图导出',
          description: '内容写稳之后，直接从同一份文字生成风格化分享图。',
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
    useCases: {
      metadataTitle: '文字不会轻易丢失的文本编辑器',
      metadataDescription: '适合草稿、笔记和内容迭代的本地优先文本编辑器，支持自动保存、历史版本、回滚和分享图导出。',
      eyebrow: '本地优先文本编辑器',
      title: '文字不会轻易丢失的文本编辑器',
      description:
        '适合写草稿、整理笔记和反复修改内容。自动保存保住最新内容，历史版本支持回看和恢复，最后还能导出成分享图。',
      primaryCta: '打开编辑器',
      secondaryCta: '查看适用场景',
      proofItems: [
        {
          title: '浏览器内自动保存',
          description: '你写下的最新内容会持续保存在当前设备里。',
        },
        {
          title: '可恢复的版本记录',
          description: '自动快照和手动里程碑都可以回看，也可以直接恢复。',
        },
        {
          title: '支持导出分享图',
          description: '内容定稿后，可以直接导出成风格化图片，不用再搬去别的工具。',
        },
      ],
      problemTitle: '适合会反复修改的写作流程',
      problemDescription: '很多输入框只是一次性容器。这个编辑器更适合真正要反复修改、对比和恢复的写作过程。',
      valueItems: [
        {
          title: '不用注册也能自动保存',
          description: '打开就能写，同时保留当前设备上的最新状态。',
        },
        {
          title: '真正可用的历史版本',
          description: '自动快照和手动里程碑都能形成清晰的回滚路径。',
        },
        {
          title: '纯文本和 Markdown 一体化',
          description: '想快速起草就用纯文本，需要结构时再切到 Markdown。',
        },
        {
          title: '从写作直接到分享图',
          description: '内容成熟之后，直接用同一份文本生成分享图，不需要重复排版。',
        },
      ],
      useCasesTitle: '常见使用场景',
      useCasesDescription: '这套流程尤其适合要经历多轮修改、最后再输出的内容工作。',
      useCaseItems: [
        {
          title: '写文章草稿和长文本',
          description: '先搭结构，再反复调整段落，过程中保留关键版本，避免越改越乱。',
        },
        {
          title: '整理笔记和研究摘要',
          description: '先把想法记下来，后面再清洗重组，不必担心误删后找不回来。',
        },
        {
          title: '迭代社交内容和文案',
          description: '尝试多个版本，保留节点，最后把定稿内容导出为可直接分享的图片。',
        },
        {
          title: '记录阶段性里程碑',
          description: '大改之前先存一个版本，后续可以对比，也能一键恢复。',
        },
        {
          title: '导出统一风格的分享图',
          description: '把最终文本直接转成视觉输出，减少在设计工具里重复搬运内容。',
        },
        {
          title: '作为稳定的本地写作空间',
          description: '把它当成一个更可靠的写作界面，用来承接那些你不想轻易丢掉的文字。',
        },
      ],
      comparisonTitle: '它和普通编辑器有什么不同',
      comparisonDescription: '它不只是一个输入框，也不只是一个做图片的模板工具。',
      comparisonItems: [
        {
          title: '比普通文本框更稳',
          description: '自动保存和版本恢复降低了误操作、刷新或中断带来的损失。',
        },
        {
          title: '比泛笔记工具更聚焦',
          description: '纯文本、Markdown、版本记录和导出放在一条直接的写作链路里。',
        },
        {
          title: '比设计优先工具更实用',
          description: '先把文字写稳，再从同一份内容导出分享图，而不是反过来做排版。',
        },
      ],
      faqTitle: '常见问题',
      faqDescription: '在真正把写作交给这个工具之前，人们通常会先关心这些问题。',
      faqs: [
        {
          question: '会自动保存吗？',
          answer: '会。当前草稿会在你编辑时自动保存在浏览器本地。',
        },
        {
          question: '可以恢复旧版本吗？',
          answer: '可以。版本记录会保留自动快照和手动里程碑，后续都能恢复。',
        },
        {
          question: '需要把内容上传到服务器吗？',
          answer: '不需要。它默认是本地优先，除非你主动导出，否则内容只留在当前浏览器里。',
        },
        {
          question: '支持 Markdown 和纯文本吗？',
          answer: '支持。你可以根据写作阶段，自由切换 Markdown 和纯文本。',
        },
        {
          question: '最后能导出成图片吗？',
          answer: '可以。内容定稿之后，可以直接导出成分享图。',
        },
      ],
      ctaTitle: '先把文字稳稳写下来，再决定怎么分享',
      ctaDescription: '先保护内容本身，再处理排版和发布，这样整个写作过程会更轻、更稳。',
      ctaPrimary: '开始写作',
      ctaSecondary: '跳到常见问题',
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
      exportMenu: '导出',
      exportHtml: '导出 HTML',
      exportImage: '导出 PNG',
      exportJpeg: '导出 JPEG',
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
      versionKindResetBackup: '重置前备份',
      resetSuccess: '内容已重置。',
      resetError: '重置失败。',
      resetNote: '重置内容',
      resetConfirmTitle: '确定要重置吗？',
      resetConfirmDescription: '这会清空当前内容并恢复为默认状态，将提前创建备份。',
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
      fontSizeLabel: '正文字号',
      fontSizeSmall: '小',
      fontSizeMedium: '中',
      fontSizeLarge: '大',
      exportTemplateLabel: '模板',
      templateSearchPlaceholder: '搜索模板',
      templateSearchEmpty: '没有匹配的模板。',
      templateXiaohongshu: '赤红',
      templateSpotify: '律动',
      templateOceanQuote: '蔚蓝',
      templateCalendarEssay: '光阴',
      templateEditorialCard: '素墨',
      templateCinemaBook: '影院手册',
      templateCodeSnippet: '代码卡片',
      templateTicketStub: '票根',
      templateZenVertical: '留白长页',
      templateNewsFlash: '快讯',
      templatePolaroid: '拍立得',
      templateLiterature: '传统文学',
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
      exportHtmlSuccess: 'HTML 文件已导出。',
      exportJpegSuccess: 'JPEG 图片已导出。',
      exportImageError: '导出 PNG 图片失败。',
      exportHtmlError: '导出 HTML 文件失败。',
      exportJpegError: '导出 JPEG 图片失败。',
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
      siteName: 'MintyHub',
      siteTagline: 'Monorepo reutilizable para aplicaciones full-stack con localización.',
      siteDescription: 'Plantilla con frontend Next.js localizado y API Worker de Cloudflare.',
      navHome: 'Inicio',
      navUseCases: 'Casos de uso',
      navStarter: 'Guía',
      navNotes: 'Poster Editor',
      openEditor: 'Abrir editor',
      featureLauncher: 'Funciones',
      featureMenuDescription: 'Jump between the main product areas from one place.',
      featureGroupCore: 'Principal',
      featureGroupMore: 'Más',
      themeLabel: 'Tema',
      themeLight: 'Claro',
      themeDark: 'Oscuro',
      themeSystem: 'Sistema',
      languageLabel: 'Idioma',
      mobileMenuOpenLabel: 'Abrir menú de navegación',
      mobileMenuDescription: 'Abre el editor, revisa los casos de uso y cambia idioma o tema.',
    },
    home: {
      metadataTitle: 'An editor where your writing does not get lost',
      metadataDescription:
        'Editor local-first with autosave, version history, restore, and share-image export.',
      metadataKeywords: ['editor de texto', 'autoguardado', 'historial de versiones', 'local-first', 'imagen para compartir'],
      eyebrow: 'Espacio de escritura local-first',
      title: 'Escribe sin preguntarte si el texto seguirá ahí después.',
      description:
        'Un editor pensado para borradores, notas y texto en revisión, con autoguardado, historial de versiones y exportación a imagen en un mismo flujo.',
      primaryCardTitle: 'Abrir el editor',
      primaryCardDescription:
        'Empieza en texto plano o Markdown, conserva el estado actual automáticamente y vuelve a versiones anteriores cuando haga falta.',
      primaryCardCta: 'Abrir editor',
      primaryCardTags: ['Autoguardado', 'Historial', 'Local-first'],
      secondaryCardTitle: 'Ver casos de uso',
      secondaryCardDescription:
        'Descubre cómo encaja en borradores de artículos, notas, captions sociales y exportación visual.',
      secondaryCardCta: 'Casos de uso',
      detailCards: [
        {
          title: 'Historial de versiones',
          description: 'Snapshots automáticos y hitos manuales te permiten restaurar cambios con claridad.',
        },
        {
          title: 'Local-first',
          description: 'El borrador permanece en este navegador salvo que decidas exportarlo.',
        },
        {
          title: 'Exportación a imagen',
          description: 'Convierte el texto final en una imagen pulida sin reconstruirlo en otra herramienta.',
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
    useCases: {
      metadataTitle: 'A writing editor where your text does not get lost',
      metadataDescription:
        'Local-first writing editor with autosave, version history, rollback, and share-image export for drafts, notes, and social copy.',
      eyebrow: 'Editor local-first',
      title: 'A writing editor where your text does not get lost',
      description:
        'Use it for drafts, notes, and evolving copy. Autosave protects the latest state, version history lets you restore changes, and image export helps you share the final result.',
      primaryCta: 'Open editor',
      secondaryCta: 'View use cases',
      proofItems: [
        {
          title: 'Autosave in browser',
          description: 'Your latest draft stays on this device while you write.',
        },
        {
          title: 'Version history',
          description: 'Automatic snapshots and milestones give you a reliable recovery path.',
        },
        {
          title: 'Share-image export',
          description: 'Export finished writing as an image without rebuilding it elsewhere.',
        },
      ],
      problemTitle: 'Made for writing that keeps changing',
      problemDescription:
        'Instead of treating writing like disposable input, this editor is built for revision, recovery, and final output.',
      valueItems: [
        {
          title: 'Autosave without friction',
          description: 'Start writing immediately and keep the current state locally.',
        },
        {
          title: 'Useful version recovery',
          description: 'Save milestones, compare edits, and restore earlier versions when needed.',
        },
        {
          title: 'Plain text and Markdown',
          description: 'Draft quickly in plain text or switch to Markdown when structure matters.',
        },
        {
          title: 'Write once, export later',
          description: 'Turn the same writing into a polished share image when it is ready.',
        },
      ],
      useCasesTitle: 'Common use cases',
      useCasesDescription: 'Useful for writing workflows that move through many iterations before publishing.',
      useCaseItems: [
        {
          title: 'Article drafts',
          description: 'Keep stable checkpoints while long-form structure keeps changing.',
        },
        {
          title: 'Notes and research',
          description: 'Capture rough ideas first and clean them up later without losing them.',
        },
        {
          title: 'Social captions and campaign copy',
          description: 'Test variations, keep milestones, and export the final wording as an image.',
        },
        {
          title: 'Milestone tracking',
          description: 'Save important versions before major rewrites and restore them if needed.',
        },
        {
          title: 'Share-image creation',
          description: 'Generate visual output directly from finished text.',
        },
        {
          title: 'Reliable local workspace',
          description: 'Keep important writing close to you and easy to recover.',
        },
      ],
      comparisonTitle: 'How it differs from ordinary tools',
      comparisonDescription: 'It is not only a text field and not only an image template tool.',
      comparisonItems: [
        {
          title: 'Safer than a basic editor',
          description: 'Autosave and history reduce the damage from refreshes or mistakes.',
        },
        {
          title: 'More focused than a broad note app',
          description: 'Writing, history, and export stay in one direct workflow.',
        },
        {
          title: 'More practical than design-first apps',
          description: 'You finish the writing first, then export from the same source.',
        },
      ],
      faqTitle: 'FAQ',
      faqDescription: 'The main questions people ask before trusting a writing tool.',
      faqs: [
        {
          question: 'Does it save automatically?',
          answer: 'Yes. Your current draft is saved locally in the browser.',
        },
        {
          question: 'Can I restore older versions?',
          answer: 'Yes. Automatic snapshots and milestones can be restored later.',
        },
        {
          question: 'Do I need to upload my text?',
          answer: 'No. The editor is local-first unless you choose to export.',
        },
        {
          question: 'Does it support Markdown and plain text?',
          answer: 'Yes. You can switch between both modes.',
        },
        {
          question: 'Can I export an image?',
          answer: 'Yes. Final writing can be exported as a share image.',
        },
      ],
      ctaTitle: 'Keep the writing safe first',
      ctaDescription: 'Protect the text while it evolves, then decide how to publish or share it.',
      ctaPrimary: 'Start writing',
      ctaSecondary: 'Jump to FAQ',
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
      exportMenu: 'Export',
      exportHtml: 'Export HTML',
      exportImage: 'Export PNG',
      exportJpeg: 'Export JPEG',
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
      versionKindResetBackup: 'Reset Backup',
      resetSuccess: 'Content reset to default.',
      resetError: 'Failed to reset.',
      resetNote: 'Reset Content',
      resetConfirmTitle: 'Are you sure?',
      resetConfirmDescription: 'This will clear the current content and create a backup. Continue?',
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
      fontSizeLabel: 'Body size',
      fontSizeSmall: 'Small',
      fontSizeMedium: 'Medium',
      fontSizeLarge: 'Large',
      exportTemplateLabel: 'Template',
      templateSearchPlaceholder: 'Search templates',
      templateSearchEmpty: 'No matching templates.',
      templateXiaohongshu: 'Plantilla 1',
      templateSpotify: 'Plantilla 3',
      templateOceanQuote: 'Plantilla 4',
      templateCalendarEssay: 'Plantilla 5',
      templateEditorialCard: 'Editorial Card',
      templateCinemaBook: 'Cinema',
      templateCodeSnippet: 'Kernel',
      templateTicketStub: 'Entry',
      templateZenVertical: 'Zen',
      templateNewsFlash: 'Herald',
      templatePolaroid: 'Polaroid',
      templateLiterature: 'Literature',
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
      exportHtmlSuccess: 'HTML file exported.',
      exportJpegSuccess: 'JPEG image exported.',
      exportImageError: 'Could not export PNG images.',
      exportHtmlError: 'Could not export HTML file.',
      exportJpegError: 'Could not export JPEG image.',
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
      siteName: 'MintyHub',
      siteTagline: '多言語対応のフルスタック開発向けに再利用できる monorepo テンプレートです。',
      siteDescription: '多言語 Next.js フロントエンドと Cloudflare Worker API を備えたテンプレートです。',
      navHome: 'ホーム',
      navUseCases: '利用シーン',
      navStarter: 'ガイド',
      navNotes: 'Poster Editor',
      openEditor: 'エディタを開く',
      featureLauncher: '機能',
      featureMenuDescription: '主な機能への移動先を 1 か所にまとめています。',
      featureGroupCore: '主要機能',
      featureGroupMore: 'その他',
      themeLabel: 'テーマ',
      themeLight: 'ライト',
      themeDark: 'ダーク',
      themeSystem: 'システム',
      languageLabel: '言語',
      mobileMenuOpenLabel: 'ナビゲーションメニューを開く',
      mobileMenuDescription: 'エディタを開き、利用シーンを確認し、言語とテーマを切り替えます。',
    },
    home: {
      metadataTitle: '書いた内容が消えにくいテキストエディタ',
      metadataDescription:
        'ローカルファーストで、自動保存、履歴、復元、共有画像の書き出しに対応したテキストエディタです。',
      metadataKeywords: ['テキストエディタ', '自動保存', '履歴', 'ローカルファースト', '共有画像'],
      eyebrow: 'ローカルファーストの執筆環境',
      title: '書いたあとで、内容が残っているかを気にしなくていい。',
      description:
        '下書き、メモ、推敲中の文章を 1 つの場所で扱えるエディタです。自動保存、履歴、共有画像への書き出しまでつながっています。',
      primaryCardTitle: 'エディタを開く',
      primaryCardDescription:
        'プレーンテキストでも Markdown でも始められ、現在の状態は自動保存され、必要なら前の版へ戻れます。',
      primaryCardCta: 'エディタを開く',
      primaryCardTags: ['自動保存', '履歴', 'ローカルファースト'],
      secondaryCardTitle: '利用シーンを見る',
      secondaryCardDescription:
        '記事の下書き、メモ、SNS 向けコピー、共有画像の書き出しまで、具体的な使い方を確認できます。',
      secondaryCardCta: '利用シーン',
      detailCards: [
        {
          title: '履歴管理',
          description: '自動スナップショットと手動マイルストーンで、戻りたい地点を残せます。',
        },
        {
          title: 'ローカルファースト',
          description: '書いた内容は、明示的に書き出すまでこのブラウザ内に残ります。',
        },
        {
          title: '共有画像',
          description: '仕上がった文章を、別のツールへ移さずに画像として出力できます。',
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
    useCases: {
      metadataTitle: '書いた内容が消えにくいテキストエディタ',
      metadataDescription:
        '下書き、メモ、文章の推敲に向いたローカルファーストのエディタ。自動保存、履歴、復元、共有画像の書き出しに対応しています。',
      eyebrow: 'ローカルファーストエディタ',
      title: '書いた内容が消えにくいテキストエディタ',
      description:
        '下書き、メモ、SNS 用の文章を 1 か所で扱えます。自動保存で最新の状態を守り、履歴で過去の版に戻せて、仕上がったら共有画像として書き出せます。',
      primaryCta: 'エディタを開く',
      secondaryCta: '利用シーンを見る',
      proofItems: [
        {
          title: 'ブラウザ内で自動保存',
          description: '書いている内容はこの端末にローカル保存されます。',
        },
        {
          title: '復元できる履歴',
          description: '自動スナップショットと手動マイルストーンから以前の状態を戻せます。',
        },
        {
          title: '共有画像として書き出し',
          description: '完成した文章を別ツールなしで画像化できます。',
        },
      ],
      problemTitle: '何度も書き直す作業に向いています',
      problemDescription:
        '使い捨ての入力欄ではなく、推敲、比較、復元まで含めた実務的なライティングの流れを前提にしています。',
      valueItems: [
        {
          title: '登録なしでも自動保存',
          description: 'すぐに書き始められて、最新状態はローカルに残ります。',
        },
        {
          title: '実用的な版管理',
          description: '自動保存と手動保存の両方で、戻りやすい編集履歴を作れます。',
        },
        {
          title: 'プレーンテキストと Markdown',
          description: '素早く下書きしたい時はプレーンテキスト、構造化したい時は Markdown を使えます。',
        },
        {
          title: '書いてから共有画像へ',
          description: '本文を固めたあと、同じ内容から共有画像を書き出せます。',
        },
      ],
      useCasesTitle: '主な利用シーン',
      useCasesDescription: '何度も修正しながら最後に共有するタイプの文章に向いています。',
      useCaseItems: [
        {
          title: '記事の下書き',
          description: '構成を変えながらも、重要な版を残しておけます。',
        },
        {
          title: 'メモや調査ノート',
          description: '粗いアイデアを先に残し、あとから整理できます。',
        },
        {
          title: 'SNS 用キャプションやコピー',
          description: '複数案を試し、最終版を画像として書き出せます。',
        },
        {
          title: '節目ごとの保存',
          description: '大きな修正前に版を固定し、必要ならすぐ戻せます。',
        },
        {
          title: '共有画像の作成',
          description: '仕上げた文章をそのまま視覚的なアウトプットに変えられます。',
        },
        {
          title: '信頼できるローカル作業場',
          description: '失いたくない文章を手元で扱いやすく保てます。',
        },
      ],
      comparisonTitle: '一般的なツールとの違い',
      comparisonDescription: '単なる入力欄でも、画像テンプレート専用ツールでもありません。',
      comparisonItems: [
        {
          title: '普通の入力欄より安全',
          description: '自動保存と履歴復元で、更新や操作ミスのダメージを減らせます。',
        },
        {
          title: '汎用ノートアプリより集中しやすい',
          description: '執筆、履歴、書き出しが 1 つの流れにまとまっています。',
        },
        {
          title: 'デザイン先行ツールより実務的',
          description: 'まず文章を固め、その後に同じ内容から画像を書き出します。',
        },
      ],
      faqTitle: 'FAQ',
      faqDescription: '実際に使い始める前によく確認される点をまとめています。',
      faqs: [
        {
          question: '自動保存されますか？',
          answer: 'はい。編集中の内容はブラウザ内に自動保存されます。',
        },
        {
          question: '以前の版に戻せますか？',
          answer: 'はい。自動スナップショットと手動マイルストーンを復元できます。',
        },
        {
          question: '文章をサーバーにアップロードする必要はありますか？',
          answer: 'いいえ。基本はローカルファーストで、書き出す時だけ外に出します。',
        },
        {
          question: 'Markdown とプレーンテキストの両方に対応していますか？',
          answer: 'はい。書き方に合わせて切り替えられます。',
        },
        {
          question: '最終結果を画像として書き出せますか？',
          answer: 'はい。完成した文章を共有画像として書き出せます。',
        },
      ],
      ctaTitle: 'まずは文章を安全に書くことから',
      ctaDescription: '内容が固まるまでは文章を守り、共有や公開はそのあとで決められます。',
      ctaPrimary: '書き始める',
      ctaSecondary: 'FAQ へ移動',
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
      exportMenu: '書き出す',
      exportHtml: 'HTML を書き出す',
      exportImage: 'PNG を書き出す',
      exportJpeg: 'JPEG を書き出す',
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
      versionKindResetBackup: 'Reset Backup',
      resetSuccess: 'Content reset to default.',
      resetError: 'Failed to reset.',
      resetNote: 'Reset Content',
      resetConfirmTitle: 'Are you sure?',
      resetConfirmDescription: 'This will clear the current content and create a backup. Continue?',
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
      fontSizeLabel: '本文サイズ',
      fontSizeSmall: '小',
      fontSizeMedium: '中',
      fontSizeLarge: '大',
      exportTemplateLabel: 'テンプレート',
      templateSearchPlaceholder: 'テンプレートを検索',
      templateSearchEmpty: '一致するテンプレートはありません。',
      templateXiaohongshu: 'テンプレート 1',
      templateSpotify: 'テンプレート 3',
      templateOceanQuote: 'テンプレート 4',
      templateCalendarEssay: 'テンプレート 5',
      templateEditorialCard: 'Editorial Card',
      templateCinemaBook: 'Cinema',
      templateCodeSnippet: 'Kernel',
      templateTicketStub: 'Entry',
      templateZenVertical: 'Zen',
      templateNewsFlash: 'Herald',
      templatePolaroid: 'Polaroid',
      templateLiterature: 'Literature',
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
      importSuccess: 'ファイルを読み込み、直前の状态をバックアップしました。',
      exportMarkdownSuccess: 'Markdown を書き出しました。',
      exportTextSuccess: 'テキストを書き出しました。',
      exportHtmlSuccess: 'HTML を書き出しました。',
      exportJpegSuccess: 'JPEG を書き出しました。',
      exportImageError: 'PNG の書き出しに失敗しました。',
      exportHtmlError: 'HTML の書き出しに失敗しました。',
      exportJpegError: 'JPEG の書き出しに失敗しました。',
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
