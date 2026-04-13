import type { Locale } from '@/i18n/config';

interface LocaleMessages {
  common: {
    siteName: string;
    siteTagline: string;
    navHome: string;
    navRecent: string;
    navUseCases: string;
    navStarter: string;
    navUpload: string;
    themeLabel: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    languageLabel: string;
    accessCodeShort: string;
    accessByCode: string;
    featureLabelHome: string;
    featureDescriptionHome: string;
    mobileMenuOpenLabel: string;
    mobileMenuDescription: string;
  };
  accessDialog: {
    title: string;
    description: string;
    codeLabel: string;
    codePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    invalidCode: string;
    openFailed: string;
    unknownError: string;
    errorTitle: string;
    submit: string;
    submitting: string;
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
    foundationTitle: string;
    foundationDescription: string;
    foundationItems: string[];
    fullstackTitle: string;
    fullstackDescription: string;
    fullstackItems: string[];
    localesTitle: string;
    localesDescription: string;
    openLocale: string;
  };
  starter: {
    metadataTitle: string;
    metadataDescription: string;
    title: string;
    description: string;
    blocksTitle: string;
    blocks: string[];
    checklistTitle: string;
    checklist: string[];
  };
  upload: {
    metadataTitle: string;
    metadataDescription: string;
    title: string;
    description: string;
    apiTitle: string;
    apiDescription: string;
    hashingTitle: string;
    hashingDescription: string;
    tokenHint: string;
    apiBaseHint: string;
    workflowTitle: string;
    workflowItems: string[];
    selectFilesLabel: string;
    addFilesHint: string;
    queueTotalLabel: string;
    queuedLabel: string;
    completedLabel: string;
    failedLabel: string;
    uploading: string;
    startUpload: string;
    clearQueue: string;
    queueTitle: string;
    queueDescription: string;
    emptyQueue: string;
    speedLabel: string;
    etaLabel: string;
    completedAtLabel: string;
    sessionLabel: string;
    waitingForSessionLabel: string;
    delete: string;
    requeue: string;
    remove: string;
    recentUploadsTitle: string;
    recentUploadsDescription: string;
    clearRecentUploads: string;
    emptyRecentUploads: string;
    fileNameHeader: string;
    uploadedAtHeader: string;
    sizeHeader: string;
    actionsHeader: string;
    download: string;
    phaseQueued: string;
    phaseHashing: string;
    phaseChecking: string;
    phasePreparing: string;
    phaseUploading: string;
    phaseInstant: string;
    phaseSuccess: string;
    phaseError: string;
    phaseWaiting: string;
  };
  dashboard: {
    unknownError: string;
    emptyOverviewError: string;
    title: string;
    description: string;
    tokenPlaceholder: string;
    applyToken: string;
    emptyTokenState: string;
    metricTotalEntries: string;
    metricPublishedEntries: string;
    metricDestroyedEntries: string;
    metricDeletedEntries: string;
    metricTotalViews: string;
    metricAttachmentOpens: string;
    metricAttachmentDownloads: string;
    metricArchivedAttachments: string;
    metricFailedArchives: string;
    recentTitle: string;
    recentDescription: string;
    loadingRecent: string;
    titleHeader: string;
    statusHeader: string;
    updatedAtHeader: string;
    viewsHeader: string;
    sharePageHeader: string;
    untitled: string;
    open: string;
    emptyRecent: string;
  };
  routeMeta: {
    share: {
      title: string;
      description: string;
    };
    manage: {
      title: string;
      description: string;
    };
    recent: {
      title: string;
      description: string;
    };
    dashboard: {
      title: string;
      description: string;
    };
    attachment: {
      title: string;
      description: string;
    };
  };
  recent: {
    manageLinkRiskText: string;
    title: string;
    limitLabel: string;
    clearAll: string;
    emptyState: string;
    untitled: string;
    delete: string;
    shareLinkLabel: string;
    openShare: string;
    copyShare: string;
    manageLinkLabel: string;
    openManage: string;
    copyManage: string;
  };
  share: {
    unknownError: string;
    defaultTitle: string;
    loadingStatus: string;
    statusLabels: {
      published: string;
      expired: string;
      destroyed: string;
      disabled: string;
      deleted: string;
      unknown: string;
    };
    mediaKindLabels: {
      image: string;
      video: string;
      audio: string;
      pdf: string;
      text: string;
      other: string;
    };
    destroyModeLabels: {
      expire: string;
      maxViews: string;
      manual: string;
      none: string;
      firstView: string;
      unknown: string;
    };
    missingShareError: string;
    passwordRequiredError: string;
    verifyTokenMissingError: string;
    loading: string;
    passwordCardTitle: string;
    passwordCardDescription: string;
    passwordPlaceholder: string;
    verifyPassword: string;
    verifyingPassword: string;
    unavailableStatusNotice: string;
    bodyTitle: string;
    emptyBody: string;
    infoTitle: string;
    viewCountLabel: string;
    maxViewsLabel: string;
    unlimited: string;
    expiresAtLabel: string;
    destroyModeLabel: string;
    attachmentsTitle: string;
    attachmentsAvailableDescription: string;
    attachmentsEmptyDescription: string;
    attachmentNameHeader: string;
    attachmentSizeHeader: string;
    attachmentTypeHeader: string;
    attachmentStatusHeader: string;
    attachmentActionHeader: string;
    downloadOnlyBadge: string;
    download: string;
    downloading: string;
  };
  editor: {
    unknownError: string;
    uploadStatusDone: string;
    uploadStatusError: string;
    uploadStatusUploading: string;
    uploadStatusIdle: string;
    expiryOptionExpireTitle: string;
    expiryOptionExpireDescription: string;
    expiryOptionMaxViewsTitle: string;
    expiryOptionMaxViewsDescription: string;
    manageLinkRiskText: string;
    contentRequiredError: string;
    publishPendingUploadsError: string;
    presetExpire1d: string;
    presetExpire7d: string;
    presetExpire30d: string;
    presetMaxViews1: string;
    presetMaxViews10: string;
    presetMaxViews100: string;
    datePlaceholder: string;
    qrRenderError: string;
    qrExportError: string;
    invalidManageLinkError: string;
    turnstilePublishDescription: string;
    turnstileUploadDescription: string;
    turnstileContinueDescription: string;
    turnstileRequiredError: string;
    draftInitFailed: string;
    attachmentUploadInitFailed: string;
    missingPresignedUrl: string;
    maxAttachmentsReached: string;
    remainingAttachmentSlotsError: string;
    emptyAttachmentFile: string;
    untitled: string;
    lockedStatusDeleted: string;
    lockedStatusDestroyed: string;
    lockedActionError: string;
    maxViewsPositiveIntegerError: string;
    copiedManageUrl: string;
    publishExpireValidationError: string;
    publishFailed: string;
    publishSuccess: string;
    destroySuccess: string;
    deleteSuccess: string;
    loadingTitle: string;
    loadingDescription: string;
    deletedTitle: string;
    destroyedTitle: string;
    lockedDescription: string;
    titleLabel: string;
    titlePlaceholder: string;
    bodyLabel: string;
    bodyPlaceholder: string;
    attachmentsTitle: string;
    pickAttachments: string;
    attachmentsHint: string;
    renameAttachment: string;
    deleteAttachment: string;
    deleteAttachmentDialogTitle: string;
    deleteAttachmentDialogDescription: string;
    cancel: string;
    confirmDelete: string;
    actionsTitle: string;
    saveChanges: string;
    savingChanges: string;
    viewShareResult: string;
    manualDestroy: string;
    manualDestroyDialogTitle: string;
    manualDestroyDialogDescription: string;
    confirmDestroy: string;
    deleteContent: string;
    deleteContentDialogTitle: string;
    deleteContentDialogDescription: string;
    publish: string;
    publishing: string;
    manageFeatureTitle: string;
    manageFeatureDescription: string;
    saveRecentTitle: string;
    saveRecentDescription: string;
    statsBadge: string;
    currentContentTitle: string;
    attachmentOpenCount: string;
    attachmentDownloadCount: string;
    shareSettingsTitle: string;
    passwordLabel: string;
    passwordSwitchLabel: string;
    passwordSwitchDescription: string;
    passwordPlaceholder: string;
    presetsLabel: string;
    presetsExpireLabel: string;
    presetsViewsLabel: string;
    shareValidForLabel: string;
    expireAtLabel: string;
    expireAtDescription: string;
    dateLabel: string;
    timeLabel: string;
    expireMustBeFuture: string;
    maxViewsLabel: string;
    maxViewsDescription: string;
    maxViewsPlaceholder: string;
    disablePublicShareLabel: string;
    disablePublicShareDescription: string;
    shareResultTitle: string;
    shareResultDescription: string;
    openManagePage: string;
    shareCodeLabel: string;
    copy: string;
    publicShareLinkLabel: string;
    privateManageLinkLabel: string;
    shareQrCodeLabel: string;
    renameDialogTitle: string;
    renameDialogDescription: string;
    attachmentNameLabel: string;
    save: string;
    saving: string;
    turnstileDialogTitle: string;
    turnstileSuccessDescription: string;
  };
}

