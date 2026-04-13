import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { getHtmlLang } from '@/i18n/locale-meta';
import { createMarketingMetadata } from '@/lib/seo/marketing-metadata';
import { toAbsoluteUrl } from '@/lib/seo/site-origin';

export const LINKDISK_BASE_PATH = '/linkdisk';
export const USE_CASES_PAGE_SLUG = 'use-cases';
export const LINKDISK_USE_CASES_PATH = `${LINKDISK_BASE_PATH}/${USE_CASES_PAGE_SLUG}`;
export const INDEXABLE_LOCALIZED_PATHS = [LINKDISK_BASE_PATH, LINKDISK_USE_CASES_PATH] as const;

interface MarketingPageFaq {
  answer: string;
  question: string;
}

interface UseCasesPageCopy {
  ctaDescription: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTitle: string;
  benefits: Array<{
    description: string;
    title: string;
  }>;
  description: string;
  eyebrow: string;
  faqDescription: string;
  faqTitle: string;
  faqs: MarketingPageFaq[];
  metadataDescription: string;
  metadataTitle: string;
  primaryCta: string;
  problemDescription: string;
  problemTitle: string;
  scenariosDescription: string;
  scenarios: Array<{
    description: string;
    title: string;
  }>;
  secondaryCta: string;
  strengthsDescription: string;
  scenariosTitle: string;
  strengthsTitle: string;
  title: string;
}

const HOME_FEATURES = [
  'Anonymous text and file sharing',
  'Password protection and expiry rules',
  'QR codes, share links, and 8-digit share codes',
];

