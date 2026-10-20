export type YapmodConfig = {
  use_native_titlebar?: boolean | null;
  start_maximized?: boolean | null;
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

export type YapmodGlobal = {
  preinject?: boolean;
  config?: YapmodConfig;
  firstRun?: boolean;
  version?: string;
  applyCss?: (css: string) => void;
  modal?: YapmodModalApi;
  createModal?: (options?: ModalOptions) => YapmodModal;
  showModal?: (options?: ModalOptions) => YapmodModal;
};

export type YapmodScope = typeof globalThis & {
  __yapmod?: YapmodGlobal;
  __YAPMOD_CONFIG__?: YapmodConfig;
  __YAPMOD_FIRST_RUN__?: boolean;
  __YAPMOD_VERSION__?: string;
};
