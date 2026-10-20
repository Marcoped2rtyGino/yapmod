import type { SettingsContext, SettingsItem } from "./types";
import { createElement } from "./ui";

function controlId(context: SettingsContext, itemId: string): string {
  return `yapmod-${context.id}-${itemId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function createHint(text: string): HTMLElement {
  return createElement("span", { className: "hint", text });
}

function renderToggle(
  item: Extract<SettingsItem, { type: "toggle" }>,
): HTMLElement {
  const row = createElement("label", { className: "toggle-row" });

  const text = createElement("div");
  text.append(createElement("div", { className: "toggle-label", text: item.label }));

  if (item.description) {
    text.append(createElement("div", { className: "hint", text: item.description }));
  }

  const input = createElement("input", {
    attrs: { type: "checkbox", class: "switch", "aria-label": item.label },
  });

  input.checked = item.value;
  input.disabled = item.disabled === true;

  input.addEventListener("change", () => {
    item.onChange(input.checked);
  });

  row.append(text, input);

  return row;
}

function renderSelect(
  item: Extract<SettingsItem, { type: "select" }>,
  context: SettingsContext,
): HTMLElement {
  const id = controlId(context, item.id);
  const field = createElement("div", { className: "field" });

  const select = createElement("select", {
    className: "input",
    attrs: { id },
  });

  for (const option of item.options) {
    const node = createElement("option", {
      attrs: { value: option.value },
      text: option.label,
    });

    if (option.value === item.value) {
      node.selected = true;
    }

    select.append(node);
  }

  select.disabled = item.disabled === true;

  select.addEventListener("change", () => {
    item.onChange(select.value);
  });

  field.append(
    createElement("label", { attrs: { for: id }, text: item.label }),
    select,
  );

  if (item.description) {
    field.append(createHint(item.description));
  }

  return field;
}

function renderInput(
  item: Extract<SettingsItem, { type: "text" | "number" }>,
  context: SettingsContext,
): HTMLElement {
  const id = controlId(context, item.id);
  const field = createElement("div", { className: "field" });

  const input = createElement("input", {
    className: "input",
    attrs: { id, type: item.type },
  });

  input.value = String(item.value);

  if (item.type === "text") {
    if (item.placeholder) {
      input.placeholder = item.placeholder;
    }

    if (item.maxLength) {
      input.maxLength = item.maxLength;
    }
  } else {
    if (item.min !== undefined) {
      input.min = String(item.min);
    }

    if (item.max !== undefined) {
      input.max = String(item.max);
    }

    if (item.step !== undefined) {
      input.step = String(item.step);
    }
  }

  input.disabled = item.disabled === true;

  input.addEventListener("change", () => {
    if (item.type === "number") {
      const next = Number(input.value);

      if (!Number.isFinite(next)) {
        input.value = String(item.value);
        return;
      }

      item.onChange(next);
      return;
    }

    item.onChange(input.value);
  });

  field.append(
    createElement("label", { attrs: { for: id }, text: item.label }),
    input,
  );

  if (item.description) {
    field.append(createHint(item.description));
  }

  return field;
}

function renderButton(
  item: Extract<SettingsItem, { type: "button" }>,
): HTMLElement {
  const variant = item.variant ?? "primary";
  const className = [
    "btn",
    "small",
    variant === "secondary" ? "ghost" : "",
    variant === "danger" ? "danger" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const button = createElement("button", {
    className,
    attrs: { type: "button" },
    text: item.label,
  });

  button.addEventListener("click", () => {
    item.onClick();
  });

  return button;
}

function renderCustom(
  item: Extract<SettingsItem, { type: "custom" }>,
  context: SettingsContext,
  teardowns: (() => void)[],
): HTMLElement {
  const host = createElement("div", { className: "yapmod-setting" });

  if (item.label) {
    host.append(
      createElement("div", { className: "toggle-label", text: item.label }),
    );
  }

  if (item.description) {
    host.append(createHint(item.description));
  }

  const body = createElement("div");
  host.append(body);

  const teardown = item.render(body, context);

  if (typeof teardown === "function") {
    teardowns.push(teardown);
  }

  return host;
}

export function renderSettingsItem(
  item: SettingsItem,
  context: SettingsContext,
  teardowns: (() => void)[] = [],
): HTMLElement {
  switch (item.type) {
    case "toggle":
      return renderToggle(item);
    case "select":
      return renderSelect(item, context);
    case "text":
    case "number":
      return renderInput(item, context);
    case "button":
      return renderButton(item);
    case "custom":
      return renderCustom(item, context, teardowns);
    default:
      return createElement("div");
  }
}