const messages: Record<Locale, LocaleMessages> = {
  en: {
    common: {
      siteName: 'LinkDisk',
      siteTagline: 'Anonymous text and file sharing',
      navHome: 'New Share',
      navRecent: 'Recent Shares',
      navUseCases: 'Why LinkDisk',
      navStarter: 'Starter',
      navUpload: 'Upload',
      themeLabel: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'System',
      languageLabel: 'Language',
      accessCodeShort: 'Code',
      accessByCode: 'Open by code',
      featureLabelHome: 'LinkDisk',
      featureDescriptionHome: 'Share text and files in seconds with one clean link.',
      mobileMenuOpenLabel: 'Open menu',
      mobileMenuDescription: 'Use the drawer on mobile to keep the header compact.',
    },
    accessDialog: {
      title: 'Open with share code',
      description: 'Enter the 8-digit share code. If the share has a password, enter it as well.',
      codeLabel: 'Share code',
      codePlaceholder: '8-digit share code',
      passwordLabel: 'Password (if required)',
      passwordPlaceholder: 'Password if required',
      invalidCode: 'Enter an 8-digit share code.',
      openFailed: 'Failed to open the share.',
      unknownError: 'Unknown error',
      errorTitle: 'Open failed',
      submit: 'Open share',
      submitting: 'Opening...',
    },
    home: {
      metadataTitle: 'Online Clipboard for Temporary Text and File Sharing | LinkDisk',
      metadataDescription: 'Share text and files online without login using temporary links, QR codes, passwords, expiry rules, and 8-digit share codes.',
      metadataKeywords: [
        'online clipboard',
        'share text between devices',
        'temporary text sharing',
        'temporary file sharing',
        'file sharing without login',
        'password protected file sharing',
      ],
      eyebrow: 'Clean Full-Stack Base',
      title: 'Start from a working shell instead of an empty repo.',
      description:
        'This scaffold keeps the app shell, internationalized routing, Tailwind, shadcn/ui, Cloudflare Worker deployment, and the current LinkDisk share flow as a solid base.',
      primaryCta: 'Open starter guide',
      secondaryCta: 'Inspect data layer',
      foundationTitle: 'What stays',
      foundationDescription: 'The project still behaves like a deployable product, not a toy example.',
      foundationItems: [
        'Localized App Router structure with locale redirects and metadata alternates.',
        'Reusable app shell with theme switcher and responsive navigation.',
        'Cloudflare Worker entry ready for Vinext production output.',
      ],
      fullstackTitle: 'What you replace next',
      fullstackDescription: 'The remaining pieces are deliberately generic so new business code has a clean landing spot.',
      fullstackItems: [
        'Refine the current share flow, editor experience, and access controls for your product direction.',
        'Replace remaining starter copy and placeholder routes with final product pages.',
        'Adjust wrangler.jsonc, environment variables, and deployment bindings for your runtime.',
      ],
      localesTitle: 'Built-in locales',
      localesDescription: 'The starter ships with English, Chinese, Spanish, and Japanese locale routing.',
      openLocale: 'Open locale homepage',
    },
    starter: {
      metadataTitle: 'Starter Guide',
      metadataDescription: 'Overview of the reusable app shell and where to plug in product code.',
      title: 'Starter Guide',
      description: 'Use this page as the handoff point before product-specific implementation starts.',
      blocksTitle: 'Reusable building blocks',
      blocks: [
        'app/: localized routes, metadata routes, and API handlers.',
        'src/components/: app shell plus reusable shadcn/ui primitives.',
        'packages/shared/: shared API paths and cross-app contract types.',
      ],
      checklistTitle: 'First edits to make',
      checklist: [
        'Rename the project in package.json and wrangler.jsonc if this folder name changes.',
        'Replace starter copy in src/i18n/messages.ts with your product copy.',
        'Keep apps/api as the only database access layer and evolve its migrations there.',
        'Swap remaining placeholder routes for production handlers once the product flow is stable.',
      ],
    },
    upload: {
      metadataTitle: 'Admin Upload',
      metadataDescription: 'Admin upload flow for direct file upload and chunk persistence.',
      title: 'Admin Upload',
      description: 'Upload files directly from the admin page and persist chunk metadata in the backend.',
      apiTitle: 'API requirements',
      apiDescription: 'This page talks directly to the admin API using NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_ADMIN_JWT from environment variables.',
      hashingTitle: 'Upload behavior',
      hashingDescription: 'The file is uploaded directly to the admin API, chunked on the server, and persisted to metadata tables.',
      tokenHint: 'Paste an admin JWT for /admin-api access.',
      apiBaseHint: 'Set the API base URL, for example http://127.0.0.1:8787 or your deployed API origin.',
      workflowTitle: 'Current workflow',
      workflowItems: [
        'Select a file from the admin page.',
        'Call POST /admin-api/objects/upload with JWT auth.',
        'Server chunks the file and uploads chunks to Telegram Storage.',
        'Server writes objects/object_parts metadata and marks object ready.',
      ],
      selectFilesLabel: 'Select files',
      addFilesHint: 'You can add multiple files at once. Queue items upload in parallel, and each file uploads chunks concurrently.',
      queueTotalLabel: 'Queue total',
      queuedLabel: 'Queued',
      completedLabel: 'Completed',
      failedLabel: 'Failed',
      uploading: 'Uploading...',
      startUpload: 'Start upload',
      clearQueue: 'Clear queue',
      queueTitle: 'Upload queue',
      queueDescription: 'Completed files stay visible here and also move into the recent uploads list below.',
      emptyQueue: 'There are no files waiting to upload.',
      speedLabel: 'Speed',
      etaLabel: 'Remaining',
      completedAtLabel: 'Completed at',
      sessionLabel: 'Session',
      waitingForSessionLabel: 'Waiting for session assignment',
      delete: 'Delete',
      requeue: 'Requeue',
      remove: 'Remove',
      recentUploadsTitle: 'Recent uploads',
      recentUploadsDescription: 'Visible only in the current session and cleared on refresh.',
      clearRecentUploads: 'Clear',
      emptyRecentUploads: 'There are no upload records in this session.',
      fileNameHeader: 'File name',
      uploadedAtHeader: 'Uploaded at',
      sizeHeader: 'Size',
      actionsHeader: 'Action',
      download: 'Download',
      phaseQueued: 'Waiting to start',
      phaseHashing: 'Hashing file...',
      phaseChecking: 'Checking instant upload...',
      phasePreparing: 'Preparing chunk upload...',
      phaseUploading: 'Uploading chunks in parallel',
      phaseInstant: 'Instant upload hit. Binary upload skipped.',
      phaseSuccess: 'Upload complete',
      phaseError: 'Upload failed',
      phaseWaiting: 'Waiting for upload',
    },
    dashboard: {
      unknownError: 'Unknown error',
      emptyOverviewError: 'Dashboard overview returned no data.',
      title: 'Clipboard dashboard',
      description: 'This page is private. Enter the dashboard access token manually. Current locale: {locale}',
      tokenPlaceholder: 'Enter DASHBOARD_ACCESS_TOKEN',
      applyToken: 'Apply token',
      emptyTokenState: 'Enter the dashboard token before loading data.',
      metricTotalEntries: 'Total entries',
      metricPublishedEntries: 'Published',
      metricDestroyedEntries: 'Destroyed',
      metricDeletedEntries: 'Deleted',
      metricTotalViews: 'Total views',
      metricAttachmentOpens: 'Attachment opens',
      metricAttachmentDownloads: 'Attachment downloads',
      metricArchivedAttachments: 'Archived attachments',
      metricFailedArchives: 'Failed archives',
      recentTitle: 'Recent updates',
      recentDescription: 'Only the latest 20 items are shown here for a quick status check.',
      loadingRecent: 'Loading recent items...',
      titleHeader: 'Title',
      statusHeader: 'Status',
      updatedAtHeader: 'Updated at',
      viewsHeader: 'Views',
      sharePageHeader: 'Share page',
      untitled: 'Untitled content',
      open: 'Open',
      emptyRecent: 'There is no data to display yet.',
    },
    routeMeta: {
      share: {
        title: 'Shared Content',
        description: 'Open an anonymous LinkDisk share with text and downloadable attachments.',
      },
      manage: {
        title: 'Manage Share',
        description: 'Edit the text, attachments, and share settings for this anonymous LinkDisk entry.',
      },
      recent: {
        title: 'Recent Shares',
        description: 'View recently created local shares and reopen their public or management links.',
      },
      dashboard: {
        title: 'Share Dashboard',
        description: 'Private dashboard for access, download, and archive metrics.',
      },
      attachment: {
        title: 'Attachment Download',
        description: 'Attachments are available for download only.',
      },
    },
    recent: {
      manageLinkRiskText: 'The management link can edit or destroy the content. Do not share it.',
      title: 'Recent Shares',
      limitLabel: 'Keep up to {limit} items',
      clearAll: 'Clear all',
      emptyState: 'No recent shares yet. After generating a share, you can save it from the result dialog.',
      untitled: 'Untitled content',
      delete: 'Delete',
      shareLinkLabel: 'Public share link',
      openShare: 'Open share',
      copyShare: 'Copy share link',
      manageLinkLabel: 'Private management link',
      openManage: 'Open manage page',
      copyManage: 'Copy manage link',
    },
    share: {
      unknownError: 'Unknown error',
      defaultTitle: 'LinkDisk Share',
      loadingStatus: 'Loading',
      statusLabels: {
        published: 'Available',
        expired: 'Expired',
        destroyed: 'Destroyed',
        disabled: 'Disabled',
        deleted: 'Deleted',
        unknown: 'Unknown status',
      },
      mediaKindLabels: {
        image: 'Image',
        video: 'Video',
        audio: 'Audio',
        pdf: 'PDF',
        text: 'Text',
        other: 'Other',
      },
      destroyModeLabels: {
        expire: 'Expires at time',
        maxViews: 'Expires after views',
        manual: 'Manual destroy',
        none: 'No auto-destroy',
        firstView: 'Destroy on first view',
        unknown: 'Unknown rule',
      },
      missingShareError: 'The share content does not exist.',
      passwordRequiredError: 'Enter the access password.',
      verifyTokenMissingError: 'Password verification did not return an access token.',
      loading: 'Loading shared content...',
      passwordCardTitle: 'Password required',
      passwordCardDescription: 'Enter the password to view the text and attachments.',
      passwordPlaceholder: 'Enter access password',
      verifyPassword: 'Verify password',
      verifyingPassword: 'Verifying...',
      unavailableStatusNotice: 'This share is currently "{status}", so the text and attachments are no longer available.',
      bodyTitle: 'Content',
      emptyBody: 'No content',
      infoTitle: 'Share details',
      viewCountLabel: 'View count',
      maxViewsLabel: 'Max views',
      unlimited: 'Unlimited',
      expiresAtLabel: 'Expires at',
      destroyModeLabel: 'Destroy rule',
      attachmentsTitle: 'Attachments',
      attachmentsAvailableDescription: 'Attachments are download-only. Online preview is not available.',
      attachmentsEmptyDescription: 'There are no attachments.',
      attachmentNameHeader: 'Name',
      attachmentSizeHeader: 'Size',
      attachmentTypeHeader: 'Type',
      attachmentStatusHeader: 'Status',
      attachmentActionHeader: 'Action',
      downloadOnlyBadge: 'Download only',
      download: 'Download',
      downloading: 'Downloading...',
    },
    editor: {
      unknownError: 'Unknown error',
      uploadStatusDone: 'Done',
      uploadStatusError: 'Failed',
      uploadStatusUploading: 'Uploading',
      uploadStatusIdle: 'Pending',
      expiryOptionExpireTitle: 'Unavailable after expiry',
      expiryOptionExpireDescription: 'Up to 30 days. The share becomes inaccessible after it expires.',
      expiryOptionMaxViewsTitle: 'Disable after view limit',
      expiryOptionMaxViewsDescription: 'The share becomes invalid after the view limit is reached.',
      manageLinkRiskText: 'The management link can edit or destroy the content. Do not share it.',
      contentRequiredError: 'Add a title, body, or at least one attachment.',
      publishPendingUploadsError: 'Some attachments are still uploading. Wait until uploads finish before publishing.',
      presetExpire1d: '1 day',
      presetExpire7d: '7 days',
      presetExpire30d: '30 days',
      presetMaxViews1: '1 view',
      presetMaxViews10: '10 views',
      presetMaxViews100: '100 views',
      datePlaceholder: 'Select a date',
      qrRenderError: 'Failed to render the QR code.',
      qrExportError: 'Failed to export the QR code.',
      invalidManageLinkError: 'The management link is invalid or the content does not exist.',
      turnstilePublishDescription: 'After verification, share creation will continue automatically.',
      turnstileUploadDescription: 'After verification, attachment upload will continue automatically.',
      turnstileContinueDescription: 'After verification, the current action will continue automatically.',
      turnstileRequiredError: 'Complete the verification first.',
      draftInitFailed: 'Failed to initialize the draft.',
      attachmentUploadInitFailed: 'Failed to initialize attachment upload.',
      missingPresignedUrl: 'Missing presigned URL for part {partIndex}.',
      maxAttachmentsReached: 'You can upload at most {max} attachments.',
      remainingAttachmentSlotsError: 'You can upload {remaining} more attachments. The total cannot exceed {max}.',
      emptyAttachmentFile: 'Attachment "{fileName}" is empty and cannot be uploaded.',
      untitled: 'Untitled content',
      lockedStatusDeleted: 'deleted',
      lockedStatusDestroyed: 'destroyed',
      lockedActionError: 'This content is {status} and cannot continue with "{action}".',
      maxViewsPositiveIntegerError: 'Maximum views must be a positive integer.',
      copiedManageUrl: 'Management link copied.',
      publishExpireValidationError: 'Expiry time is required and cannot be later than {days} days from now.',
      publishFailed: 'Failed to publish.',
      publishSuccess: 'Share link generated and the editor has been reset.',
      destroySuccess: 'Content destroyed.',
      deleteSuccess: 'Content deleted.',
      loadingTitle: 'Loading',
      loadingDescription: 'Loading management content and share settings. Please wait.',
      deletedTitle: 'This content has been deleted',
      destroyedTitle: 'This content has been destroyed',
      lockedDescription: 'This management page is now read-only. Editing, uploading, and attachment actions are disabled.',
      titleLabel: 'Title',
      titlePlaceholder: 'Title (optional)',
      bodyLabel: 'Body',
      bodyPlaceholder: 'Type the text here...',
      attachmentsTitle: 'Attachments',
      pickAttachments: 'Choose attachments',
      attachmentsHint: 'Drag, drop, or paste files here. Maximum {max} attachments.',
      renameAttachment: 'Rename',
      deleteAttachment: 'Delete',
      deleteAttachmentDialogTitle: 'Delete attachment?',
      deleteAttachmentDialogDescription: 'This will remove "{name}" from the share.',
      cancel: 'Cancel',
      confirmDelete: 'Delete',
      actionsTitle: 'Actions',
      saveChanges: 'Save changes',
      savingChanges: 'Saving...',
      viewShareResult: 'View share result',
      manualDestroy: 'Destroy now',
      manualDestroyDialogTitle: 'Destroy this content now?',
      manualDestroyDialogDescription: 'Public access will stop immediately and the attachments will be invalidated as well.',
      confirmDestroy: 'Destroy',
      deleteContent: 'Delete content',
      deleteContentDialogTitle: 'Delete this content?',
      deleteContentDialogDescription: 'The share link will stop working. This action cannot be undone.',
      publish: 'Generate share link',
      publishing: 'Publishing...',
      manageFeatureTitle: 'Enable management link',
      manageFeatureDescription: 'When enabled, the result dialog and recent list will include a private management link.',
      saveRecentTitle: 'Save to recent shares',
      saveRecentDescription: 'When enabled, the result will be saved on this device.',
      statsBadge: 'Stats',
      currentContentTitle: 'Current content',
      attachmentOpenCount: 'Attachment opens',
      attachmentDownloadCount: 'Attachment downloads',
      shareSettingsTitle: 'Share settings',
      passwordLabel: 'Access password',
      passwordSwitchLabel: 'Enable password protection',
      passwordSwitchDescription: 'Visitors must enter the password before viewing the content.',
      passwordPlaceholder: 'Set access password',
      presetsLabel: 'Presets',
      presetsExpireLabel: 'Expiry',
      presetsViewsLabel: 'Views',
      shareValidForLabel: 'Share lifetime',
      expireAtLabel: 'Expiry time',
      expireAtDescription: 'Up to {days} days. The share becomes inaccessible after expiry.',
      dateLabel: 'Date',
      timeLabel: 'Time',
      expireMustBeFuture: 'The expiry time must be later than now.',
      maxViewsLabel: 'Maximum views',
      maxViewsDescription: 'The share link becomes invalid after reaching this limit.',
      maxViewsPlaceholder: 'Enter the number of views',
      disablePublicShareLabel: 'Disable public share',
      disablePublicShareDescription: 'The public share link will stop working, but the management link can still edit the content.',
      shareResultTitle: 'Share link generated',
      shareResultDescription: 'The editor has been reset. You can immediately create the next share.',
      openManagePage: 'Open manage page',
      shareCodeLabel: '8-digit share code',
      copy: 'Copy',
      publicShareLinkLabel: 'Public share link',
      privateManageLinkLabel: 'Private management link',
      shareQrCodeLabel: 'Share QR code',
      renameDialogTitle: 'Rename attachment',
      renameDialogDescription: 'This only changes the displayed name and does not re-upload the file.',
      attachmentNameLabel: 'Attachment name',
      save: 'Save',
      saving: 'Saving...',
      turnstileDialogTitle: 'Complete verification',
      turnstileSuccessDescription: 'After verification succeeds, the previous action will continue automatically.',
    },
  },
  zh: {
    common: {
      siteName: 'LinkDisk',
      siteTagline: '匿名文本与附件分享',
      navHome: '新建分享',
      navRecent: '最近分享',
      navUseCases: '为什么用 LinkDisk',
      navStarter: '脚手架说明',
      navUpload: '附件调试',
      themeLabel: '主题',
      themeLight: '浅色',
      themeDark: '深色',
      themeSystem: '跟随系统',
      languageLabel: '语言',
      accessCodeShort: '分享码',
      accessByCode: '使用分享码',
      featureLabelHome: 'LinkDisk',
      featureDescriptionHome: '用链接快速分享文字和文件。',
      mobileMenuOpenLabel: '打开菜单',
      mobileMenuDescription: '在移动端使用抽屉菜单，避免顶部导航撑宽页面。',
    },
    accessDialog: {
      title: '使用分享码访问',
      description: '输入 8 位分享码。如果该内容设置了访问密码，请一并输入。',
      codeLabel: '分享码',
      codePlaceholder: '8 位分享码',
      passwordLabel: '访问密码（如有）',
      passwordPlaceholder: '访问密码（如有）',
      invalidCode: '请输入 8 位分享码。',
      openFailed: '打开内容失败。',
      unknownError: '未知错误',
      errorTitle: '打开失败',
      submit: '打开内容',
      submitting: '打开中...',
    },
    home: {
      metadataTitle: '在线剪贴板与临时文本文件分享 | LinkDisk',
      metadataDescription: '无需登录即可在线分享文本和文件，支持临时链接、二维码、访问密码、过期时间和 8 位分享码。',
      metadataKeywords: [
        '在线剪贴板',
        '跨设备传文本',
        '临时文本分享',
        '临时文件分享',
        '无需登录分享文件',
        '带密码文件分享',
      ],
      eyebrow: '匿名分享',
      title: '写点内容，挂上附件，直接生成分享码和分享链接。',
      description: 'LinkDisk 首页就是创建页，不需要登录。你可以写纯文本，附带文件，并设置访问密码、过期时间、访问次数与销毁策略。',
      primaryCta: '新建分享',
      secondaryCta: '最近分享',
      foundationTitle: '当前支持',
      foundationDescription: '首版先把匿名创建、分享访问和附件链路做完整。',
      foundationItems: [
        '纯文本创建与 8 位分享码访问。',
        '附件上传、下载、R2 热存储和 TG 归档。',
        '分享密码、过期时间、最大访问次数和销毁策略。',
      ],
      fullstackTitle: '后续扩展',
      fullstackDescription: '当前仍保留 locale 结构和调试上传页，方便后面继续补全产品能力。',
      fullstackItems: [
        '保留 /:locale 结构，为后续 i18n 留稳定入口。',
        '统计面板走单独口令，不暴露为公开页面。',
        '继续迭代附件上传、下载、R2 热层和 TG 归档链路。',
      ],
      localesTitle: '内置语言',
      localesDescription: '脚手架默认带英文、中文、西班牙语、日语四套 locale 路由。',
      openLocale: '进入该语言首页',
    },
    starter: {
      metadataTitle: '脚手架说明',
      metadataDescription: '概览这个可复用应用壳，以及业务代码应该接在哪里。',
      title: '脚手架说明',
      description: '在真正写业务前，这一页就是新的接手入口。',
      blocksTitle: '可复用模块',
      blocks: [
        'app/：本地化页面、metadata 路由和 API 处理器。',
        'src/components/：应用壳和可复用的 shadcn/ui 组件。',
        'packages/shared/：共享 API 路径和跨应用契约类型。',
      ],
      checklistTitle: '建议先改的地方',
      checklist: [
        '如果目录名还会变，先同步修改 package.json 和 wrangler.jsonc 的项目名。',
        '把 src/i18n/messages.ts 里的占位文案替换成你的产品文案。',
        '把数据库访问继续收敛在 apps/api，后续 migration 也只维护这一处。',
        '等产品流程稳定后，再把剩余占位路由替换成正式接口。',
      ],
    },
    upload: {
      metadataTitle: '附件调试',
      metadataDescription: '用于调试底层对象上传链路的内部页面。',
      title: '附件调试',
      description: '这个页面保留给对象上传链路调试使用，不是当前产品主入口。',
      apiTitle: 'API 前置条件',
      apiDescription: '这个页面直接调用管理端 API，并从环境变量读取 NEXT_PUBLIC_API_BASE_URL 和 NEXT_PUBLIC_ADMIN_JWT。',
      hashingTitle: '上传流程',
      hashingDescription: '文件按分片写入 R2，随后由 Cron 归档到 TG，并同步 objects/object_parts 元数据。',
      tokenHint: '填入可访问 /admin-api 的管理员 JWT。',
      apiBaseHint: '填写 API 基地址，例如 http://127.0.0.1:8787 或线上 API 域名。',
      workflowTitle: '当前流程',
      workflowItems: [
        '在管理页选择文件。',
        '调用 init / part / complete 上传接口（JWT 鉴权）。',
        '分片先落 R2 热层。',
        '服务端写入 objects/object_parts 并标记 ready。',
        'Cron 后续归档到 Telegram 冷层。',
      ],
      selectFilesLabel: '选择文件',
      addFilesHint: '可一次追加多个文件；左侧会按队列并行上传，文件内部继续执行分片并发。',
      queueTotalLabel: '队列总数',
      queuedLabel: '待上传',
      completedLabel: '已完成',
      failedLabel: '失败',
      uploading: '上传中...',
      startUpload: '开始上传',
      clearQueue: '清空队列',
      queueTitle: '上传队列',
      queueDescription: '成功文件会保留完成态，并同步进入下方最近上传。',
      emptyQueue: '当前还没有待上传文件。',
      speedLabel: '速度',
      etaLabel: '剩余',
      completedAtLabel: '完成于',
      sessionLabel: '会话',
      waitingForSessionLabel: '等待分配会话',
      delete: '删除',
      requeue: '重新加入',
      remove: '移除',
      recentUploadsTitle: '最近上传',
      recentUploadsDescription: '仅当前会话内可见，刷新页面后会清空。',
      clearRecentUploads: '清空',
      emptyRecentUploads: '当前会话暂无上传记录。',
      fileNameHeader: '文件名',
      uploadedAtHeader: '上传时间',
      sizeHeader: '大小',
      actionsHeader: '操作',
      download: '下载',
      phaseQueued: '等待开始',
      phaseHashing: '计算文件哈希...',
      phaseChecking: '检查秒传命中...',
      phasePreparing: '初始化分片上传...',
      phaseUploading: '正在并发上传分片',
      phaseInstant: '秒传命中，已跳过二进制上传',
      phaseSuccess: '上传完成',
      phaseError: '上传失败',
      phaseWaiting: '等待上传',
    },
    dashboard: {
      unknownError: '未知错误',
      emptyOverviewError: '统计总览返回为空。',
      title: '剪切板统计面板',
      description: '这个页面不会公开暴露数据，需要手动输入统计访问口令。当前 locale: {locale}',
      tokenPlaceholder: '输入 DASHBOARD_ACCESS_TOKEN',
      applyToken: '应用口令',
      emptyTokenState: '先输入统计口令，再加载数据。',
      metricTotalEntries: '总条目数',
      metricPublishedEntries: '已发布',
      metricDestroyedEntries: '已销毁',
      metricDeletedEntries: '已删除',
      metricTotalViews: '总访问次数',
      metricAttachmentOpens: '附件打开次数',
      metricAttachmentDownloads: '附件下载次数',
      metricArchivedAttachments: '已归档附件',
      metricFailedArchives: '归档失败数',
      recentTitle: '最近更新',
      recentDescription: '这里只展示最近 20 条内容，用于快速查看分享状态。',
      loadingRecent: '正在加载最近条目...',
      titleHeader: '标题',
      statusHeader: '状态',
      updatedAtHeader: '更新时间',
      viewsHeader: '访问次数',
      sharePageHeader: '分享页',
      untitled: '未命名内容',
      open: '打开',
      emptyRecent: '当前还没有可展示的数据。',
    },
    routeMeta: {
      share: {
        title: '分享内容',
        description: '匿名在线剪切板分享页，支持纯文本与附件访问。',
      },
      manage: {
        title: '管理内容',
        description: '匿名在线剪切板管理页，可编辑正文、附件和分享设置。',
      },
      recent: {
        title: '本机记录',
        description: '查看本机保存的最近创建内容，支持快速打开分享页和管理页。',
      },
      dashboard: {
        title: '统计面板',
        description: '匿名在线剪切板的访问、下载与归档统计面板。',
      },
      attachment: {
        title: '附件下载',
        description: '附件仅支持下载。',
      },
    },
    recent: {
      manageLinkRiskText: '管理链接可编辑或销毁内容，请勿外传。',
      title: '最近分享',
      limitLabel: '最多保留 {limit} 条',
      clearAll: '清空全部',
      emptyState: '还没有最近分享。生成分享链接后，可在结果弹窗里手动保存到最近分享。',
      untitled: '未命名内容',
      delete: '删除',
      shareLinkLabel: '公开分享链接',
      openShare: '打开分享页',
      copyShare: '复制分享链接',
      manageLinkLabel: '私有管理链接',
      openManage: '打开管理页',
      copyManage: '复制管理链接',
    },
    share: {
      unknownError: '未知错误',
      defaultTitle: 'LinkDisk 分享',
      loadingStatus: '加载中',
      statusLabels: {
        published: '可访问',
        expired: '已过期',
        destroyed: '已销毁',
        disabled: '已禁用',
        deleted: '已删除',
        unknown: '未知状态',
      },
      mediaKindLabels: {
        image: '图片',
        video: '视频',
        audio: '音频',
        pdf: 'PDF',
        text: '文本',
        other: '其他',
      },
      destroyModeLabels: {
        expire: '到期失效',
        maxViews: '达到次数后失效',
        manual: '手动销毁',
        none: '不自动销毁',
        firstView: '首次访问后失效',
        unknown: '未知策略',
      },
      missingShareError: '分享内容不存在。',
      passwordRequiredError: '请输入访问密码。',
      verifyTokenMissingError: '密码校验未返回访问令牌。',
      loading: '正在加载分享内容...',
      passwordCardTitle: '需要访问密码',
      passwordCardDescription: '输入密码后才会展示正文和附件。',
      passwordPlaceholder: '请输入访问密码',
      verifyPassword: '验证密码',
      verifyingPassword: '校验中...',
      unavailableStatusNotice: '当前分享状态为「{status}」，正文和附件不可再访问。',
      bodyTitle: '正文',
      emptyBody: '暂无内容',
      infoTitle: '分享信息',
      viewCountLabel: '访问次数',
      maxViewsLabel: '最大访问',
      unlimited: '不限',
      expiresAtLabel: '过期时间',
      destroyModeLabel: '销毁策略',
      attachmentsTitle: '附件',
      attachmentsAvailableDescription: '附件仅支持下载，不再提供在线浏览。',
      attachmentsEmptyDescription: '当前没有附件。',
      attachmentNameHeader: '名称',
      attachmentSizeHeader: '大小',
      attachmentTypeHeader: '类型',
      attachmentStatusHeader: '状态',
      attachmentActionHeader: '操作',
      downloadOnlyBadge: '仅可下载',
      download: '下载',
      downloading: '下载中...',
    },
    editor: {
      unknownError: '未知错误',
      uploadStatusDone: '已完成',
      uploadStatusError: '失败',
      uploadStatusUploading: '上传中',
      uploadStatusIdle: '待处理',
      expiryOptionExpireTitle: '到期后不可访问',
      expiryOptionExpireDescription: '最长 30 天，到期后不可访问。',
      expiryOptionMaxViewsTitle: '达到次数后自动失效',
      expiryOptionMaxViewsDescription: '达到上限后，链接将自动失效。',
      manageLinkRiskText: '管理链接可编辑或销毁内容，请勿外传。',
      contentRequiredError: '请至少填写标题、正文，或上传一个附件。',
      publishPendingUploadsError: '还有附件正在上传，请等待上传完成后再生成分享链接。',
      presetExpire1d: '1天',
      presetExpire7d: '7天',
      presetExpire30d: '30天',
      presetMaxViews1: '1次',
      presetMaxViews10: '10次',
      presetMaxViews100: '100次',
      datePlaceholder: '请选择日期',
      qrRenderError: '二维码渲染失败。',
      qrExportError: '二维码导出失败。',
      invalidManageLinkError: '管理链接无效或内容不存在。',
      turnstilePublishDescription: '完成验证后会继续生成分享链接。',
      turnstileUploadDescription: '完成验证后会继续上传附件。',
      turnstileContinueDescription: '完成验证后会继续当前操作。',
      turnstileRequiredError: '请先完成人机验证。',
      draftInitFailed: '草稿初始化失败。',
      attachmentUploadInitFailed: '附件上传初始化失败。',
      missingPresignedUrl: '缺少 presigned URL：part {partIndex}',
      maxAttachmentsReached: '附件最多只能上传 {max} 个。',
      remainingAttachmentSlotsError: '当前最多还能上传 {remaining} 个附件，附件总数不能超过 {max} 个。',
      emptyAttachmentFile: '附件“{fileName}”是空文件，暂不支持上传。',
      untitled: '未命名内容',
      lockedStatusDeleted: '已删除',
      lockedStatusDestroyed: '已销毁',
      lockedActionError: '当前内容{status}，无法继续{action}。',
      maxViewsPositiveIntegerError: '最多查看次数必须为正整数。',
      copiedManageUrl: '已复制管理链接。',
      publishExpireValidationError: '到期时间不能为空，且最长只能设置 {days} 天。',
      publishFailed: '发布失败。',
      publishSuccess: '分享链接已生成，编辑区已重置。',
      destroySuccess: '内容已销毁。',
      deleteSuccess: '内容已删除。',
      loadingTitle: '正在加载',
      loadingDescription: '正在读取管理内容和分享设置，请稍候。',
      deletedTitle: '当前内容已删除',
      destroyedTitle: '当前内容已销毁',
      lockedDescription: '当前管理页仅保留状态查看，编辑、上传和附件操作已禁用。',
      titleLabel: '标题',
      titlePlaceholder: '标题（可选）',
      bodyLabel: '正文',
      bodyPlaceholder: '在这里输入文本内容...',
      attachmentsTitle: '附件',
      pickAttachments: '选择附件',
      attachmentsHint: '支持拖拽或粘贴文件到此区域上传，最多 {max} 个附件。',
      renameAttachment: '重命名',
      deleteAttachment: '删除',
      deleteAttachmentDialogTitle: '确认删除附件？',
      deleteAttachmentDialogDescription: '将删除附件“{name}”。删除后该附件将不再随内容一起提供。',
      cancel: '取消',
      confirmDelete: '确认删除',
      actionsTitle: '操作',
      saveChanges: '保存修改',
      savingChanges: '保存中...',
      viewShareResult: '查看分享结果',
      manualDestroy: '手动销毁',
      manualDestroyDialogTitle: '确认手动销毁？',
      manualDestroyDialogDescription: '销毁后公开访问将立即失效，附件也会随条目一起失效。',
      confirmDestroy: '确认销毁',
      deleteContent: '删除内容',
      deleteContentDialogTitle: '确认删除内容？',
      deleteContentDialogDescription: '删除后分享链接会失效，这个操作不可恢复。',
      publish: '生成分享链接',
      publishing: '发布中...',
      manageFeatureTitle: '启用管理功能',
      manageFeatureDescription: '开启后会在分享结果和最近分享中显示管理链接；关闭后仅显示公开分享链接。',
      saveRecentTitle: '保存到最近分享',
      saveRecentDescription: '开启后会保存到最近分享页。',
      statsBadge: '统计',
      currentContentTitle: '当前内容',
      attachmentOpenCount: '附件打开次数',
      attachmentDownloadCount: '附件下载次数',
      shareSettingsTitle: '分享设置',
      passwordLabel: '访问密码',
      passwordSwitchLabel: '启用密码保护',
      passwordSwitchDescription: '开启后，访问者需要先输入密码才能查看内容。',
      passwordPlaceholder: '设置访问密码',
      presetsLabel: '常用预设',
      presetsExpireLabel: '到期',
      presetsViewsLabel: '次数',
      shareValidForLabel: '分享有效期',
      expireAtLabel: '到期时间',
      expireAtDescription: '最长 {days} 天，到期后不可访问。',
      dateLabel: '日期',
      timeLabel: '时间',
      expireMustBeFuture: '到期时间必须晚于当前时间。',
      maxViewsLabel: '最多查看次数',
      maxViewsDescription: '达到上限后，链接将自动失效。',
      maxViewsPlaceholder: '请输入次数',
      disablePublicShareLabel: '禁用公开分享',
      disablePublicShareDescription: '开启后，原有分享链接会暂时失效，但管理链接仍可继续编辑。',
      shareResultTitle: '分享链接已生成',
      shareResultDescription: '当前编辑区已经重置，可以直接继续创建下一条内容。',
      openManagePage: '打开管理页',
      shareCodeLabel: '8 位分享码',
      copy: '复制',
      publicShareLinkLabel: '公开分享链接',
      privateManageLinkLabel: '私有管理链接',
      shareQrCodeLabel: '分享二维码',
      renameDialogTitle: '重命名附件',
      renameDialogDescription: '修改附件展示名称，不会重新上传文件。',
      attachmentNameLabel: '附件名称',
      save: '保存',
      saving: '保存中...',
      turnstileDialogTitle: '完成人机验证',
      turnstileSuccessDescription: '验证成功后会自动继续刚才的操作。',
    },
  },
  es: {
    common: {
      siteName: 'LinkDisk',
      siteTagline: 'Compartir texto y archivos',
      navHome: 'Nueva comparticion',
      navRecent: 'Compartidos recientes',
      navUseCases: 'Por que LinkDisk',
      navStarter: 'Starter',
      navUpload: 'Subir',
      themeLabel: 'Tema',
      themeLight: 'Claro',
      themeDark: 'Oscuro',
      themeSystem: 'Sistema',
      languageLabel: 'Idioma',
      accessCodeShort: 'Codigo',
      accessByCode: 'Abrir con codigo',
      featureLabelHome: 'LinkDisk',
      featureDescriptionHome: 'Comparte texto y archivos en segundos con un enlace limpio.',
      mobileMenuOpenLabel: 'Abrir menu',
      mobileMenuDescription: 'Usa el menu lateral en movil para mantener el encabezado compacto.',
    },
    accessDialog: {
      title: 'Abrir con codigo',
      description: 'Introduce el codigo de 8 digitos. Si el compartido tiene contrasena, introducela tambien.',
      codeLabel: 'Codigo',
      codePlaceholder: 'Codigo de 8 digitos',
      passwordLabel: 'Contrasena (si aplica)',
      passwordPlaceholder: 'Contrasena si aplica',
      invalidCode: 'Introduce un codigo de 8 digitos.',
      openFailed: 'No se pudo abrir el contenido.',
      unknownError: 'Error desconocido',
      errorTitle: 'Error al abrir',
      submit: 'Abrir contenido',
      submitting: 'Abriendo...',
    },
    home: {
      metadataTitle: 'Portapapeles online para texto y archivos temporales | LinkDisk',
      metadataDescription: 'Comparte texto y archivos online sin login con enlaces temporales, QR, contrasenas, expiracion y codigos de 8 digitos.',
      metadataKeywords: [
        'portapapeles online',
        'compartir texto entre dispositivos',
        'texto temporal',
        'archivos temporales',
        'compartir archivos sin login',
        'archivo con contrasena',
      ],
      eyebrow: 'Base full-stack limpia',
      title: 'Empieza desde una base que ya funciona.',
      description: 'Este scaffold mantiene el shell de la app, el routing con locales, Tailwind, shadcn/ui, el despliegue en Cloudflare Worker y el flujo actual de LinkDisk como base.',
      primaryCta: 'Ver guia starter',
      secondaryCta: 'Ver capa de datos',
      foundationTitle: 'Lo que se conserva',
      foundationDescription: 'Sigue siendo una base desplegable, no un ejemplo vacio.',
      foundationItems: [
        'Estructura App Router localizada con redirects de idioma y alternates.',
        'Shell reutilizable con cambio de tema y navegacion responsive.',
        'Entrada Cloudflare Worker lista para la salida de produccion de Vinext.',
      ],
      fullstackTitle: 'Lo que debes reemplazar',
      fullstackDescription: 'Las piezas restantes son genericas a proposito para que tu negocio entre limpio.',
      fullstackItems: [
        'Mejora el flujo de comparticion, el editor y los controles de acceso segun tu producto.',
        'Reemplaza el copy starter y las rutas placeholder por paginas finales.',
        'Ajusta wrangler.jsonc, variables de entorno y bindings segun tu entorno.',
      ],
      localesTitle: 'Idiomas incluidos',
      localesDescription: 'El starter incluye rutas para ingles, chino, espanol y japones.',
      openLocale: 'Abrir inicio del idioma',
    },
    starter: {
      metadataTitle: 'Guia Starter',
      metadataDescription: 'Resumen del shell reutilizable y donde conectar codigo de producto.',
      title: 'Guia Starter',
      description: 'Usa esta pagina como punto de partida antes de escribir codigo de negocio.',
      blocksTitle: 'Bloques reutilizables',
      blocks: [
        'app/: rutas localizadas, metadata y handlers API.',
        'src/components/: shell de la app y componentes reutilizables.',
        'packages/shared/: rutas API compartidas y tipos de contrato entre apps.',
      ],
      checklistTitle: 'Primeros cambios',
      checklist: [
        'Renombra el proyecto en package.json y wrangler.jsonc si cambias el nombre de la carpeta.',
        'Reemplaza el copy starter en src/i18n/messages.ts.',
        'Mantén apps/api como la unica capa de acceso a la base de datos y sus migraciones.',
        'Sustituye las rutas placeholder restantes cuando el flujo del producto este estable.',
      ],
    },
    upload: {
      metadataTitle: 'Carga Admin',
      metadataDescription: 'Flujo de carga administrativa con subida directa y persistencia por partes.',
      title: 'Carga Admin',
      description: 'Sube archivos directamente desde la pagina admin y deja que el backend haga el chunking y la persistencia.',
      apiTitle: 'Requisitos API',
      apiDescription: 'Esta pagina llama al API admin directamente usando NEXT_PUBLIC_API_BASE_URL y NEXT_PUBLIC_ADMIN_JWT desde variables de entorno.',
      hashingTitle: 'Comportamiento de carga',
      hashingDescription: 'El archivo se envia directo al API admin, se divide en partes en el servidor y se guarda el metadata.',
      tokenHint: 'Pega un JWT admin con acceso a /admin-api.',
      apiBaseHint: 'Configura la URL base del API, por ejemplo http://127.0.0.1:8787 o tu dominio desplegado.',
      workflowTitle: 'Flujo actual',
      workflowItems: [
        'Selecciona un archivo desde la pagina admin.',
        'Llama a POST /admin-api/objects/upload con JWT.',
        'El servidor divide en partes y sube a Telegram Storage.',
        'El servidor guarda metadata en objects/object_parts y marca ready.',
      ],
      selectFilesLabel: 'Seleccionar archivos',
      addFilesHint: 'Puedes anadir varios archivos a la vez. La cola sube varios archivos y cada archivo sube partes en paralelo.',
      queueTotalLabel: 'Total en cola',
      queuedLabel: 'Pendientes',
      completedLabel: 'Completados',
      failedLabel: 'Fallidos',
      uploading: 'Subiendo...',
      startUpload: 'Iniciar subida',
      clearQueue: 'Limpiar cola',
      queueTitle: 'Cola de subida',
      queueDescription: 'Los archivos completados permanecen visibles y tambien pasan al historial reciente.',
      emptyQueue: 'No hay archivos pendientes de subida.',
      speedLabel: 'Velocidad',
      etaLabel: 'Restante',
      completedAtLabel: 'Completado',
      sessionLabel: 'Sesion',
      waitingForSessionLabel: 'Esperando sesion',
      delete: 'Eliminar',
      requeue: 'Reintentar',
      remove: 'Quitar',
      recentUploadsTitle: 'Subidas recientes',
      recentUploadsDescription: 'Solo visible en la sesion actual.',
      clearRecentUploads: 'Limpiar',
      emptyRecentUploads: 'No hay registros de subida en esta sesion.',
      fileNameHeader: 'Archivo',
      uploadedAtHeader: 'Fecha',
      sizeHeader: 'Tamano',
      actionsHeader: 'Accion',
      download: 'Descargar',
      phaseQueued: 'Esperando inicio',
      phaseHashing: 'Calculando hash...',
      phaseChecking: 'Comprobando subida instantanea...',
      phasePreparing: 'Preparando subida por partes...',
      phaseUploading: 'Subiendo partes en paralelo',
      phaseInstant: 'Subida instantanea aplicada',
      phaseSuccess: 'Subida completada',
      phaseError: 'Subida fallida',
      phaseWaiting: 'Esperando subida',
    },
    dashboard: {
      unknownError: 'Error desconocido',
      emptyOverviewError: 'El resumen no devolvio datos.',
      title: 'Panel del clipboard',
      description: 'Esta pagina es privada. Introduce el token manualmente. Locale actual: {locale}',
      tokenPlaceholder: 'Introduce DASHBOARD_ACCESS_TOKEN',
      applyToken: 'Aplicar token',
      emptyTokenState: 'Introduce el token antes de cargar datos.',
      metricTotalEntries: 'Total de entradas',
      metricPublishedEntries: 'Publicadas',
      metricDestroyedEntries: 'Destruidas',
      metricDeletedEntries: 'Eliminadas',
      metricTotalViews: 'Visitas totales',
      metricAttachmentOpens: 'Aperturas de adjuntos',
      metricAttachmentDownloads: 'Descargas de adjuntos',
      metricArchivedAttachments: 'Adjuntos archivados',
      metricFailedArchives: 'Archivos fallidos',
      recentTitle: 'Actualizaciones recientes',
      recentDescription: 'Solo se muestran los ultimos 20 elementos.',
      loadingRecent: 'Cargando elementos recientes...',
      titleHeader: 'Titulo',
      statusHeader: 'Estado',
      updatedAtHeader: 'Actualizado',
      viewsHeader: 'Visitas',
      sharePageHeader: 'Pagina',
      untitled: 'Sin titulo',
      open: 'Abrir',
      emptyRecent: 'Todavia no hay datos para mostrar.',
    },
    routeMeta: {
      share: {
        title: 'Contenido compartido',
        description: 'Abre un compartido anonimo de LinkDisk con texto y adjuntos descargables.',
      },
      manage: {
        title: 'Gestionar compartido',
        description: 'Edita el texto, los adjuntos y la configuracion de este contenido compartido.',
      },
      recent: {
        title: 'Compartidos recientes',
        description: 'Consulta los compartidos creados recientemente y reabre sus enlaces publicos o de gestion.',
      },
      dashboard: {
        title: 'Panel de estadisticas',
        description: 'Panel privado con metricas de acceso, descargas y archivado.',
      },
      attachment: {
        title: 'Descarga de adjunto',
        description: 'Los adjuntos solo estan disponibles para descarga.',
      },
    },
    recent: {
      manageLinkRiskText: 'El enlace de gestion puede editar o destruir el contenido. No lo compartas.',
      title: 'Compartidos recientes',
      limitLabel: 'Hasta {limit} elementos',
      clearAll: 'Limpiar todo',
      emptyState: 'Aun no hay compartidos recientes. Puedes guardarlos desde el dialogo de resultado.',
      untitled: 'Contenido sin titulo',
      delete: 'Eliminar',
      shareLinkLabel: 'Enlace publico',
      openShare: 'Abrir compartido',
      copyShare: 'Copiar enlace',
      manageLinkLabel: 'Enlace privado de gestion',
      openManage: 'Abrir gestion',
      copyManage: 'Copiar enlace de gestion',
    },
    share: {
      unknownError: 'Error desconocido',
      defaultTitle: 'LinkDisk Share',
      loadingStatus: 'Cargando',
      statusLabels: {
        published: 'Disponible',
        expired: 'Expirado',
        destroyed: 'Destruido',
        disabled: 'Deshabilitado',
        deleted: 'Eliminado',
        unknown: 'Estado desconocido',
      },
      mediaKindLabels: {
        image: 'Imagen',
        video: 'Video',
        audio: 'Audio',
        pdf: 'PDF',
        text: 'Texto',
        other: 'Otro',
      },
      destroyModeLabels: {
        expire: 'Expira por fecha',
        maxViews: 'Expira por vistas',
        manual: 'Destruccion manual',
        none: 'Sin destruccion automatica',
        firstView: 'Destruir en la primera vista',
        unknown: 'Regla desconocida',
      },
      missingShareError: 'El contenido compartido no existe.',
      passwordRequiredError: 'Introduce la contrasena de acceso.',
      verifyTokenMissingError: 'La verificacion no devolvio un token de acceso.',
      loading: 'Cargando contenido compartido...',
      passwordCardTitle: 'Se requiere contrasena',
      passwordCardDescription: 'Introduce la contrasena para ver el texto y los adjuntos.',
      passwordPlaceholder: 'Introduce la contrasena',
      verifyPassword: 'Verificar contrasena',
      verifyingPassword: 'Verificando...',
      unavailableStatusNotice: 'El estado actual es "{status}", por lo que el contenido ya no esta disponible.',
      bodyTitle: 'Contenido',
      emptyBody: 'Sin contenido',
      infoTitle: 'Informacion',
      viewCountLabel: 'Visitas',
      maxViewsLabel: 'Maximo de visitas',
      unlimited: 'Sin limite',
      expiresAtLabel: 'Caduca el',
      destroyModeLabel: 'Regla de destruccion',
      attachmentsTitle: 'Adjuntos',
      attachmentsAvailableDescription: 'Los adjuntos solo se pueden descargar.',
      attachmentsEmptyDescription: 'No hay adjuntos.',
      attachmentNameHeader: 'Nombre',
      attachmentSizeHeader: 'Tamano',
      attachmentTypeHeader: 'Tipo',
      attachmentStatusHeader: 'Estado',
      attachmentActionHeader: 'Accion',
      downloadOnlyBadge: 'Solo descarga',
      download: 'Descargar',
      downloading: 'Descargando...',
    },
    editor: {
      unknownError: 'Error desconocido',
      uploadStatusDone: 'Completado',
      uploadStatusError: 'Error',
      uploadStatusUploading: 'Subiendo',
      uploadStatusIdle: 'Pendiente',
      expiryOptionExpireTitle: 'No disponible tras expirar',
      expiryOptionExpireDescription: 'Hasta 30 dias. Luego dejara de estar disponible.',
      expiryOptionMaxViewsTitle: 'Invalidar al alcanzar el limite',
      expiryOptionMaxViewsDescription: 'El enlace se invalida al llegar al limite.',
      manageLinkRiskText: 'El enlace de gestion puede editar o destruir el contenido. No lo compartas.',
      contentRequiredError: 'Introduce un titulo, contenido o al menos un adjunto.',
      publishPendingUploadsError: 'Todavia hay adjuntos subiendo. Espera antes de publicar.',
      presetExpire1d: '1 dia',
      presetExpire7d: '7 dias',
      presetExpire30d: '30 dias',
      presetMaxViews1: '1 vez',
      presetMaxViews10: '10 veces',
      presetMaxViews100: '100 veces',
      datePlaceholder: 'Selecciona una fecha',
      qrRenderError: 'No se pudo renderizar el QR.',
      qrExportError: 'No se pudo exportar el QR.',
      invalidManageLinkError: 'El enlace de gestion es invalido o el contenido no existe.',
      turnstilePublishDescription: 'Tras la verificacion, la publicacion continuara automaticamente.',
      turnstileUploadDescription: 'Tras la verificacion, la subida continuara automaticamente.',
      turnstileContinueDescription: 'Tras la verificacion, la accion continuara automaticamente.',
      turnstileRequiredError: 'Completa la verificacion primero.',
      draftInitFailed: 'No se pudo inicializar el borrador.',
      attachmentUploadInitFailed: 'No se pudo inicializar la subida del adjunto.',
      missingPresignedUrl: 'Falta la URL presignada para la parte {partIndex}.',
      maxAttachmentsReached: 'Puedes subir como maximo {max} adjuntos.',
      remainingAttachmentSlotsError: 'Solo puedes subir {remaining} adjuntos mas. El total no puede superar {max}.',
      emptyAttachmentFile: 'El adjunto "{fileName}" esta vacio y no se puede subir.',
      untitled: 'Contenido sin titulo',
      lockedStatusDeleted: 'eliminado',
      lockedStatusDestroyed: 'destruido',
      lockedActionError: 'Este contenido esta {status} y no puede continuar con "{action}".',
      maxViewsPositiveIntegerError: 'El maximo de visitas debe ser un entero positivo.',
      copiedManageUrl: 'Enlace de gestion copiado.',
      publishExpireValidationError: 'La fecha de caducidad es obligatoria y no puede superar {days} dias.',
      publishFailed: 'No se pudo publicar.',
      publishSuccess: 'Se genero el enlace y el editor se reinicio.',
      destroySuccess: 'Contenido destruido.',
      deleteSuccess: 'Contenido eliminado.',
      loadingTitle: 'Cargando',
      loadingDescription: 'Cargando contenido de gestion y configuracion.',
      deletedTitle: 'Este contenido fue eliminado',
      destroyedTitle: 'Este contenido fue destruido',
      lockedDescription: 'La pagina de gestion esta en modo solo lectura.',
      titleLabel: 'Titulo',
      titlePlaceholder: 'Titulo (opcional)',
      bodyLabel: 'Contenido',
      bodyPlaceholder: 'Escribe el texto aqui...',
      attachmentsTitle: 'Adjuntos',
      pickAttachments: 'Seleccionar adjuntos',
      attachmentsHint: 'Arrastra, suelta o pega archivos aqui. Maximo {max} adjuntos.',
      renameAttachment: 'Renombrar',
      deleteAttachment: 'Eliminar',
      deleteAttachmentDialogTitle: 'Eliminar adjunto?',
      deleteAttachmentDialogDescription: 'Se eliminara "{name}" del contenido compartido.',
      cancel: 'Cancelar',
      confirmDelete: 'Eliminar',
      actionsTitle: 'Acciones',
      saveChanges: 'Guardar cambios',
      savingChanges: 'Guardando...',
      viewShareResult: 'Ver resultado',
      manualDestroy: 'Destruir ahora',
      manualDestroyDialogTitle: 'Destruir este contenido ahora?',
      manualDestroyDialogDescription: 'El acceso publico dejara de funcionar inmediatamente.',
      confirmDestroy: 'Destruir',
      deleteContent: 'Eliminar contenido',
      deleteContentDialogTitle: 'Eliminar este contenido?',
      deleteContentDialogDescription: 'El enlace dejara de funcionar y no se puede deshacer.',
      publish: 'Generar enlace',
      publishing: 'Publicando...',
      manageFeatureTitle: 'Habilitar enlace de gestion',
      manageFeatureDescription: 'Cuando este activo, se mostrara un enlace privado de gestion.',
      saveRecentTitle: 'Guardar en recientes',
      saveRecentDescription: 'Cuando este activo, se guardara en este dispositivo.',
      statsBadge: 'Stats',
      currentContentTitle: 'Contenido actual',
      attachmentOpenCount: 'Aperturas de adjuntos',
      attachmentDownloadCount: 'Descargas de adjuntos',
      shareSettingsTitle: 'Configuracion',
      passwordLabel: 'Contrasena de acceso',
      passwordSwitchLabel: 'Proteger con contrasena',
      passwordSwitchDescription: 'Los visitantes deben introducir la contrasena.',
      passwordPlaceholder: 'Define la contrasena',
      presetsLabel: 'Presets',
      presetsExpireLabel: 'Caducidad',
      presetsViewsLabel: 'Vistas',
      shareValidForLabel: 'Duracion del enlace',
      expireAtLabel: 'Caduca el',
      expireAtDescription: 'Hasta {days} dias.',
      dateLabel: 'Fecha',
      timeLabel: 'Hora',
      expireMustBeFuture: 'La fecha de caducidad debe ser futura.',
      maxViewsLabel: 'Maximo de visitas',
      maxViewsDescription: 'El enlace se invalida al llegar al limite.',
      maxViewsPlaceholder: 'Introduce el numero',
      disablePublicShareLabel: 'Deshabilitar enlace publico',
      disablePublicShareDescription: 'El enlace publico dejara de funcionar, pero el de gestion seguira activo.',
      shareResultTitle: 'Enlace generado',
      shareResultDescription: 'El editor se reinicio y puedes crear otro contenido.',
      openManagePage: 'Abrir gestion',
      shareCodeLabel: 'Codigo de 8 digitos',
      copy: 'Copiar',
      publicShareLinkLabel: 'Enlace publico',
      privateManageLinkLabel: 'Enlace privado de gestion',
      shareQrCodeLabel: 'QR del enlace',
      renameDialogTitle: 'Renombrar adjunto',
      renameDialogDescription: 'Solo cambia el nombre visible.',
      attachmentNameLabel: 'Nombre del adjunto',
      save: 'Guardar',
      saving: 'Guardando...',
      turnstileDialogTitle: 'Completa la verificacion',
      turnstileSuccessDescription: 'Tras verificar, la accion anterior continuara automaticamente.',
    },
  },
  ja: {
    common: {
      siteName: 'LinkDisk',
      siteTagline: '匿名テキストと添付ファイル共有',
      navHome: '新しい共有',
      navRecent: '最近の共有',
      navUseCases: 'LinkDiskを使う理由',
      navStarter: 'スターター',
      navUpload: 'アップロード',
      themeLabel: 'テーマ',
      themeLight: 'ライト',
      themeDark: 'ダーク',
      themeSystem: 'システム',
      languageLabel: '言語',
      accessCodeShort: '共有コード',
      accessByCode: '共有コードで開く',
      featureLabelHome: 'LinkDisk',
      featureDescriptionHome: 'テキストも添付も、1 本のわかりやすいリンクですぐ共有できます。',
      mobileMenuOpenLabel: 'メニューを開く',
      mobileMenuDescription: 'モバイルではドロワーメニューを使い、ヘッダーが横に広がりすぎないようにします。',
    },
    accessDialog: {
      title: '共有コードで開く',
      description: '8 桁の共有コードを入力してください。パスワード付きの場合は一緒に入力します。',
      codeLabel: '共有コード',
      codePlaceholder: '8 桁の共有コード',
      passwordLabel: 'パスワード（必要な場合）',
      passwordPlaceholder: '必要な場合のパスワード',
      invalidCode: '8 桁の共有コードを入力してください。',
      openFailed: '共有内容を開けませんでした。',
      unknownError: '不明なエラー',
      errorTitle: '開けませんでした',
      submit: '共有を開く',
      submitting: '開いています...',
    },
    home: {
      metadataTitle: 'オンラインクリップボードと一時的なテキスト・ファイル共有 | LinkDisk',
      metadataDescription: 'ログイン不要でテキストとファイルをオンライン共有。QR、パスワード、有効期限、8 桁共有コードに対応します。',
      metadataKeywords: [
        'オンラインクリップボード',
        'デバイス間 テキスト共有',
        '一時的なテキスト共有',
        '一時的なファイル共有',
        'ログイン不要 ファイル共有',
        'パスワード付きファイル共有',
      ],
      eyebrow: 'クリーンなフルスタック土台',
      title: '空のリポジトリではなく、動くシェルから始める。',
      description: 'このスターターは、アプリシェル、多言語ルーティング、Tailwind、shadcn/ui、Cloudflare Worker デプロイ、そして現在の LinkDisk 共有フローを土台として保持します。',
      primaryCta: 'スターターガイドを見る',
      secondaryCta: 'データ層を見る',
      foundationTitle: '残したもの',
      foundationDescription: 'デプロイ可能な基盤を残しており、単なる UI サンプルではありません。',
      foundationItems: [
        'locale リダイレクトと alternates を備えた App Router 構成。',
        'テーマ切り替えとレスポンシブナビ付きの再利用可能なアプリシェル。',
        'Vinext 本番出力を受けられる Cloudflare Worker エントリ。',
      ],
      fullstackTitle: 'これから置き換えるもの',
      fullstackDescription: '残したコードは意図的に中立なので、新しい業務コードをきれいに載せられます。',
      fullstackItems: [
        '共有フロー、エディタ、アクセス制御を製品要件に合わせて磨き込む。',
        '残っているスターター文言とプレースホルダールートを本番ページへ置き換える。',
        'wrangler.jsonc、環境変数、binding を自分の環境に合わせて調整する。',
      ],
      localesTitle: '組み込みロケール',
      localesDescription: '英語、中国語、スペイン語、日本語の locale ルーティングを同梱しています。',
      openLocale: 'この言語のトップへ',
    },
    starter: {
      metadataTitle: 'スターターガイド',
      metadataDescription: '再利用可能なアプリシェルと、業務コードを接続する場所の概要。',
      title: 'スターターガイド',
      description: '業務実装を始める前の引き継ぎ地点として使ってください。',
      blocksTitle: '再利用できる構成',
      blocks: [
        'app/: locale ページ、metadata ルート、API ハンドラ。',
        'src/components/: アプリシェルと再利用 UI コンポーネント。',
        'packages/shared/: 共有 API パスとアプリ間で使う契約型。',
      ],
      checklistTitle: '最初にやる変更',
      checklist: [
        'フォルダ名が変わるなら package.json と wrangler.jsonc の名前を先に合わせる。',
        'src/i18n/messages.ts のスターター文言を製品文言に置き換える。',
        'DB アクセスは apps/api に集約したまま、migration もそこで管理する。',
        '製品フローが固まったら残りのプレースホルダールートを本番用に置き換える。',
      ],
    },
    upload: {
      metadataTitle: '管理アップロード',
      metadataDescription: '管理画面から直接アップロードし、分割メタデータを保存するフロー。',
      title: '管理アップロード',
      description: '管理画面からファイルを直接アップロードし、サーバー側で分割とメタデータ保存を行います。',
      apiTitle: 'API 前提条件',
      apiDescription: 'このページは環境変数の NEXT_PUBLIC_API_BASE_URL と NEXT_PUBLIC_ADMIN_JWT を使って管理 API を直接呼び出します。',
      hashingTitle: 'アップロード挙動',
      hashingDescription: 'ファイルは管理 API に直接送信され、サーバー側で分割アップロードと objects/object_parts 保存を実行します。',
      tokenHint: '/admin-api にアクセスできる管理者 JWT を入力します。',
      apiBaseHint: 'API ベース URL を設定してください。例: http://127.0.0.1:8787',
      workflowTitle: '現在のフロー',
      workflowItems: [
        '管理画面でファイルを選択する。',
        'JWT 付きで POST /admin-api/objects/upload を呼ぶ。',
        'サーバー側で分割して Telegram Storage にアップロードする。',
        'objects/object_parts を保存して ready に更新する。',
      ],
      selectFilesLabel: 'ファイルを選択',
      addFilesHint: '複数ファイルを一度に追加できます。キュー単位と分割単位で並列アップロードします。',
      queueTotalLabel: 'キュー総数',
      queuedLabel: '待機中',
      completedLabel: '完了',
      failedLabel: '失敗',
      uploading: 'アップロード中...',
      startUpload: 'アップロード開始',
      clearQueue: 'キューをクリア',
      queueTitle: 'アップロードキュー',
      queueDescription: '完了したファイルは保持され、下の最近のアップロードにも表示されます。',
      emptyQueue: 'アップロード待ちのファイルはありません。',
      speedLabel: '速度',
      etaLabel: '残り',
      completedAtLabel: '完了',
      sessionLabel: 'セッション',
      waitingForSessionLabel: 'セッション割り当て待ち',
      delete: '削除',
      requeue: '再投入',
      remove: '外す',
      recentUploadsTitle: '最近のアップロード',
      recentUploadsDescription: '現在のセッションでのみ表示されます。',
      clearRecentUploads: 'クリア',
      emptyRecentUploads: 'このセッションにはアップロード履歴がありません。',
      fileNameHeader: 'ファイル名',
      uploadedAtHeader: 'アップロード時刻',
      sizeHeader: 'サイズ',
      actionsHeader: '操作',
      download: 'ダウンロード',
      phaseQueued: '開始待ち',
      phaseHashing: 'ハッシュ計算中...',
      phaseChecking: '秒伝判定中...',
      phasePreparing: '分割アップロード初期化中...',
      phaseUploading: '分割を並列アップロード中',
      phaseInstant: '秒伝がヒットし、バイナリアップロードをスキップしました',
      phaseSuccess: 'アップロード完了',
      phaseError: 'アップロード失敗',
      phaseWaiting: 'アップロード待機',
    },
    dashboard: {
      unknownError: '不明なエラー',
      emptyOverviewError: '概要データが返されませんでした。',
      title: 'クリップボード統計パネル',
      description: 'このページは非公開です。アクセス用トークンを手動で入力してください。現在の locale: {locale}',
      tokenPlaceholder: 'DASHBOARD_ACCESS_TOKEN を入力',
      applyToken: 'トークンを適用',
      emptyTokenState: '先に統計トークンを入力してください。',
      metricTotalEntries: '総件数',
      metricPublishedEntries: '公開中',
      metricDestroyedEntries: '破棄済み',
      metricDeletedEntries: '削除済み',
      metricTotalViews: '総閲覧数',
      metricAttachmentOpens: '添付オープン数',
      metricAttachmentDownloads: '添付ダウンロード数',
      metricArchivedAttachments: 'アーカイブ済み添付',
      metricFailedArchives: 'アーカイブ失敗数',
      recentTitle: '最近の更新',
      recentDescription: '直近 20 件のみを表示します。',
      loadingRecent: '最近の項目を読み込み中...',
      titleHeader: 'タイトル',
      statusHeader: '状態',
      updatedAtHeader: '更新日時',
      viewsHeader: '閲覧数',
      sharePageHeader: '共有ページ',
      untitled: '無題',
      open: '開く',
      emptyRecent: '表示できるデータはまだありません。',
    },
    routeMeta: {
      share: {
        title: '共有内容',
        description: 'テキストとダウンロード専用添付ファイルを含む LinkDisk の共有内容を開きます。',
      },
      manage: {
        title: '共有を管理',
        description: 'この匿名共有の本文、添付ファイル、共有設定を編集します。',
      },
      recent: {
        title: '最近の共有',
        description: '最近作成した共有を確認し、公開リンクや管理リンクを再度開けます。',
      },
      dashboard: {
        title: '統計ダッシュボード',
        description: 'アクセス数、ダウンロード数、アーカイブ状況を確認する非公開ダッシュボードです。',
      },
      attachment: {
        title: '添付ファイルのダウンロード',
        description: '添付ファイルはダウンロードのみ可能です。',
      },
    },
    recent: {
      manageLinkRiskText: '管理リンクでは内容の編集や破棄ができます。共有しないでください。',
      title: '最近の共有',
      limitLabel: '最大 {limit} 件を保持',
      clearAll: 'すべて削除',
      emptyState: '最近の共有はまだありません。結果ダイアログから保存できます。',
      untitled: '無題の内容',
      delete: '削除',
      shareLinkLabel: '公開共有リンク',
      openShare: '共有ページを開く',
      copyShare: '共有リンクをコピー',
      manageLinkLabel: '非公開の管理リンク',
      openManage: '管理ページを開く',
      copyManage: '管理リンクをコピー',
    },
    share: {
      unknownError: '不明なエラー',
      defaultTitle: 'LinkDisk Share',
      loadingStatus: '読み込み中',
      statusLabels: {
        published: '利用可能',
        expired: '期限切れ',
        destroyed: '破棄済み',
        disabled: '無効',
        deleted: '削除済み',
        unknown: '不明な状態',
      },
      mediaKindLabels: {
        image: '画像',
        video: '動画',
        audio: '音声',
        pdf: 'PDF',
        text: 'テキスト',
        other: 'その他',
      },
      destroyModeLabels: {
        expire: '期限で失効',
        maxViews: '閲覧回数で失効',
        manual: '手動破棄',
        none: '自動破棄なし',
        firstView: '初回閲覧で失効',
        unknown: '不明なルール',
      },
      missingShareError: '共有内容が見つかりません。',
      passwordRequiredError: 'アクセス用パスワードを入力してください。',
      verifyTokenMissingError: 'パスワード検証でアクセストークンが返りませんでした。',
      loading: '共有内容を読み込み中...',
      passwordCardTitle: 'パスワードが必要です',
      passwordCardDescription: '本文と添付ファイルを表示するにはパスワードを入力してください。',
      passwordPlaceholder: 'アクセスパスワードを入力',
      verifyPassword: 'パスワードを確認',
      verifyingPassword: '確認中...',
      unavailableStatusNotice: '現在の共有状態は「{status}」のため、本文と添付ファイルにはアクセスできません。',
      bodyTitle: '本文',
      emptyBody: '内容はありません',
      infoTitle: '共有情報',
      viewCountLabel: '閲覧回数',
      maxViewsLabel: '最大閲覧回数',
      unlimited: '無制限',
      expiresAtLabel: '有効期限',
      destroyModeLabel: '破棄ルール',
      attachmentsTitle: '添付ファイル',
      attachmentsAvailableDescription: '添付ファイルはダウンロード専用です。',
      attachmentsEmptyDescription: '添付ファイルはありません。',
      attachmentNameHeader: '名前',
      attachmentSizeHeader: 'サイズ',
      attachmentTypeHeader: '種類',
      attachmentStatusHeader: '状態',
      attachmentActionHeader: '操作',
      downloadOnlyBadge: 'ダウンロード専用',
      download: 'ダウンロード',
      downloading: 'ダウンロード中...',
    },
    editor: {
      unknownError: '不明なエラー',
      uploadStatusDone: '完了',
      uploadStatusError: '失敗',
      uploadStatusUploading: 'アップロード中',
      uploadStatusIdle: '待機中',
      expiryOptionExpireTitle: '期限後はアクセス不可',
      expiryOptionExpireDescription: '最長 30 日。期限後はアクセスできません。',
      expiryOptionMaxViewsTitle: '回数上限で無効化',
      expiryOptionMaxViewsDescription: '上限に達するとリンクが無効になります。',
      manageLinkRiskText: '管理リンクでは内容の編集や破棄ができます。共有しないでください。',
      contentRequiredError: 'タイトル、本文、または添付ファイルを 1 つ以上入力してください。',
      publishPendingUploadsError: 'まだアップロード中の添付ファイルがあります。完了後に共有リンクを生成してください。',
      presetExpire1d: '1日',
      presetExpire7d: '7日',
      presetExpire30d: '30日',
      presetMaxViews1: '1回',
      presetMaxViews10: '10回',
      presetMaxViews100: '100回',
      datePlaceholder: '日付を選択',
      qrRenderError: 'QR コードの描画に失敗しました。',
      qrExportError: 'QR コードの書き出しに失敗しました。',
      invalidManageLinkError: '管理リンクが無効か、内容が存在しません。',
      turnstilePublishDescription: '認証が完了すると共有リンク生成が続行されます。',
      turnstileUploadDescription: '認証が完了すると添付ファイルのアップロードが続行されます。',
      turnstileContinueDescription: '認証が完了すると現在の操作が続行されます。',
      turnstileRequiredError: '先に認証を完了してください。',
      draftInitFailed: '下書きの初期化に失敗しました。',
      attachmentUploadInitFailed: '添付ファイルのアップロード初期化に失敗しました。',
      missingPresignedUrl: 'part {partIndex} の presigned URL がありません。',
      maxAttachmentsReached: '添付ファイルは最大 {max} 件までです。',
      remainingAttachmentSlotsError: '追加できる添付ファイルはあと {remaining} 件です。合計は {max} 件を超えられません。',
      emptyAttachmentFile: '添付ファイル「{fileName}」は空のためアップロードできません。',
      untitled: '無題の内容',
      lockedStatusDeleted: '削除済み',
      lockedStatusDestroyed: '破棄済み',
      lockedActionError: 'この内容は{status}のため、「{action}」を続行できません。',
      maxViewsPositiveIntegerError: '最大閲覧回数は正の整数でなければなりません。',
      copiedManageUrl: '管理リンクをコピーしました。',
      publishExpireValidationError: '有効期限は必須で、{days} 日以内で設定してください。',
      publishFailed: '公開に失敗しました。',
      publishSuccess: '共有リンクを生成し、エディタをリセットしました。',
      destroySuccess: '内容を破棄しました。',
      deleteSuccess: '内容を削除しました。',
      loadingTitle: '読み込み中',
      loadingDescription: '管理内容と共有設定を読み込んでいます。',
      deletedTitle: 'この内容は削除されました',
      destroyedTitle: 'この内容は破棄されました',
      lockedDescription: 'この管理ページは現在読み取り専用です。',
      titleLabel: 'タイトル',
      titlePlaceholder: 'タイトル（任意）',
      bodyLabel: '本文',
      bodyPlaceholder: 'ここにテキストを入力...',
      attachmentsTitle: '添付ファイル',
      pickAttachments: '添付ファイルを選択',
      attachmentsHint: 'ここにドラッグ、ドロップ、または貼り付けできます。最大 {max} 件。',
      renameAttachment: '名前を変更',
      deleteAttachment: '削除',
      deleteAttachmentDialogTitle: '添付ファイルを削除しますか？',
      deleteAttachmentDialogDescription: '「{name}」を共有内容から削除します。',
      cancel: 'キャンセル',
      confirmDelete: '削除する',
      actionsTitle: '操作',
      saveChanges: '変更を保存',
      savingChanges: '保存中...',
      viewShareResult: '共有結果を見る',
      manualDestroy: '今すぐ破棄',
      manualDestroyDialogTitle: 'この内容を今すぐ破棄しますか？',
      manualDestroyDialogDescription: '公開アクセスは直ちに無効になります。',
      confirmDestroy: '破棄する',
      deleteContent: '内容を削除',
      deleteContentDialogTitle: 'この内容を削除しますか？',
      deleteContentDialogDescription: '共有リンクは無効になり、元に戻せません。',
      publish: '共有リンクを生成',
      publishing: '公開中...',
      manageFeatureTitle: '管理リンクを有効にする',
      manageFeatureDescription: '有効にすると、結果ダイアログと最近の共有に管理リンクが表示されます。',
      saveRecentTitle: '最近の共有に保存',
      saveRecentDescription: '有効にすると、この端末に保存されます。',
      statsBadge: '統計',
      currentContentTitle: '現在の内容',
      attachmentOpenCount: '添付ファイルのオープン数',
      attachmentDownloadCount: '添付ファイルのダウンロード数',
      shareSettingsTitle: '共有設定',
      passwordLabel: 'アクセスパスワード',
      passwordSwitchLabel: 'パスワード保護を有効にする',
      passwordSwitchDescription: '閲覧者はパスワードを入力してから内容を表示します。',
      passwordPlaceholder: 'アクセスパスワードを設定',
      presetsLabel: 'プリセット',
      presetsExpireLabel: '期限',
      presetsViewsLabel: '回数',
      shareValidForLabel: '共有の有効期間',
      expireAtLabel: '有効期限',
      expireAtDescription: '最長 {days} 日。期限後はアクセスできません。',
      dateLabel: '日付',
      timeLabel: '時間',
      expireMustBeFuture: '有効期限は現在より後である必要があります。',
      maxViewsLabel: '最大閲覧回数',
      maxViewsDescription: '上限に達するとリンクが無効になります。',
      maxViewsPlaceholder: '回数を入力',
      disablePublicShareLabel: '公開共有を無効にする',
      disablePublicShareDescription: '公開リンクは無効になりますが、管理リンクからは編集できます。',
      shareResultTitle: '共有リンクを生成しました',
      shareResultDescription: 'エディタをリセットしたので、そのまま次の内容を作成できます。',
      openManagePage: '管理ページを開く',
      shareCodeLabel: '8 桁の共有コード',
      copy: 'コピー',
      publicShareLinkLabel: '公開共有リンク',
      privateManageLinkLabel: '非公開の管理リンク',
      shareQrCodeLabel: '共有 QR コード',
      renameDialogTitle: '添付ファイル名を変更',
      renameDialogDescription: '表示名のみを変更し、再アップロードは行いません。',
      attachmentNameLabel: '添付ファイル名',
      save: '保存',
      saving: '保存中...',
      turnstileDialogTitle: '認証を完了',
      turnstileSuccessDescription: '認証に成功すると、直前の操作が自動で続行されます。',
    },
  },
};

export function getMessages(locale: Locale) {
  return messages[locale];
}
