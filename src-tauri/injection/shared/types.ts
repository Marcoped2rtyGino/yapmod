export type YapmodConfig = {
  use_native_titlebar?: boolean | null;
  start_maximized?: boolean | null;
  settings?: Record<string, unknown>;
};

export type ReleaseNotesSection = {
  heading?: string;
  items: string[];
};

export type ReleaseNotes = {
  title?: string;
  date?: string;
  summary?: string;
  sections?: ReleaseNotesSection[];
};

export type ReleaseInfo = {
  version: string;
  previousVersion: string | null;
  firstRun: boolean;
  notes: ReleaseNotes | null;
};

export type ModalSize = "sm" | "md" | "lg" | "xl";

export type ModalCloseReason =
  | "api"
  | "backdrop"
  | "escape"
  | "button"
  | "dismiss"
  | "destroy";

export type ModalContent =
  | string
  | Node
  | null
  | ((modal: YapmodModal) => string | Node | null);

export type ModalButton = {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean;
  autofocus?: boolean;
  onClick?: (
    modal: YapmodModal,
  ) => void | boolean | Promise<void | boolean>;
  closeOnClick?: boolean;
};

export type ModalOptions = {
  id?: string;
  title?: string | null;
  description?: string | null;
  content?: ModalContent;
  html?: string;
  buttons?: ModalButton[];
  size?: ModalSize;
  className?: string;
  ariaLabel?: string;
  dismissible?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
  onOpen?: (modal: YapmodModal) => void;
  onClose?: (modal: YapmodModal, reason: ModalCloseReason) => void;
};

export interface YapmodModal {
  readonly id: string;
  readonly element: HTMLElement;
  readonly dialog: HTMLElement;
  readonly head: HTMLElement | null;
  readonly body: HTMLElement;
  readonly footer: HTMLElement | null;
  readonly isOpen: boolean;
  readonly closed: Promise<ModalCloseReason>;
  open(): this;
  close(reason?: ModalCloseReason): void;
  destroy(): void;
  setTitle(title: string | null): void;
  setDescription(description: string | null): void;
  setContent(content?: ModalContent): void;
  addButton(button: ModalButton): HTMLButtonElement;
}

export type YapmodModalApi = {
  create(options?: ModalOptions): YapmodModal;
  show(options?: ModalOptions): YapmodModal;
  closeAll(reason?: ModalCloseReason): void;
  readonly active: YapmodModal[];
};

export type SettingsContext = {
  readonly id: string;
  refresh(): void;
};

export type SettingOption = {
  value: string;
  label: string;
};

export type SettingsItem =
  | {
      type: "toggle";
      id: string;
      label: string;
      description?: string;
      value: boolean;
      disabled?: boolean;
      onChange: (value: boolean) => void;
    }
  | {
      type: "select";
      id: string;
      label: string;
      description?: string;
      value: string;
      options: SettingOption[];
      disabled?: boolean;
      onChange: (value: string) => void;
    }
  | {
      type: "text";
      id: string;
      label: string;
      description?: string;
      value: string;
      placeholder?: string;
      maxLength?: number;
      disabled?: boolean;
      onChange: (value: string) => void;
    }
  | {
      type: "number";
      id: string;
      label: string;
      description?: string;
      value: number;
      min?: number;
      max?: number;
      step?: number;
      disabled?: boolean;
      onChange: (value: number) => void;
    }
  | {
      type: "button";
      id: string;
      label: string;
      variant?: "primary" | "secondary" | "danger";
      onClick: () => void;
    }
  | {
      type: "custom";
      id: string;
      label?: string;
      description?: string;
      render: (
        host: HTMLElement,
        context: SettingsContext,
      ) => void | (() => void);
    };

export type SettingsSection = {
  id: string;
  label: string;
  group?: string;
  order?: number;
  description?: string;
  items?: SettingsItem[];
  render?: (
    host: HTMLElement,
    context: SettingsContext,
  ) => void | (() => void);
  onShow?: () => void;
  onHide?: () => void;
};

export type YapmodSettingsApi = {
  register(section: SettingsSection): () => void;
  unregister(id: string): void;
  open(id: string): void;
  refresh(id?: string): void;
  readonly sections: readonly SettingsSection[];
  readonly active: string | null;
};

export type YapmodStoreApi = {
  get<T = unknown>(key: string, fallback?: T): T;
  set(key: string, value: unknown): void;
  all(): Record<string, unknown>;
  onChange(key: string, listener: (value: unknown) => void): () => void;
  flush(): Promise<void>;
};

export type YapmodGlobal = {
  preinject?: boolean;
  config?: YapmodConfig;
  os?: string;
  firstRun?: boolean;
  version?: string;
  release?: ReleaseInfo;
  applyCss?: (css: string) => void;
  modal?: YapmodModalApi;
  createModal?: (options?: ModalOptions) => YapmodModal;
  showModal?: (options?: ModalOptions) => YapmodModal;
  settings?: YapmodSettingsApi;
  store?: YapmodStoreApi;
};

export type YapmodScope = typeof globalThis & {
  __yapmod?: YapmodGlobal;
  __YAPMOD_CONFIG__?: YapmodConfig;
  __YAPMOD_OS__?: string;
  __YAPMOD_FIRST_RUN__?: boolean;
  __YAPMOD_VERSION__?: string;
  __YAPMOD_PREVIOUS_VERSION__?: string | null;
  __YAPMOD_RELEASE_NOTES__?: ReleaseNotes | null;
};