const USE_CASES_PAGE_COPY: Record<Locale, UseCasesPageCopy> = {
  en: {
    metadataTitle: 'Why LinkDisk: Anonymous Sharing, Flexible Controls, Large Attachments',
    metadataDescription:
      'See why LinkDisk fits anonymous text and file sharing: no sign-in required, flexible share settings, and support for larger attachments.',
    eyebrow: 'Anonymous sharing workflow',
    title: 'Explore LinkDisk use cases',
    description:
      'LinkDisk works well when you want to share text or files quickly without login, keep control over how the link is opened, and send larger attachments in the same share.',
    primaryCta: 'Open LinkDisk',
    secondaryCta: 'See use cases',
    problemTitle: 'Built for fast sharing without account friction',
    problemDescription:
      'Instead of forcing every share into a login flow or a plain link, LinkDisk gives you one place to send text, files, and access rules together.',
    strengthsTitle: 'Why people use LinkDisk',
    strengthsDescription:
      'These strengths matter when you need a share flow that is quick to create but still controlled once it leaves your hands.',
    benefits: [
      {
        title: 'No sign-in required',
        description: 'You can create a share quickly without creating an account or asking the recipient to join a system first.',
      },
      {
        title: 'Flexible sharing controls',
        description: 'Use passwords, expiry time, maximum views, QR codes, and share codes instead of sending one uncontrolled link.',
      },
      {
        title: 'Works for large attachments',
        description: 'It is useful not only for short text, but also for larger files such as archives, design assets, and project materials.',
      },
    ],
    scenariosTitle: 'Common situations',
    scenariosDescription: 'LinkDisk fits short-lived sharing workflows where speed, control, and attachments need to work together.',
    scenarios: [
      {
        title: 'Move content between devices',
        description: 'Write something on desktop and open it on mobile without emailing yourself or opening another app.',
      },
      {
        title: 'Send files with context',
        description: 'Put text instructions and attachments into the same share so the recipient sees both in one place.',
      },
      {
        title: 'Share with external people',
        description: 'Clients, partners, and testers can open the share directly without registering first.',
      },
      {
        title: 'Limit how long the share stays open',
        description: 'Add passwords, expiry time, or maximum views when the content should not stay available forever.',
      },
      {
        title: 'Send larger attachment bundles',
        description: 'Use the same share flow for larger files when plain text tools are no longer enough.',
      },
    ],
    faqTitle: 'FAQ',
    faqDescription: 'The core questions people usually ask before using LinkDisk for real sharing workflows.',
    faqs: [
      {
        question: 'Do I need an account to create a share?',
        answer: 'No. LinkDisk is designed for quick anonymous sharing without a required login flow.',
      },
      {
        question: 'Does the recipient need to sign in?',
        answer: 'No. They can open the share with a link, QR code, or share code.',
      },
      {
        question: 'Can I add a password?',
        answer: 'Yes. You can protect a share with a password before the content is shown.',
      },
      {
        question: 'Can I set an expiration time or limit views?',
        answer: 'Yes. You can control how long the share stays available and how many times it can be opened.',
      },
      {
        question: 'Can I share text and attachments together?',
        answer: 'Yes. A single share can include both text content and downloadable files.',
      },
      {
        question: 'Does it support large attachments?',
        answer: 'Yes. LinkDisk is suitable for larger attachments as well as short text sharing.',
      },
    ],
    ctaTitle: 'Share quickly without giving up control',
    ctaDescription:
      'Start with one share link for text and files, then add passwords, expiry, and view limits only when the situation calls for them.',
    ctaPrimary: 'Open LinkDisk',
    ctaSecondary: 'Jump to FAQ',
  },
  zh: {
    metadataTitle: '为什么用 LinkDisk：匿名分享、灵活设置、支持大附件',
    metadataDescription:
      '了解 LinkDisk 为什么适合匿名分享文本和文件：无需登录即可发送，支持密码、过期时间、访问次数等设置，也适合发送较大的附件。',
    eyebrow: '匿名分享工作流',
    title: '无需登录、即用即走的匿名分享工具',
    description:
      'LinkDisk 适合临时分享文本和文件。你不需要登录，就可以直接生成分享链接；也可以按需要设置密码、过期时间、访问次数等规则，并支持带上大附件一起发送。',
    primaryCta: '打开 LinkDisk',
    secondaryCta: '查看使用场景',
    problemTitle: '为“快速分享但仍要可控”而设计',
    problemDescription:
      '它不是只能发一个裸链接，也不是必须先登录再走完流程。LinkDisk 把文本、附件和访问规则放进同一条分享链路里。',
    strengthsTitle: '为什么这些分享场景更适合 LinkDisk',
    strengthsDescription: '当你既想发得快，又不想把内容完全失控地丢出去时，这些能力会更有价值。',
    benefits: [
      {
        title: '不用登录，发起来更快',
        description: '不需要注册账号，也不需要让对方先进入系统。写好内容、上传附件、生成链接，对方拿到就能打开。',
      },
      {
        title: '分享设置更灵活',
        description: '不只是发一个链接。你可以根据场景设置访问密码、过期时间、最大访问次数，也可以通过二维码或分享码让对方打开内容。',
      },
      {
        title: '不只是发文字，也支持大附件',
        description: '除了临时文本，你也可以把较大的附件一起放进分享里。适合发送压缩包、资料、设计文件、测试包等内容。',
      },
    ],
    scenariosTitle: '常见使用场景',
    scenariosDescription: '适合短期分享、跨设备传递、外部协作，以及需要同时处理文本、附件和访问控制的场景。',
    scenarios: [
      {
        title: '跨设备传内容',
        description: '在电脑上写好内容，直接发到手机打开，或者把手机上的内容发到另一台设备查看。',
      },
      {
        title: '发给外部人员',
        description: '发给客户、合作方、测试人员时，不需要他们先注册账号，直接用链接或分享码就能访问。',
      },
      {
        title: '需要限制访问的分享',
        description: '有些内容不适合长期公开，这时可以加密码、设置过期时间，或者限制访问次数。',
      },
      {
        title: '发送较大的附件',
        description: '当你需要分享的不只是小文件，而是较大的资料、资源包或项目附件时，也可以使用同一套分享方式。',
      },
    ],
    faqTitle: '常见问题',
    faqDescription: '这是在把 LinkDisk 用到真实分享流程之前，最常被问到的几个问题。',
    faqs: [
      {
        question: '需要注册账号才能使用吗？',
        answer: '不需要。LinkDisk 支持匿名创建和分享内容。',
      },
      {
        question: '对方需要登录才能打开吗？',
        answer: '不需要。只要拿到分享链接、二维码或分享码，就可以访问。',
      },
      {
        question: '可以设置密码吗？',
        answer: '可以。你可以为分享内容添加访问密码。',
      },
      {
        question: '可以设置过期时间吗？',
        answer: '可以。你可以控制内容在什么时间后失效。',
      },
      {
        question: '可以限制访问次数吗？',
        answer: '可以。你可以设置最大访问次数。',
      },
      {
        question: '可以同时分享文字和附件吗？',
        answer: '可以。一条分享里可以同时包含文本内容和附件。',
      },
      {
        question: '支持大附件吗？',
        answer: '支持。除了文本和小文件，也适合分享较大的附件内容。',
      },
    ],
    ctaTitle: '先把内容快速发出去，再决定限制规则',
    ctaDescription: '同一条分享既能承载文本和附件，也能按需要补上密码、过期时间和访问次数控制。',
    ctaPrimary: '打开 LinkDisk',
    ctaSecondary: '跳到常见问题',
  },
  es: {
    metadataTitle: 'Por que LinkDisk: compartidos anonimos, controles flexibles y adjuntos grandes',
    metadataDescription:
      'Descubre por que LinkDisk encaja para compartir texto y archivos sin login, con controles flexibles y soporte para adjuntos mas grandes.',
    eyebrow: 'Flujo de compartidos anonimos',
    title: 'Casos de uso',
    description:
      'LinkDisk sirve para compartir texto y archivos de forma rapida. No hace falta iniciar sesion, puedes controlar como se abre cada compartido y tambien enviar adjuntos mas grandes.',
    primaryCta: 'Abrir LinkDisk',
    secondaryCta: 'Ver casos de uso',
    problemTitle: 'Pensado para compartir rapido sin friccion de cuenta',
    problemDescription:
      'En lugar de obligarte a pasar por un login o mandar un enlace sin control, LinkDisk te deja compartir texto, archivos y reglas de acceso en el mismo flujo.',
    strengthsTitle: 'Por que usar LinkDisk',
    strengthsDescription:
      'Estas ventajas importan cuando necesitas compartir rapido pero sin perder el control una vez que el enlace ya esta fuera.',
    benefits: [
      {
        title: 'Sin login obligatorio',
        description: 'Puedes crear un compartido sin registro y el destinatario puede abrirlo sin entrar en otro sistema.',
      },
      {
        title: 'Mas control sobre cada enlace',
        description: 'Contrasena, expiracion, limite de vistas, QR y codigo de compartir te dan mas control que un enlace simple.',
      },
      {
        title: 'Tambien sirve para adjuntos grandes',
        description: 'Ademas de texto corto, LinkDisk encaja para paquetes, recursos y materiales de proyecto mas grandes.',
      },
    ],
    scenariosTitle: 'Situaciones comunes',
    scenariosDescription: 'Encaja en flujos de compartido temporales donde velocidad, control y adjuntos deben funcionar juntos.',
    scenarios: [
      {
        title: 'Mover contenido entre dispositivos',
        description: 'Escribe algo en el ordenador y abrelo en el movil sin mandarte mensajes.',
      },
      {
        title: 'Enviar archivos con contexto',
        description: 'Pon instrucciones en texto y adjuntos en el mismo compartido.',
      },
      {
        title: 'Compartir con personas externas',
        description: 'Clientes, partners o testers pueden abrir el contenido sin registrarse.',
      },
      {
        title: 'Limitar el acceso',
        description: 'Usa contrasena, expiracion o limite de vistas cuando el contenido no debe quedar abierto para siempre.',
      },
      {
        title: 'Enviar adjuntos mas grandes',
        description: 'Usa el mismo flujo cuando un portapapeles de texto ya no es suficiente.',
      },
    ],
    faqTitle: 'Preguntas frecuentes',
    faqDescription: 'Las preguntas principales que suelen aparecer antes de usar LinkDisk en un flujo real de compartidos.',
    faqs: [
      {
        question: 'Necesito una cuenta para crear un compartido?',
        answer: 'No. LinkDisk esta pensado para compartir de forma rapida y anonima.',
      },
      {
        question: 'La otra persona necesita iniciar sesion?',
        answer: 'No. Puede abrir el compartido con un enlace, QR o codigo.',
      },
      {
        question: 'Puedo anadir contrasena?',
        answer: 'Si. Puedes proteger el contenido antes de mostrarlo.',
      },
      {
        question: 'Puedo poner expiracion o limite de vistas?',
        answer: 'Si. Puedes controlar cuanto tiempo sigue disponible y cuantas veces se abre.',
      },
      {
        question: 'Puedo compartir texto y adjuntos juntos?',
        answer: 'Si. Un mismo compartido puede incluir texto y archivos descargables.',
      },
      {
        question: 'Soporta adjuntos grandes?',
        answer: 'Si. LinkDisk tambien encaja para adjuntos mas grandes.',
      },
    ],
    ctaTitle: 'Comparte rapido sin renunciar al control',
    ctaDescription:
      'Empieza con un solo compartido para texto y archivos, y anade contrasena, expiracion o limite de vistas solo cuando el caso lo pida.',
    ctaPrimary: 'Abrir LinkDisk',
    ctaSecondary: 'Ir a FAQ',
  },
  ja: {
    metadataTitle: 'なぜ LinkDisk か：匿名共有、柔軟な設定、大きめ添付',
    metadataDescription:
      'LinkDisk が匿名でのテキスト・ファイル共有に向く理由を確認できます。ログイン不要、柔軟な共有設定、大きめ添付に対応します。',
    eyebrow: '匿名共有ワークフロー',
    title: '利用シーン',
    description:
      'LinkDisk はテキストやファイルをすばやく共有したいときに向いています。ログイン不要で共有でき、共有ごとに公開方法を調整でき、大きめの添付ファイルにも対応します。',
    primaryCta: 'LinkDisk を開く',
    secondaryCta: '利用シーンを見る',
    problemTitle: 'アカウント前提にしない高速共有向け',
    problemDescription:
      'ログイン必須のフローや無制限のただのリンクではなく、LinkDisk は本文、添付、公開ルールを同じ共有にまとめられます。',
    strengthsTitle: 'LinkDisk が使いやすい理由',
    strengthsDescription: '素早く共有したい一方で、リンクを渡した後の公開条件もきちんと管理したい場面で役立ちます。',
    benefits: [
      {
        title: 'ログインなしですぐ共有',
        description: 'アカウント作成なしで共有を作れます。受け取り側にも別システムへの参加を求めません。',
      },
      {
        title: '共有設定を細かく調整',
        description: 'パスワード、有効期限、閲覧回数、QR、共有コードで単純なリンク以上の制御ができます。',
      },
      {
        title: '大きめの添付ファイルにも対応',
        description: '短いテキストだけでなく、資料、アーカイブ、プロジェクト添付の共有にも向いています。',
      },
    ],
    scenariosTitle: 'よくある利用シーン',
    scenariosDescription: '速度、公開制御、添付ファイルを同時に扱いたい短期共有のワークフローに向いています。',
    scenarios: [
      {
        title: '端末間で内容を渡す',
        description: 'PC で作った内容をスマートフォンで開きたいときに向いています。',
      },
      {
        title: '説明付きでファイルを送る',
        description: '本文の説明と添付ファイルを同じ共有にまとめられます。',
      },
      {
        title: '外部の相手に送る',
        description: '顧客や協力会社、テスターに登録なしで共有を渡せます。',
      },
      {
        title: 'アクセスを制限したい',
        description: 'パスワードや有効期限、閲覧回数制限で公開範囲を調整できます。',
      },
      {
        title: '大きめの添付を送りたい',
        description: 'テキスト中心のツールでは足りない場面でも同じ流れで共有できます。',
      },
    ],
    faqTitle: 'FAQ',
    faqDescription: 'LinkDisk を実際の共有フローで使う前によく確認される基本的な質問をまとめています。',
    faqs: [
      {
        question: '共有を作るのにアカウントは必要ですか？',
        answer: 'いいえ。LinkDisk はログイン不要の匿名共有向けです。',
      },
      {
        question: '受け取り側もログインが必要ですか？',
        answer: 'いいえ。リンク、QR、共有コードで開けます。',
      },
      {
        question: 'パスワードを付けられますか？',
        answer: 'はい。表示前にパスワード確認を入れられます。',
      },
      {
        question: '有効期限や閲覧回数制限を設定できますか？',
        answer: 'はい。共有の公開期間や閲覧回数を制御できます。',
      },
      {
        question: '本文と添付を一緒に共有できますか？',
        answer: 'はい。1 つの共有にテキストとファイルを含められます。',
      },
      {
        question: '大きめの添付ファイルにも対応しますか？',
        answer: 'はい。LinkDisk は大きめの添付共有にも向いています。',
      },
    ],
    ctaTitle: 'まずは素早く共有し、必要ならあとから制御する',
    ctaDescription:
      '本文と添付を 1 つの共有にまとめ、必要な場面だけパスワード、有効期限、閲覧回数制限を追加できます。',
    ctaPrimary: 'LinkDisk を開く',
    ctaSecondary: 'FAQ へ移動',
  },
};

