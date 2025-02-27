# @dnd-kit/core

## 4.0.3

### Patch Changes

- [#509](https://github.com/clauderic/dnd-kit/pull/509) [`1c6369e`](https://github.com/clauderic/dnd-kit/commit/1c6369e24ff338760adfb806c3017c72f3194726) Thanks [@clauderic](https://github.com/clauderic)! - Helpers have been updated to support rendering in foreign `window` contexts (via `ReactDOM.render` or `ReactDOM.createPortal`).

  For example, checking if an element is an instance of an `HTMLElement` is normally done like so:

  ```ts
  if (element instanceof HTMLElement)
  ```

  However, when rendering in a different window, this can return false even if the element is indeed an HTMLElement, because this code is equivalent to:

  ```ts
  if (element instanceof window.HTMLElement)
  ```

  And in this case, the `window` of the `element` is different from the main execution context `window`, because we are rendering via a portal into another window.

  This can be solved by finding the local window of the element:

  ```ts
  const elementWindow = element.ownerDocument.defaultView;

  if (element instanceof elementWindow.HTMLElement)
  ```

- Updated dependencies [[`1c6369e`](https://github.com/clauderic/dnd-kit/commit/1c6369e24ff338760adfb806c3017c72f3194726)]:
  - @dnd-kit/utilities@3.0.1

## 4.0.2

### Patch Changes

- [#504](https://github.com/clauderic/dnd-kit/pull/504) [`d973cc6`](https://github.com/clauderic/dnd-kit/commit/d973cc6f5aaca8a01e6da4a958164eb623c4ce9d) Thanks [@clauderic](https://github.com/clauderic)! - Sensors that extend the `AbstractPointerSensor` now prevent [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) events from being triggered while the sensor is activated.

## 4.0.1

### Patch Changes

- [#479](https://github.com/clauderic/dnd-kit/pull/479) [`5ec3310`](https://github.com/clauderic/dnd-kit/commit/5ec331048e5913b4e4b6c096215ed4920cbd0607) Thanks [@mdrobny](https://github.com/mdrobny)! - fix: bind `handleCancel` handler in AbstractPointerSensor to current execution context (`this`).

## 4.0.0

### Major Changes

- [#337](https://github.com/clauderic/dnd-kit/pull/337) [`05d6a78`](https://github.com/clauderic/dnd-kit/commit/05d6a78a17cbaacd8dffed685dfea5a6ea3d38a8) Thanks [@clauderic](https://github.com/clauderic)! - React updates in non-synthetic event handlers are now batched to reduce re-renders and prepare for React 18.

  Also fixed issues with collision detection:

  - Defer measurement of droppable node rects until second render after dragging.
  - Use DragOverlay's width and height in collision rect (if it is used)

- [#427](https://github.com/clauderic/dnd-kit/pull/427) [`f96cb5d`](https://github.com/clauderic/dnd-kit/commit/f96cb5d5e45a1000104892244201a70cbe8e6553) Thanks [@clauderic](https://github.com/clauderic)! - - Using transform-agnostic measurements for the DragOverlay node.

  - Renamed the `overlayNode` property to `dragOverlay` on the `DndContextDescriptor` interface.

- [#372](https://github.com/clauderic/dnd-kit/pull/372) [`dbc9601`](https://github.com/clauderic/dnd-kit/commit/dbc9601c922e1d6944a63f66ee647f203abee595) Thanks [@clauderic](https://github.com/clauderic)! - Refactored `DroppableContainers` type from `Record<UniqueIdentifier, DroppableContainer` to a custom instance that extends the [`Map` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and adds a few other methods such as `toArray()`, `getEnabled()` and `getNodeFor(id)`.

  A unique `key` property was also added to the `DraggableNode` and `DroppableContainer` interfaces. This prevents potential race conditions in the mount and cleanup effects of `useDraggable` and `useDroppable`. It's possible for the clean-up effect to run after another React component using `useDraggable` or `useDroppable` mounts, which causes the newly mounted element to accidentally be un-registered.

- [#379](https://github.com/clauderic/dnd-kit/pull/379) [`8d70540`](https://github.com/clauderic/dnd-kit/commit/8d70540771d1455c326310b438a198d2516e1d04) Thanks [@clauderic](https://github.com/clauderic)! - The `layoutMeasuring` prop of `DndContext` has been renamed to `measuring`.

  The options that could previously be passed to the `layoutMeasuring` prop now need to be passed as:

  ```diff
  <DndContext
  - layoutMeasuring={options}
  + measuring={{
  +   droppable: options
  + }}
  ```

  The `LayoutMeasuring` type has been renamed to `MeasuringConfiguration`. The `LayoutMeasuringStrategy` and `LayoutMeasuringFrequency` enums have also been renamed to `MeasuringStrategy` and `MeasuringFrequency`.

  This refactor allows consumers to configure how to measure both droppable and draggable nodes. By default, `@dnd-kit` ignores transforms when measuring draggable nodes. This beahviour can now be configured:

  ```tsx
  import {
    DndContext,
    getBoundingClientRect,
    MeasuringConfiguration,
  } from '@dnd-kit/core';

  const measuringConfig: MeasuringConfiguration = {
    draggable: {
      measure: getBoundingClientRect,
    },
  };

  function App() {
    return <DndContext measuring={measuringConfig} />;
  }
  ```

- [#350](https://github.com/clauderic/dnd-kit/pull/350) [`a13dbb6`](https://github.com/clauderic/dnd-kit/commit/a13dbb66586edbf2998c7b251e236604255fd227) Thanks [@wmain](https://github.com/wmain)! - Breaking change: The `CollisionDetection` interface has been refactored. It now receives an object that contains the `active` draggable node, along with the `collisionRect` and an array of `droppableContainers`.

  If you've built custom collision detection algorithms, you'll need to update them. Refer to [this PR](https://github.com/clauderic/dnd-kit/pull/350) for examples of how to refactor collision detection functions to the new `CollisionDetection` interface.

  The `sortableKeyboardCoordinates` method has also been updated since it relies on the `closestCorners` collision detection algorithm. If you were using collision detection strategies in a custom `sortableKeyboardCoordinates` method, you'll need to update those as well.

### Minor Changes

- [#334](https://github.com/clauderic/dnd-kit/pull/334) [`13be602`](https://github.com/clauderic/dnd-kit/commit/13be602229c6d5723b3ae98bca7b8f45f0773366) Thanks [@trentmwillis](https://github.com/trentmwillis)! - Now passing `activatorEvent` as an argument to `modifiers`

- [#376](https://github.com/clauderic/dnd-kit/pull/376) [`aede2cc`](https://github.com/clauderic/dnd-kit/commit/aede2cc42d488435cf65f19b63ba6bb7702b3fde) Thanks [@clauderic](https://github.com/clauderic)! - Mouse, Pointer, Touch sensors now cancel dragging on [visibility change](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event) and [window resize](https://developer.mozilla.org/en-US/docs/Web/API/Window/resize_event). The Keyboard sensor already cancelled dragging on window resize. It now also cancels dragging on visibility change.

- [#399](https://github.com/clauderic/dnd-kit/pull/399) [`a32a4c5`](https://github.com/clauderic/dnd-kit/commit/a32a4c5f6228b9f03bf460b8403a38b8c3de493f) Thanks [@supersebh](https://github.com/supersebh)! - Added support for `tolerance` in DistanceConstrain. As soon as the `tolerance` is exceeded, the drag operation will be aborted, unless it has already started (because distance criteria was met).

  Example usage:

  ```
  // Require the pointer be moved by 10 pixels vertically to initiate drag operation
  // Abort if the pointer is moved by more than 5 pixels horizontally.
  {
    distance: {y: 10},
    tolerance: {x: 5},
  }
  ```

  Be careful not to pick conflicting settings for distance and tolerance if used together. For example, picking a tolerance that is lower than the distance in the same axis would result in the activation constraint never being met.

- [#408](https://github.com/clauderic/dnd-kit/pull/408) [`dea715c`](https://github.com/clauderic/dnd-kit/commit/dea715c342b2d998a9f1562cacb5e70c77562c92) Thanks [@wmain](https://github.com/wmain)! - The collision rect is now completely based on the position of the `DragOverlay` when it is used. Previously, only the `width` and `height` properties of the `DragOverlay` were used for the collision rect, while the `top`, `left`, `bottom` and `right` properties were derived from the active node rect. This new approach is more aligned with developers would expect, but could cause issues for consumers that were relying on the previous (incorrect) behavior.

- [#433](https://github.com/clauderic/dnd-kit/pull/433) [`c447880`](https://github.com/clauderic/dnd-kit/commit/c447880656b6bee2915d5a5f01d3ddfbd5705fa2) Thanks [@clauderic](https://github.com/clauderic)! - Fix unwanted animations when items in sortable context change

- [#415](https://github.com/clauderic/dnd-kit/pull/415) [`2ba6dfe`](https://github.com/clauderic/dnd-kit/commit/2ba6dfe6b080b90b13aa8d9eb07331515a0d2faa) Thanks [@cantrellnm](https://github.com/cantrellnm)! - Prevent `getScrollableAncestors` from continuing to search if a fixed position node is found.

- [#377](https://github.com/clauderic/dnd-kit/pull/377) [`422d083`](https://github.com/clauderic/dnd-kit/commit/422d0831173a893099ba924bf7bbc465640fc15d) Thanks [@clauderic](https://github.com/clauderic)! - Pointer, Mouse and Touch sensors now stop propagation of click events once activation constraints are met.

- [#375](https://github.com/clauderic/dnd-kit/pull/375) [`c4b21b4`](https://github.com/clauderic/dnd-kit/commit/c4b21b4ee17cba31c10928eb227848026f54222a) Thanks [@clauderic](https://github.com/clauderic)! - Prevent context menu from opening when pointer sensor is active

- [`5a41340`](https://github.com/clauderic/dnd-kit/commit/5a41340e6561c3784da2a9266e1b852ba370918c) Thanks [@clauderic](https://github.com/clauderic)! - Pointer, Mouse and Touch sensors now prevent selection changes and clear any existing selection ranges once activation constraints are met.

- [`e2ee0dc`](https://github.com/clauderic/dnd-kit/commit/e2ee0dccb12794c419587019defddfd82ba5d297) Thanks [@clauderic](https://github.com/clauderic)! - Reset the `over` internal state of `<DndContext />` on drop.

- [`1fe9b5c`](https://github.com/clauderic/dnd-kit/commit/1fe9b5c9d34237aae6ab22d54478c419d44a079a) Thanks [@clauderic](https://github.com/clauderic)! - Sensors may now specify a static `setup` method that will be invoked when `<DndContext>` mounts. The setup method may optionally also return a teardown function that will be invoked when the `<DndContext>` associated with that sensor unmounts.

### Patch Changes

- [#430](https://github.com/clauderic/dnd-kit/pull/430) [`46ec5e4`](https://github.com/clauderic/dnd-kit/commit/46ec5e4c6e3ca9fa849666f90fef426b3c465cf0) Thanks [@clauderic](https://github.com/clauderic)! - Fix duplicate scroll ancestor detection. In some scenarios, an element could be added twice to the list of detected scrollable ancestors, resulting in invalid offsets.

- [#371](https://github.com/clauderic/dnd-kit/pull/371) [`7006464`](https://github.com/clauderic/dnd-kit/commit/700646468683e4820269534c6352cca93bb5a987) Thanks [@clauderic](https://github.com/clauderic)! - fix: do not wrap consumer-defined handlers in batchedUpdates

- [`1fe9b5c`](https://github.com/clauderic/dnd-kit/commit/1fe9b5c9d34237aae6ab22d54478c419d44a079a) Thanks [@clauderic](https://github.com/clauderic)! - The TouchSensor attempts to prevent the default browser behavior of scrolling the page by calling `event.preventDefault()` in the `touchmove` event listener. This wasn't working in iOS Safari due to a bug with dynamically attached `touchmove` event listeners. Adding a non-passive, non-capture `touchmove` event listener before dynamically attaching other `touchmove` event listeners solves the issue.

- Updated dependencies [[`0e628bc`](https://github.com/clauderic/dnd-kit/commit/0e628bce53fb1a7223cdedd203cb07b6e62e5ec1), [`13be602`](https://github.com/clauderic/dnd-kit/commit/13be602229c6d5723b3ae98bca7b8f45f0773366), [`1f5ca27`](https://github.com/clauderic/dnd-kit/commit/1f5ca27b17879861c2c545160c2046a747544846)]:
  - @dnd-kit/utilities@3.0.0

## 3.1.1

### Patch Changes

- [`dbe0087`](https://github.com/clauderic/dnd-kit/commit/dbe008787492acd7e4dae85a79fd134a7951292e) [#335](https://github.com/clauderic/dnd-kit/pull/335) Thanks [@clauderic](https://github.com/clauderic)! - Fix `getEventListenerTarget` when target element is not an instance of `HTMLElement`

- [`5d4d292`](https://github.com/clauderic/dnd-kit/commit/5d4d2922e0a6c2433049268d5db40fadd13823a3) [#331](https://github.com/clauderic/dnd-kit/pull/331) Thanks [@phungleson](https://github.com/phungleson)! - Fix typo in `SensorContext` type (`scrollAdjustedTransalte` --> `scrollAdjustedTranslate`)

## 3.1.0

### Minor Changes

- [`d39ab11`](https://github.com/clauderic/dnd-kit/commit/d39ab1112f9be78d467b2dfe488a7ea931d93767) [#316](https://github.com/clauderic/dnd-kit/pull/316) Thanks [@lsit](https://github.com/lsit)! - Added ability to optionally return screen reader announcements `onDragMove`.

## 3.0.4

### Patch Changes

- [`ae398de`](https://github.com/clauderic/dnd-kit/commit/ae398de012aee28f5e3bec10b438153d00f65630) Thanks [@clauderic](https://github.com/clauderic)! - Allow setting an optional `id` prop on `DndContext` to fix a warning during server-side rendering (especially in Next.js). By default, this `id` is autogenerated and can lead to a mismatch between the server- and client-side rendered HTML. We also avoid this mismatch by rendering the `Accessibility` component only after everything else was initially mounted on the client.

- [`8b938ce`](https://github.com/clauderic/dnd-kit/commit/8b938ceb158c67e9fdc4616351d1a3291ac614c3) Thanks [@clauderic](https://github.com/clauderic)! - Hide the node in the overlay after the drop animation is finished. This prevents some flickering with React concurrent mode.

## 3.0.3

### Patch Changes

- [`0ff788e`](https://github.com/clauderic/dnd-kit/commit/0ff788e78f5853bf33673881e5759fa844f69ec3) [#246](https://github.com/clauderic/dnd-kit/pull/246) Thanks [@inokawa](https://github.com/inokawa)! - `DragOverlay` component now passes down `style` prop to the wrapper element it renders.

## 3.0.2

### Patch Changes

- [`54c8778`](https://github.com/clauderic/dnd-kit/commit/54c877875cf7ec6d4367ca11ce216cc3eb6475d2) [#225](https://github.com/clauderic/dnd-kit/pull/225) Thanks [@clauderic](https://github.com/clauderic)! - Updated the `active` rects type to `ViewRect` (was previously incorrectly typed as `LayoutRect`)

- [`2ee96a5`](https://github.com/clauderic/dnd-kit/commit/2ee96a5c400aae52ed3c78192097e60da8c42a8d) [#243](https://github.com/clauderic/dnd-kit/pull/243) Thanks [@py-wai](https://github.com/py-wai)! - Update regex used in isScrollable, to consider element with overflow: overlay as a scrollable element.

## 3.0.1

### Patch Changes

- [`f9ec28f`](https://github.com/clauderic/dnd-kit/commit/f9ec28fed77778669f93cfecee159dba54db38b4) [#217](https://github.com/clauderic/dnd-kit/pull/217) Thanks [@clauderic](https://github.com/clauderic)! - Fixes a regression introduced with `@dnd-kit/core@3.0.0` that was causeing sensors to stop working after a drag operation where activation constraints were not met.

## 3.0.0

### Major Changes

- [`a9d92cf`](https://github.com/clauderic/dnd-kit/commit/a9d92cf1fa35dd957e6c5915a13dfd2af134c103) [#174](https://github.com/clauderic/dnd-kit/pull/174) Thanks [@clauderic](https://github.com/clauderic)! - Distributed assets now only target modern browsers. [Browserlist](https://github.com/browserslist/browserslist) config:

  ```
  defaults
  last 2 version
  not IE 11
  not dead
  ```

  If you need to support older browsers, include the appropriate polyfills in your project's build process.

- [`b406cb9`](https://github.com/clauderic/dnd-kit/commit/b406cb9251beef8677d05c45ec42bab7581a86dc) [#187](https://github.com/clauderic/dnd-kit/pull/187) Thanks [@clauderic](https://github.com/clauderic)! - Introduced the `useDndMonitor` hook. The `useDndMonitor` hook can be used within components wrapped in a `DndContext` provider to monitor the different drag and drop events that happen for that `DndContext`.

  Example usage:

  ```tsx
  import {DndContext, useDndMonitor} from '@dnd-kit/core';

  function App() {
    return (
      <DndContext>
        <Component />
      </DndContext>
    );
  }

  function Component() {
    useDndMonitor({
      onDragStart(event) {},
      onDragMove(event) {},
      onDragOver(event) {},
      onDragEnd(event) {},
      onDragCancel(event) {},
    });
  }
  ```

### Minor Changes

- [`b7355d1`](https://github.com/clauderic/dnd-kit/commit/b7355d19d9e15bb1972627bb622c2487ddec82ad) [#207](https://github.com/clauderic/dnd-kit/pull/207) Thanks [@clauderic](https://github.com/clauderic)! - The `data` argument for `useDraggable` and `useDroppable` is now exposed in event handlers and on the `active` and `over` objects.

  **Example usage:**

  ```tsx
  import {DndContext, useDraggable, useDroppable} from '@dnd-kit/core';

  function Draggable() {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
      id: 'draggable',
      data: {
        type: 'type1',
      },
    });

    /* ... */
  }

  function Droppable() {
    const {setNodeRef} = useDroppable({
      id: 'droppable',
      data: {
        accepts: ['type1', 'type2'],
      },
    });

    /* ... */
  }

  function App() {
    return (
      <DndContext
        onDragEnd={({active, over}) => {
          if (over?.data.current.accepts.includes(active.data.current.type)) {
            // do stuff
          }
        }}
      />
    );
  }
  ```

### Patch Changes

- Updated dependencies [[`a9d92cf`](https://github.com/clauderic/dnd-kit/commit/a9d92cf1fa35dd957e6c5915a13dfd2af134c103), [`b406cb9`](https://github.com/clauderic/dnd-kit/commit/b406cb9251beef8677d05c45ec42bab7581a86dc)]:
  - @dnd-kit/accessibility@3.0.0
  - @dnd-kit/utilities@2.0.0

## 2.1.2

### Patch Changes

- [`2833337`](https://github.com/clauderic/dnd-kit/commit/2833337043719853902c3989dfcd5b55ae9ddc73) [#186](https://github.com/clauderic/dnd-kit/pull/186) Thanks [@clauderic](https://github.com/clauderic)! - Simplify `useAnnouncement` hook to only return a single `announcement` rather than `entries`. Similarly, the `LiveRegion` component now only accepts a single `announcement` rather than `entries.

  - The current strategy used in the useAnnouncement hook is needlessly complex. It's not actually necessary to render multiple announcements at once within the LiveRegion component. It's sufficient to render a single announcement at a time. It's also un-necessary to clean up the announcements after they have been announced, especially now that the role="status" attribute has been added to LiveRegion, keeping the last announcement rendered means users can refer to the last status.

- Updated dependencies [[`c24bdb3`](https://github.com/clauderic/dnd-kit/commit/c24bdb3723f1e3e4c474439f837a19c6d48059fb), [`2833337`](https://github.com/clauderic/dnd-kit/commit/2833337043719853902c3989dfcd5b55ae9ddc73)]:
  - @dnd-kit/accessibility@2.0.0

## 2.1.1

### Patch Changes

- [`cc0a6ff`](https://github.com/clauderic/dnd-kit/commit/cc0a6ff310582ee4c02dd8320d86bf1c2d281d30) [#177](https://github.com/clauderic/dnd-kit/pull/177) Thanks [@FinestV](https://github.com/FinestV)! - fix calculations for top and left auto scroll speed

## 2.1.0

### Minor Changes

- [`bdb1aa2`](https://github.com/clauderic/dnd-kit/commit/bdb1aa2b62f855a4ccd048d452d4dd93529af563) [#171](https://github.com/clauderic/dnd-kit/pull/171) Thanks [@mitchheddles](https://github.com/mitchheddles)! - Added more flexibility for the `distance` and `tolerance` activation constraints. Consumers can still provide a `number` to calculate the distance or tolerance constraints, but can now also pass in an object that adheres to the `DistanceMeasurement` interface instead. This change allows consumers to specify which axis the activation distance or tolerance should be measured against, either `x`, `y` or both.

  ```
  type DistanceMeasurement =
    | number
    | {x: number}
    | {y: number}
    | {x: number, y: number}

  interface DistanceConstraint {
    distance: DistanceMeasurement;
  }

  interface DelayConstraint {
    delay: number;
    tolerance: DistanceMeasurement;
  }
  ```

  **Example usage:**

  For example, when building a list that can only be sorted vertically when using the `restrictToVerticalAxis` modifier, a consumer can now configure sensors to only measure distance against the `y` axis when using the `MouseSensor`, and afford more tolerance on the `y` axis than the `x` axis for the `TouchSensor`:

  ```
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: { y: 10 },
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: { y: 15, x: 5 },
      },
    }),
  );
  ```

  This also fixes a bug with the way the distance is calculated when passing a number to the `distance` or `tolerance` options. Previously, the sum of the distance on both the `x` and `y` axis was being calculated rather than the hypothenuse.

## 2.0.2

### Patch Changes

- [`f038174`](https://github.com/clauderic/dnd-kit/commit/f038174c2096ae287ffa6a5fab9dda09a0f76016) [#166](https://github.com/clauderic/dnd-kit/pull/166) Thanks [@shayc](https://github.com/shayc)! - AutoScrollActivator enum was being exported as a type rather than a value.

- [`7422e25`](https://github.com/clauderic/dnd-kit/commit/7422e25c069fa2a28d56a57d1e7bc1f761efb971) [#165](https://github.com/clauderic/dnd-kit/pull/165) Thanks [@clauderic](https://github.com/clauderic)! - Fix regression with autoscroll disabling by sensors

## 2.0.1

### Patch Changes

- [`a847a80`](https://github.com/clauderic/dnd-kit/commit/a847a800400a392ad4653199b6705dd687703d01) [#160](https://github.com/clauderic/dnd-kit/pull/160) Thanks [@clauderic](https://github.com/clauderic)! - Allow consumers to define drag source opacity in drop animation by setting the `dragSourceOpacity` option to a number on the `dropAnimation` prop of `DragOverlay`.

- [`ea9d878`](https://github.com/clauderic/dnd-kit/commit/ea9d878e7c1bd8b46482ee4b82a39f744db027b9) [#164](https://github.com/clauderic/dnd-kit/pull/164) Thanks [@clauderic](https://github.com/clauderic)! - Export AutoScrollActivator enum for consumers.

## 2.0.0

### Major Changes

- [`8583825`](https://github.com/clauderic/dnd-kit/commit/8583825380bc4d7c36e076be30bb5ca3fd20a26b) [#140](https://github.com/clauderic/dnd-kit/pull/140) Thanks [@clauderic](https://github.com/clauderic)! - Auto-scrolling defaults have been updated, which should generally lead to improved user experience for most consumers.

  The auto-scroller now bases its calculations based on the position of the pointer rather than the edges of the draggable element's rect by default. This change is aligned with how the native HTML 5 Drag & Drop auto-scrolling behaves.

  This behaviour can be customized using the `activator` option of the `autoScroll` prop:

  ```tsx
  import {AutoScrollActivator, DndContext} from '@dnd-kit/core';

  <DndContext autoScroll={{activator: AutoScrollActivator.DraggableRect}} />;
  ```

  The auto-scroller now also looks at scrollable ancestors in order of appearance in the DOM tree, meaning it will first attempt to scroll the window, and narrow its focus down rather than the old behaviour of looking at scrollable ancestors in order of closeness to the draggable element in the DOM tree (reversed tree order).

  This generally leads to an improved user experience, but can be customized by passing a configuration object to the `autoScroll` prop that sets the `order` option to `TraversalOrder.ReversedTreeOrder` instead of the new default value of `TraversalOrder.TreeOrder`:

  ```tsx
  import {DndContext, TraversalOrder} from '@dnd-kit/core';

  <DndContext autoScroll={{order: TraversalOrder.ReversedTreeOrder}} />;
  ```

  The autoscrolling `thresholds`, `acceleration` and `interval` can now also be customized using the `autoScroll` prop:

  ```tsx
  import {DndContext} from '@dnd-kit/core';

  <DndContext
    autoScroll={{
      thresholds: {
        // Left and right 10% of the scroll container activate scrolling
        x: 0.1,
        // Top and bottom 25% of the scroll container activate scrolling
        y: 0.25,
      },
      // Accelerate slower than the default value (10)
      acceleration: 5,
      // Auto-scroll every 10ms instead of the default value of 5ms
      interval: 10,
    }}
  />;
  ```

  Finally, consumers can now conditionally opt out of scrolling certain scrollable ancestors using the `canScroll` option of the `autoScroll` prop:

  ```tsx
  import {DndContext} from '@dnd-kit/core';

  <DndContext
    autoScroll={{
      canScroll(element) {
        if (element === document.scrollingElement) {
          return false;
        }

        return true;
      },
    }}
  />;
  ```

## 1.2.0

### Minor Changes

- [`79f6088`](https://github.com/clauderic/dnd-kit/commit/79f6088dab2d4e7443743f85b329a25a023ecd87) [#144](https://github.com/clauderic/dnd-kit/pull/144) Thanks [@clauderic](https://github.com/clauderic)! - Allow consumers to determine whether to animate layout changes and when to measure nodes. Consumers can now use the `animateLayoutChanges` prop of `useSortable` to determine whether layout animations should occur. Consumers can now also decide when to measure layouts, and at what frequency using the `layoutMeasuring` prop of `DndContext`. By default, `DndContext` will measure layouts just-in-time after sorting has begun. Consumers can override this behaviour to either only measure before dragging begins (on mount and after dragging), or always (on mount, before dragging, after dragging). Pairing the `layoutMeasuring` prop on `DndContext` and the `animateLayoutChanges` prop of `useSortable` opens up a number of new possibilities for consumers, such as animating insertion and removal of items in a sortable list.

- [`a76cd5a`](https://github.com/clauderic/dnd-kit/commit/a76cd5abcc0b17eae20d4a6256d95b47f2e9d050) [#136](https://github.com/clauderic/dnd-kit/pull/136) Thanks [@clauderic](https://github.com/clauderic)! - Added `onActivation` option to sensors. Delegated the responsibility of calling `event.preventDefault()` on activation to consumers, as consumers have the most context to decide whether it is appropriate or not to prevent the default browser behaviour on activation. Consumers of the sensors can prevent the default behaviour on activation using the `onActivation` option. Here is an example using the Pointer sensor: `useSensor(PointerSensor, {onActivation: (event) => event.preventDefault()})`

### Patch Changes

- [`adb7bd5`](https://github.com/clauderic/dnd-kit/commit/adb7bd58d7d95db5e450a1518541d3d71704529d) [#151](https://github.com/clauderic/dnd-kit/pull/151) Thanks [@clauderic](https://github.com/clauderic)! - `DragOverlay` now attempts to perform drop animation even if `transform.x` and `transform.y` are both zero.

## 1.1.0

### Minor Changes

- [`ac674e8`](https://github.com/clauderic/dnd-kit/commit/ac674e8e9f9e041af96034675a075cb9aa357927) [#135](https://github.com/clauderic/dnd-kit/pull/135) Thanks [@ranbena](https://github.com/ranbena)! - Added `dragCancel` prop to DndContext. The `dragCancel` prop can be used to cancel a drag operation on drop. The prop accepts a function that returns a boolean, or a promise returning a boolean once resolved. Return `false` to cancel the drop.

- [`208f68e`](https://github.com/clauderic/dnd-kit/commit/208f68e251c1b81a624f810f40e7c8d4f36f102d) [#111](https://github.com/clauderic/dnd-kit/pull/111) Thanks [@ranbena](https://github.com/ranbena)! - Keyboard sensor now cancels dragging on window resize

## 1.0.2

### Patch Changes

- [`423610c`](https://github.com/clauderic/dnd-kit/commit/423610ca48c5e5ca95545fdb5c5cfcfbd3d233ba) [#56](https://github.com/clauderic/dnd-kit/pull/56) Thanks [@clauderic](https://github.com/clauderic)! - Add MIT license to package.json and distributed files

- [`594a24e`](https://github.com/clauderic/dnd-kit/commit/594a24e61e2fb559bceab8b50a07ceeeadf86417) [#106](https://github.com/clauderic/dnd-kit/pull/106) Thanks [@ranbena](https://github.com/ranbena)! - Replace `animation.finished` with `animation.onfinish` for DragOverlay drop animation as the latter has much better support across browsers.

- [`fd25eaf`](https://github.com/clauderic/dnd-kit/commit/fd25eaf7c114f73918bf83801890d970c9b56d18) [#68](https://github.com/clauderic/dnd-kit/pull/68) Thanks [@Pustelto](https://github.com/Pustelto)! - Wrap attributes returned from useDraggable hook in useMemo to allow pure component optimization

- Updated dependencies [[`423610c`](https://github.com/clauderic/dnd-kit/commit/423610ca48c5e5ca95545fdb5c5cfcfbd3d233ba)]:
  - @dnd-kit/accessibility@1.0.2
  - @dnd-kit/utilities@1.0.2

## 1.0.1

### Patch Changes

- [`5194696`](https://github.com/clauderic/dnd-kit/commit/5194696b4b91f26379cd3e6c11b2d66c92d32c5b) [#51](https://github.com/clauderic/dnd-kit/pull/51) Thanks [@clauderic](https://github.com/clauderic)! - Fix issue with reducer initial state variable causing collisions due to variable references all pointing to the original initial state variable.

- [`310bbd6`](https://github.com/clauderic/dnd-kit/commit/310bbd6370e85f8fb16cad149e6254600a5beb3a) [#37](https://github.com/clauderic/dnd-kit/pull/37) Thanks [@nickpresta](https://github.com/nickpresta)! - Fix typo in package.json repository URL

- Updated dependencies [[`0b343c7`](https://github.com/clauderic/dnd-kit/commit/0b343c7e88a68351f8a39f643e9f26b8e046ef48), [`310bbd6`](https://github.com/clauderic/dnd-kit/commit/310bbd6370e85f8fb16cad149e6254600a5beb3a)]:
  - @dnd-kit/utilities@1.0.1
  - @dnd-kit/accessibility@1.0.1

## 1.0.0

### Major Changes

- [`2912350`](https://github.com/clauderic/dnd-kit/commit/2912350c5008c2b0edda3bae30b5075a852dea63) Thanks [@clauderic](https://github.com/clauderic)! - Initial public release.

### Patch Changes

- Updated dependencies [[`2912350`](https://github.com/clauderic/dnd-kit/commit/2912350c5008c2b0edda3bae30b5075a852dea63)]:
  - @dnd-kit/accessibility@1.0.0
  - @dnd-kit/utilities@1.0.0

## 0.1.1

### Patch Changes

- [`2bb3065`](https://github.com/clauderic/dnd-kit/commit/2bb3065abeb83ca346c080715ee8bbe093459125) Thanks [@clauderic](https://github.com/clauderic)! - No longer setting `pointer-events` to `none` for DragOverlay component as it interferes with custom cursors.

- [`bf04b2b`](https://github.com/clauderic/dnd-kit/commit/bf04b2b7736dad0be66a2c9136bf18ec0417df62) Thanks [@clauderic](https://github.com/clauderic)! - Allow nullish values to be passed to `useSensors` for conditional sensors.

## 0.1.0

### Minor Changes

- [`7bd4568`](https://github.com/clauderic/dnd-kit/commit/7bd4568e9f339552fd73a9a4c888460b11195a5e) [#30](https://github.com/clauderic/dnd-kit/pull/30) - Initial beta release, authored by [@clauderic](https://github.com/clauderic).

### Patch Changes

- Updated dependencies [[`7bd4568`](https://github.com/clauderic/dnd-kit/commit/7bd4568e9f339552fd73a9a4c888460b11195a5e)]:
  - @dnd-kit/accessibility@0.1.0
  - @dnd-kit/utilities@0.1.0
