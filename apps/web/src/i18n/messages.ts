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
    formTitle: string;
    formDescription: string;
    formLabel: string;
    formPlaceholder: string;
    submit: string;
    submitting: string;
    refresh: string;
    listTitle: string;
    listDescription: string;
    loading: string;
    emptyState: string;
    delete: string;
    deleting: string;
    createdAtLabel: string;
    updatedAtLabel: string;
    errorTitle: string;
    errorList: string;
    errorCreate: string;
    errorDelete: string;
    emptyValidation: string;
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
      navNotes: 'Notes Example',
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
      primaryCta: 'Open Notes Example',
      secondaryCta: 'Read Starter Guide',
      stackTitle: 'What stays in the template',
      stackDescription: 'The project keeps the infrastructure layer and removes product-specific workflows.',
      stackItems: [
        'Next.js app router with locale-prefixed routes',
        'Theme switcher and reusable UI primitives',
        'Hono API with OpenAPI JSON and Scalar docs',
        'D1 integration through a single notes example',
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
          description: 'Notes routes show how to connect the frontend, Worker, and D1 without carrying old domain logic.',
        },
      ],
    },
    starter: {
      metadataTitle: 'Starter Guide',
      metadataDescription: 'Overview of the retained template structure for the web app and API worker.',
      title: 'Starter Guide',
      description: 'Use this scaffold as the first stable layer for a new product. Replace the notes example, expand the shared package, and add domain modules where they belong.',
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
        'Swap the notes example for your real first domain module.',
        'Add auth, background jobs, or storage only when a product need exists.',
      ],
    },
    notes: {
      metadataTitle: 'Notes Example',
      metadataDescription: 'Minimal end-to-end D1 example powered by the starter API.',
      title: 'Notes Example',
      description: 'This page demonstrates the smallest useful full-stack loop in the template: create a record, read it back from D1, and delete it again.',
      formTitle: 'Create note',
      formDescription: 'Submit a short title to store a note through the Worker API.',
      formLabel: 'Title',
      formPlaceholder: 'Write a short note title',
      submit: 'Create note',
      submitting: 'Creating…',
      refresh: 'Refresh',
      listTitle: 'Saved notes',
      listDescription: 'Each row comes from the D1-backed `/api/notes` endpoint.',
      loading: 'Loading notes…',
      emptyState: 'No notes yet. Create one to verify the end-to-end setup.',
      delete: 'Delete',
      deleting: 'Deleting…',
      createdAtLabel: 'Created',
      updatedAtLabel: 'Updated',
      errorTitle: 'Request failed',
      errorList: 'Could not load notes.',
      errorCreate: 'Could not create the note.',
      errorDelete: 'Could not delete the note.',
      emptyValidation: 'Enter a title before submitting.',
    },
  },
  zh: {
    common: {
      siteName: 'CF Monorepo Template',
      siteTagline: '适合本地化全栈项目的通用 monorepo 模板。',
      siteDescription: '内置多语言 Next.js 前端和 Cloudflare Worker API 模板。',
      navHome: '首页',
      navStarter: '模板说明',
      navNotes: 'Notes 示例',
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
      primaryCta: '打开 Notes 示例',
      secondaryCta: '查看模板说明',
      stackTitle: '模板保留内容',
      stackDescription: '保留基础设施，移除产品特定流程。',
      stackItems: [
        '带 locale 前缀的 Next.js App Router',
        '主题切换和可复用 UI primitives',
        '带 OpenAPI JSON 与 Scalar 文档的 Hono API',
        '通过 Notes 示例演示 D1 集成',
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
          description: 'Notes 路由展示前端、Worker 和 D1 的最小联通方式，不带旧业务包袱。',
        },
      ],
    },
    starter: {
      metadataTitle: '模板说明',
      metadataDescription: '概览当前模板中保留下来的 Web 和 API 结构。',
      title: '模板说明',
      description: '这个骨架适合作为新产品的第一层稳定基础。后续你可以替换 Notes 示例、扩展 shared 包，并按业务域拆出自己的模块。',
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
        '把 Notes 示例换成你的第一个真实业务模块。',
        '只有在产品确实需要时，再引入鉴权、后台任务或对象存储。',
      ],
    },
    notes: {
      metadataTitle: 'Notes 示例',
      metadataDescription: '一个由 starter API 驱动的最小 D1 全栈示例。',
      title: 'Notes 示例',
      description: '这个页面演示模板里最小但完整的全栈闭环：创建一条记录，从 D1 读出来，再删除它。',
      formTitle: '创建 note',
      formDescription: '提交一个简短标题，通过 Worker API 写入一条 note。',
      formLabel: '标题',
      formPlaceholder: '输入一个简短的 note 标题',
      submit: '创建 note',
      submitting: '创建中…',
      refresh: '刷新',
      listTitle: '已保存的 notes',
      listDescription: '下面的数据直接来自基于 D1 的 `/api/notes` 接口。',
      loading: '正在加载 notes…',
      emptyState: '还没有数据，先创建一条以验证前后端链路。',
      delete: '删除',
      deleting: '删除中…',
      createdAtLabel: '创建时间',
      updatedAtLabel: '更新时间',
      errorTitle: '请求失败',
      errorList: '加载 notes 失败。',
      errorCreate: '创建 note 失败。',
      errorDelete: '删除 note 失败。',
      emptyValidation: '提交前请先输入标题。',
    },
  },
  es: {
    common: {
      siteName: 'CF Monorepo Template',
      siteTagline: 'Monorepo reutilizable para aplicaciones full-stack con localización.',
      siteDescription: 'Plantilla con frontend Next.js localizado y API Worker de Cloudflare.',
      navHome: 'Inicio',
      navStarter: 'Guía',
      navNotes: 'Ejemplo Notes',
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
      primaryCta: 'Abrir ejemplo Notes',
      secondaryCta: 'Leer la guía',
      stackTitle: 'Qué permanece',
      stackDescription: 'Se conserva la infraestructura y se elimina la lógica específica del producto.',
      stackItems: [
        'Next.js App Router con rutas por locale',
        'Cambio de tema y componentes reutilizables',
        'API Hono con OpenAPI JSON y docs de Scalar',
        'Integración con D1 mediante un ejemplo mínimo de notes',
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
          description: 'Las rutas de notes muestran cómo unir frontend, Worker y D1 sin arrastrar la lógica anterior.',
        },
      ],
    },
    starter: {
      metadataTitle: 'Guía',
      metadataDescription: 'Resumen de la estructura web y API que se mantiene en la plantilla.',
      title: 'Guía de inicio',
      description: 'Usa este scaffold como una primera capa estable para un producto nuevo. Sustituye el ejemplo de notes, amplía el paquete compartido y añade tus módulos de dominio.',
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
        'Sustituye el ejemplo de notes por tu primer módulo real.',
        'Añade auth, jobs o storage solo cuando el producto lo necesite.',
      ],
    },
    notes: {
      metadataTitle: 'Ejemplo Notes',
      metadataDescription: 'Ejemplo mínimo de extremo a extremo con D1 y la starter API.',
      title: 'Ejemplo Notes',
      description: 'Esta página demuestra el ciclo full-stack más pequeño útil en la plantilla: crear un registro, leerlo desde D1 y volver a eliminarlo.',
      formTitle: 'Crear note',
      formDescription: 'Envía un título corto para guardar una note mediante la API Worker.',
      formLabel: 'Título',
      formPlaceholder: 'Escribe un título corto',
      submit: 'Crear note',
      submitting: 'Creando…',
      refresh: 'Actualizar',
      listTitle: 'Notes guardadas',
      listDescription: 'Cada fila viene del endpoint `/api/notes` respaldado por D1.',
      loading: 'Cargando notes…',
      emptyState: 'Todavía no hay notes. Crea una para validar la integración.',
      delete: 'Eliminar',
      deleting: 'Eliminando…',
      createdAtLabel: 'Creado',
      updatedAtLabel: 'Actualizado',
      errorTitle: 'Error en la petición',
      errorList: 'No se pudieron cargar las notes.',
      errorCreate: 'No se pudo crear la note.',
      errorDelete: 'No se pudo eliminar la note.',
      emptyValidation: 'Introduce un título antes de enviar.',
    },
  },
  ja: {
    common: {
      siteName: 'CF Monorepo Template',
      siteTagline: '多言語対応のフルスタック開発向けに再利用できる monorepo テンプレートです。',
      siteDescription: '多言語 Next.js フロントエンドと Cloudflare Worker API を備えたテンプレートです。',
      navHome: 'ホーム',
      navStarter: 'ガイド',
      navNotes: 'Notes 例',
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
      primaryCta: 'Notes 例を開く',
      secondaryCta: 'ガイドを読む',
      stackTitle: 'テンプレートに残すもの',
      stackDescription: 'インフラ層だけを保持し、製品固有のワークフローは削除します。',
      stackItems: [
        'locale プレフィックス付きの Next.js App Router',
        'テーマ切替と再利用可能な UI primitives',
        'OpenAPI JSON と Scalar docs を備えた Hono API',
        'Notes 例による D1 連携',
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
          description: 'Notes ルートは、旧ドメインロジックなしで frontend、Worker、D1 をつなぐ最小例です。',
        },
      ],
    },
    starter: {
      metadataTitle: 'ガイド',
      metadataDescription: 'テンプレートに残した Web と API の構成を確認します。',
      title: 'スターターガイド',
      description: 'この scaffold を新しい製品の最初の安定層として使ってください。Notes 例を差し替え、shared パッケージを拡張し、ドメイン単位で機能を追加していけます。',
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
        'Notes 例を最初の実ドメインモジュールへ差し替える。',
        '認証、バックグラウンド処理、ストレージは必要になってから追加する。',
      ],
    },
    notes: {
      metadataTitle: 'Notes 例',
      metadataDescription: 'starter API を使った最小の D1 エンドツーエンド例です。',
      title: 'Notes 例',
      description: 'このページでは、テンプレート内で最も小さく実用的なフルスタックの流れを示します。レコードを作成し、D1 から読み出し、再び削除します。',
      formTitle: 'note を作成',
      formDescription: '短いタイトルを送信して、Worker API 経由で note を保存します。',
      formLabel: 'タイトル',
      formPlaceholder: '短い note のタイトルを入力',
      submit: 'note を作成',
      submitting: '作成中…',
      refresh: '再読み込み',
      listTitle: '保存済み notes',
      listDescription: '各行は D1 に接続された `/api/notes` から取得しています。',
      loading: 'notes を読み込み中…',
      emptyState: 'まだ note はありません。1 件作成して接続を確認してください。',
      delete: '削除',
      deleting: '削除中…',
      createdAtLabel: '作成日時',
      updatedAtLabel: '更新日時',
      errorTitle: 'リクエスト失敗',
      errorList: 'notes を読み込めませんでした。',
      errorCreate: 'note を作成できませんでした。',
      errorDelete: 'note を削除できませんでした。',
      emptyValidation: '送信前にタイトルを入力してください。',
    },
  },
};

export function getMessages(locale: Locale): LocaleMessages {
  return MESSAGES[locale];
}