export function getUseCasesPageCopy(locale: Locale) {
  return USE_CASES_PAGE_COPY[locale];
}

export function createUseCasesPageMetadata(locale: Locale): Metadata {
  const copy = getUseCasesPageCopy(locale);

  return createMarketingMetadata({
    locale,
    pathname: LINKDISK_USE_CASES_PATH,
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    siteName: 'LinkDisk',
  });
}

export function buildHomeSeoGraph(locale: Locale) {
  const htmlLang = getHtmlLang(locale);
  const pageUrl = toAbsoluteUrl(`/${locale}${LINKDISK_BASE_PATH}`);
  const siteUrl = toAbsoluteUrl('/');

  return [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: 'LinkDisk',
      inLanguage: htmlLang,
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${pageUrl}#app`,
      name: 'LinkDisk',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: pageUrl,
      description: 'Online clipboard for temporary text and file sharing without login.',
      inLanguage: htmlLang,
      featureList: HOME_FEATURES,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: 'LinkDisk',
      isPartOf: {
        '@id': `${siteUrl}#website`,
      },
      about: {
        '@id': `${pageUrl}#app`,
      },
      inLanguage: htmlLang,
    },
  ];
}

export function buildUseCasesPageSeoGraph(locale: Locale) {
  const htmlLang = getHtmlLang(locale);
  const pageUrl = toAbsoluteUrl(`/${locale}${LINKDISK_USE_CASES_PATH}`);
  const siteUrl = toAbsoluteUrl('/');
  const copy = getUseCasesPageCopy(locale);

  return [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: 'LinkDisk',
      inLanguage: htmlLang,
    },
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: copy.metadataTitle,
      description: copy.metadataDescription,
      isPartOf: {
        '@id': `${siteUrl}#website`,
      },
      inLanguage: htmlLang,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'LinkDisk',
          item: toAbsoluteUrl(`/${locale}${LINKDISK_BASE_PATH}`),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: copy.metadataTitle,
          item: pageUrl,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      inLanguage: htmlLang,
      mainEntity: copy.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];
}
