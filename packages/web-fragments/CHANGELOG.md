# web-fragments

## 0.0.14

### Patch Changes

- 07e8618: [gateway] The `cloudflare-pages` middleware now includes the `fragment-id` on the `<fragment-host>` when server-rendering a fragment
- 07e8618: [elements] `<fragment-host>`s now only pierce into `<fragment-outlet>`s that have a matching `fragment-id`
- 07e8618: [elements] `A <fragment-outlet>` now gets pierced by only one `<fragment-host>`
- Updated dependencies [14a68ea]
- Updated dependencies [699b108]
  - reframed@0.1.0

## 0.0.13

### Patch Changes

- Updated dependencies [e128ab9]
- Updated dependencies [e128ab9]
- Updated dependencies [4db9bf4]
- Updated dependencies [4db9bf4]
  - reframed@0.0.13

## 0.0.12

### Patch Changes

- 4f8e5c6: feat(web-fragments) Revert fix for style leakage from inherited css properties"
- 96b66ec: feat: Add a header to signal when fragments are running in embedded mode
- Updated dependencies [7a8f79a]
- Updated dependencies [55ed23e]
- Updated dependencies [7a8f79a]
- Updated dependencies [96b66ec]
  - reframed@0.0.12

## 0.0.11

### Patch Changes

- 39e0f01: Focus and selection state is now preserved when piercing a <fragment-host> into a <fragment-outlet>.
- a19c318: The `<fragment-host>` element is no longer responsible for cleaning up global `reframed` side-effects in its `disconnectedCallback`. These are now cleaned up by `reframed` itself.
- eeb6667: feat: Prevent styling leakage from inherited css properties
- Updated dependencies [a19c318]
- Updated dependencies [a19c318]
- Updated dependencies [9511b7b]
  - reframed@0.0.11

## 0.0.10

### Patch Changes

- Updated dependencies [8d7d522]
  - reframed@0.0.10

## 0.0.9

### Patch Changes

- 05f3fc0: patch main window history to dispatch popstate events for reframed iframes to trigger UI updates. These patches are reverted when the iframe is destroyed
- b74969b: fix: remove unnecessary `qinit` dispatching from `fragment-outlet`
- Updated dependencies [45df910]
- Updated dependencies [af60115]
- Updated dependencies [05f3fc0]
- Updated dependencies [af0e8b2]
  - reframed@0.0.9

## 0.0.8

### Patch Changes

- 91db623: refactor: define cloudflare-pages specific middleware entrypoint instead of exposing `getPagesMiddleware`
- f4bdda0: Add support for overriding response in onSSRFetchError
- 132d6ce: Prevented the FOUC when piercing into fragment-outlet
- 469a67f: Fix global event listeners added by monkeyPatchIframeDocument() not being cleaned up on iframe removal
- Updated dependencies [469a67f]
  - reframed@0.0.8

## 0.0.7

### Patch Changes

- Updated dependencies [de47957]
  - reframed@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies [1ca6280]
  - reframed@0.0.6
