---
title: Plugins
group: Customize & extend
order: 2
eyebrow: Customize & extend
description: The long-term goal of a stable, documented plugin API for yapmod.
---

One of the most important long-term ambitions of the project is extensibility. We do not want yapmod's capabilities to be limited to what the core team builds. We want users and developers to be able to extend the client, change how it behaves, and add things Yapper does not offer on its own.

> **Status: in development.** There is no public plugin API yet. This page describes the direction and the principles we will design against, not a system you can build on today.

## Why extensibility

A plugin ecosystem would let the client grow beyond its original feature set. Instead of requiring every new idea to live in the core app, developers could build and share extensions that serve different communities and use cases, while the core client stays focused.

The goal is not to make the main application complicated. It is to give it a foundation that other functionality can be built on — so the client stays useful on its own, and you only take on the extensions you actually want.

## What plugins could do

The exact set of capabilities depends on the API we settle on. The possibilities we want to explore include:

- Introducing new features and workflows.
- Changing existing application behaviour.
- Modifying or extending parts of the interface.
- Integrating external services and tools.
- Adding new ways to interact with messages, channels and other components.
- Providing specialised functionality for particular communities.

These are examples of the ambition, not a guarantee that every one will be possible.

## A stable API, not fragile hooks

A meaningful ecosystem needs a proper, documented interface. Our principles for it:

- **Documented extension points.** Developers should build against things we intend them to use, not undocumented internals.
- **Stability.** The API should evolve deliberately, with compatibility in mind. Where a breaking change is unavoidable, it should come with versioning and migration guidance.
- **Clarity.** Developers should be able to see what an extension can access, how it interacts with the app, and what it can rely on.
- **Tooling and examples.** Creating a plugin should not require reverse-engineering the client. We want documentation and working examples to go with the API.

The guiding idea is simple: the application should be extensible by design, through a documented and stable API, rather than a collection of fragile internal hooks.

## Security and boundaries

Extensions may run code, reach user data, or change how the app behaves, so the plugin system has to define clear boundaries.

- Plugins should declare or be granted the access they need rather than receiving everything by default.
- The execution model — what runs where, and with what limits — has to be specified as part of the design.
- Security guarantees should be documented alongside the API, so users and developers know what is being trusted.

The precise model is still to be settled. We would rather take the time to get it right than ship an API whose guarantees we cannot explain.

## For plugin developers

When the API exists, we want a plugin developer to be able to:

- Understand the extension points and what each one is for.
- Know the compatibility rules and how changes will be communicated.
- Follow examples that show real, working extensions.
- Trust that the interfaces they build on will not silently change underneath them.

Until then, this page is the place to watch. It will grow into the public API reference, extension-point guides, the security model and the process for developing and maintaining a plugin.
