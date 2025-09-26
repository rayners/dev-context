# FoundryVTT Module Architecture Patterns

*Common patterns and architectural decisions for Foundry module development*

## Universal Module Structure

### Standard Directory Layout
```
src/
  api/              # Public API implementations
  providers/        # Integration adapters for other modules/systems
  types/            # TypeScript type definitions
  core/             # Core business logic
  ui/               # User interface components
  hooks/            # Foundry hook management
  utils/            # Utility functions
test/               # Unit and integration tests
dist/               # Build output (git-ignored)
templates/          # Handlebars templates
styles/             # CSS/SCSS stylesheets
languages/          # Localization files
```

### Module Entry Point Pattern
```typescript
// src/module.ts
import { ModuleApi } from './api';
import { HookManager } from './hooks';
import { SettingsManager } from './settings';

Hooks.once('init', () => {
  console.log('Module | Initializing');

  // Register settings
  SettingsManager.registerSettings();

  // Set up hooks
  HookManager.initialize();

  // Expose API
  game.modules.get('module-id').api = new ModuleApi();
});
```

## System-Agnostic Design Patterns

### System Detection and Configuration
```typescript
// src/system-config.ts
interface SystemConfig {
  movementRates: { onFoot: number; mounted: number };
  skillNames: { pathfinder: string; lookout: string };
  diceFormulas: { encounter: string };
}

const SYSTEM_CONFIGS: Record<string, SystemConfig> = {
  'dragonbane': {
    movementRates: { onFoot: 15, mounted: 30 },
    skillNames: { pathfinder: 'BUSHCRAFT', lookout: 'SPOT HIDDEN' },
    diceFormulas: { encounter: '1d6' }
  },
  'dnd5e': {
    movementRates: { onFoot: 24, mounted: 48 },
    skillNames: { pathfinder: 'Survival', lookout: 'Perception' },
    diceFormulas: { encounter: '1d20' }
  }
};

export function getSystemConfig(): SystemConfig {
  return SYSTEM_CONFIGS[game.system.id] || SYSTEM_CONFIGS['default'];
}
```

### Adapter Pattern for System Integration
```typescript
// src/system-adapter.ts
abstract class BaseSystemAdapter {
  abstract getSkillValue(actor: Actor, skillName: string): number | null;
  abstract rollSkill(actor: Actor, skillName: string): Promise<Roll>;
}

class DragonbaneAdapter extends BaseSystemAdapter {
  getSkillValue(actor: Actor, skillName: string): number | null {
    if (isDragonbaneActor(actor)) {
      const skill = actor.getSkill(skillName);
      return skill?.system?.value || null;
    }
    return null;
  }
}

class DnD5eAdapter extends BaseSystemAdapter {
  getSkillValue(actor: Actor, skillName: string): number | null {
    return actor.system?.skills?.[skillName]?.total || null;
  }
}
```

### Feature Detection Pattern
```typescript
// src/feature-detection.ts
export class FeatureDetector {
  static hasCalendarModule(): boolean {
    return game.modules.get('seasons-and-stars')?.active ||
           game.modules.get('simple-calendar')?.active;
  }

  static hasWeatherModule(): boolean {
    return game.modules.get('simple-weather')?.active;
  }

  static getCalendarAPI(): any {
    if (game.modules.get('seasons-and-stars')?.active) {
      return game.seasonsStars;
    }
    if (game.modules.get('simple-calendar')?.active) {
      return window.SimpleCalendar;
    }
    return null;
  }
}
```

## Provider Pattern Architecture

### Base Provider Interface
```typescript
// src/providers/base-provider.ts
export interface BaseProvider {
  readonly moduleId: string;
  readonly isAvailable: boolean;

  initialize(): Promise<void>;
  getCurrentDate(): CalendarDate;
  formatDate(date: CalendarDate): string;
  advanceTime(seconds: number): Promise<void>;
}

export abstract class BaseCalendarProvider implements BaseProvider {
  abstract readonly moduleId: string;

  get isAvailable(): boolean {
    return game.modules.get(this.moduleId)?.active || false;
  }

  abstract initialize(): Promise<void>;
  abstract getCurrentDate(): CalendarDate;
  abstract formatDate(date: CalendarDate): string;
  abstract advanceTime(seconds: number): Promise<void>;
}
```

### Provider Registration System
```typescript
// src/providers/provider-manager.ts
export class ProviderManager {
  private static providers: Map<string, BaseProvider> = new Map();
  private static activeProvider: BaseProvider | null = null;

  static registerProvider(provider: BaseProvider): void {
    this.providers.set(provider.moduleId, provider);
  }

  static async detectAndInitialize(): Promise<void> {
    for (const [id, provider] of this.providers) {
      if (provider.isAvailable) {
        await provider.initialize();
        this.activeProvider = provider;
        console.log(`Provider Manager | Using ${id} provider`);
        return;
      }
    }
    console.warn('Provider Manager | No compatible providers found');
  }

  static getActiveProvider(): BaseProvider | null {
    return this.activeProvider;
  }
}
```

## Hook Management Patterns

### Centralized Hook Registration
```typescript
// src/hooks/hook-manager.ts
export class HookManager {
  private static registeredHooks: string[] = [];

  static initialize(): void {
    this.registerHook('updateWorldTime', this.onTimeUpdate);
    this.registerHook('createActor', this.onActorCreate);
    this.registerHook('renderActorSheet', this.onActorSheetRender);
  }

  private static registerHook(hookName: string, callback: Function): void {
    Hooks.on(hookName, callback);
    this.registeredHooks.push(hookName);
    console.log(`Hook Manager | Registered ${hookName}`);
  }

  static cleanup(): void {
    this.registeredHooks.forEach(hookName => {
      Hooks.off(hookName);
    });
    this.registeredHooks = [];
  }

  private static onTimeUpdate = (worldTime: number): void => {
    // Handle time updates
  };

  private static onActorCreate = (actor: Actor): void => {
    // Handle actor creation
  };
}
```

### Hook Translation Pattern
```typescript
// src/hooks/hook-translator.ts
export class HookTranslator {
  // Translate between module-specific hooks
  static translateCalendarHooks(): void {
    // Listen to Seasons & Stars hooks
    Hooks.on('seasonsStars.timeChanged', (newTime) => {
      // Emit Simple Calendar compatible hook
      Hooks.call('simple-calendar.dateTimeChanged', {
        date: this.convertToSimpleCalendarFormat(newTime)
      });
    });

    // Listen to Simple Calendar hooks (if present)
    Hooks.on('simple-calendar.dateTimeChanged', (data) => {
      // Emit generic time change hook
      Hooks.call('module.timeChanged', data.date);
    });
  }
}
```

## API Design Patterns

### Public API Structure
```typescript
// src/api/module-api.ts
export class ModuleApi {
  readonly version = '1.0.0';

  // Calendar operations
  getCurrentDate(): CalendarDate {
    const provider = ProviderManager.getActiveProvider();
    return provider?.getCurrentDate() || this.getFallbackDate();
  }

  async advanceTime(seconds: number): Promise<void> {
    const provider = ProviderManager.getActiveProvider();
    if (provider) {
      await provider.advanceTime(seconds);
    } else {
      await this.fallbackAdvanceTime(seconds);
    }
  }

  // Party management (example from J&J)
  createParty(name: string, memberIds: string[]): Promise<Actor> {
    return PartyManager.createParty(name, memberIds);
  }

  // Error-safe operations
  private getFallbackDate(): CalendarDate {
    return {
      year: 1,
      month: 1,
      day: 1,
      weekday: 1
    };
  }
}
```

### Error-Resilient API Pattern
```typescript
// src/api/error-handling.ts
export function withErrorHandling<T>(
  operation: () => T,
  fallback: T,
  context: string
): T {
  try {
    return operation();
  } catch (error) {
    console.error(`${context} | Error:`, error);
    ui.notifications?.error(`Failed to ${context.toLowerCase()}`);
    return fallback;
  }
}

// Usage
export function safeGetCalendarDate(): CalendarDate {
  return withErrorHandling(
    () => game.seasonsStars.api.getCurrentDate(),
    { year: 1, month: 1, day: 1, weekday: 1 },
    'Get Calendar Date'
  );
}
```

## Widget and UI Patterns

### Widget Factory Pattern
```typescript
// src/ui/widget-manager.ts
export class WidgetManager {
  private static widgets: Map<string, BaseWidget> = new Map();

  static registerWidget(id: string, widget: BaseWidget): void {
    this.widgets.set(id, widget);
  }

  static renderAllWidgets(): void {
    for (const [id, widget] of this.widgets) {
      if (widget.shouldRender()) {
        widget.render();
      }
    }
  }

  static positionWidget(widget: BaseWidget, target: Element): void {
    // Element-specific positioning with fallback
    const position = this.calculatePosition(widget, target);
    widget.setPosition(position);
  }
}
```

### Sheet Extension Pattern
```typescript
// src/ui/sheet-extensions.ts
export class SheetExtensions {
  static extendActorSheet(): void {
    // Extend existing actor sheets
    const originalGetData = ActorSheet.prototype.getData;
    ActorSheet.prototype.getData = function(options) {
      const data = originalGetData.call(this, options);

      // Add module-specific data
      if (this.actor.type === 'journeys-and-jamborees.party') {
        data.partyData = PartyManager.getPartyData(this.actor);
      }

      return data;
    };
  }
}
```

### ApplicationV2 Architecture Pattern

ApplicationV2 is FoundryVTT's modern UI framework introduced in V12 that will eventually replace the legacy Application class. It provides a component-based architecture with better lifecycle events and improved accessibility.

**References**:
- https://foundryvtt.wiki/en/development/api/applicationv2
- https://foundryvtt.com/api/v13/classes/foundry.applications.api.ApplicationV2.html
- https://foundryvtt.com/api/v13/classes/foundry.applications.api.DocumentSheetV2.html

#### Key ApplicationV2 Improvements over V1
- **Native light/dark mode support**
- **Better application window frames**
- **Architecture supports non-Handlebars rendering engines** much more easily
- **Support for partial re-rendering** with the PARTS system
- **Better lifecycle events** and improved a11y handling
- **Overall simpler and cleaner** to implement
- **No jQuery by default** - uses native DOM manipulation (jQuery still available if preferred)

#### Which Class to Extend

Unlike Application V1, ApplicationV2 requires a rendering mixin. For most use cases:

```typescript
// Use HandlebarsApplicationMixin for Handlebars templates
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class MyApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    tag: "div", // or "form" for form applications
    window: {
      title: "My Application",
      icon: "fas fa-calendar"
    },
    position: {
      width: 400,
      height: 300
    },
    actions: {
      myAction: MyApplication.myAction
    }
  };

  static PARTS = {
    content: {
      template: "modules/my-module/templates/content.hbs"
    }
  };

  async _prepareContext(options) {
    return {
      title: "My Application",
      // Include any data needed by templates
    };
  }

  _onRender(context, options) {
    // Add non-click event listeners here
    // Click events should use the actions system instead
  }

  static myAction(event, target) {
    console.log(this); // Points to the application instance
  }
}
```

#### The PARTS System (HandlebarsApplicationMixin)

The PARTS system enables **modular UI composition** with independent template rendering and partial re-rendering capabilities.

##### HandlebarsTemplatePart Structure
```typescript
/**
 * @typedef {Object} HandlebarsTemplatePart
 * @property {string} template                      The template entry-point for the part
 * @property {string} [id]                          A CSS id to assign to the top-level element
 *                                                  (automatically prefixed by application id)
 * @property {string[]} [classes]                   CSS classes for the top-level element
 * @property {string[]} [templates]                 Additional templates required for the part
 * @property {string[]} [scrollable]                Selectors whose scroll positions should persist
 *                                                  during re-render (empty string = root level)
 * @property {Record<string, ApplicationFormConfiguration>} [forms]  Form selectors and handlers
 */
```

##### Multi-Part Application Example
```typescript
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class CalendarApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  static PARTS = {
    // Simple part - just a template
    header: {
      template: "modules/seasons-stars/templates/calendar-header.hbs"
    },

    // Part with scrollable content
    calendar: {
      template: "modules/seasons-stars/templates/calendar-grid.hbs",
      scrollable: [""], // Root level scrollable
      classes: ["calendar-main"]
    },

    // Part with additional templates and scrollable areas
    events: {
      template: "modules/seasons-stars/templates/event-list.hbs",
      templates: [
        "modules/seasons-stars/templates/partials/event-item.hbs"
      ],
      scrollable: ["ul.event-list"],
      id: "event-container"
    }
  };

  async _prepareContext(options) {
    // Shared context for all parts
    return {
      currentUser: game.user,
      isGM: game.user.isGM,
      // Add shared data here
    };
  }

  async _preparePartContext(partId, context) {
    // Add partId to context (done by default)
    context.partId = `${this.id}-${partId}`;

    // Part-specific context preparation
    switch (partId) {
      case "calendar":
        return {
          ...context,
          days: await this.getCalendarDays(),
          currentMonth: this.getCurrentMonth()
        };

      case "events":
        return {
          ...context,
          events: await this.getEvents(),
          categories: this.getEventCategories()
        };

      default:
        return context;
    }
  }
}
```

##### Key PARTS System Benefits

**1. Partial Re-rendering**
```typescript
// Update only specific parts instead of the entire application
async updateCalendarGrid() {
  await this.render({ parts: ["calendar"] });
}

// Update multiple specific parts
async updateTimeAndEvents() {
  await this.render({ parts: ["header", "events"] });
}

// Conditional part rendering based on data
_configureRenderOptions(options) {
  super._configureRenderOptions(options);

  // Only show advanced parts if user has permission
  options.parts = ["header", "main"];
  if (game.user.isGM) {
    options.parts.push("gm-controls");
  }

  // Conditionally show tabs based on document type
  if (this.document?.type === "complex") {
    options.parts.push("advanced-tab");
  }
}
```

**2. Template Organization and Reuse**
- Each part can reference additional templates via the `templates` array
- Templates are automatically loaded before first render
- Supports both main templates and reusable partials
- Parts are concatenated in the order defined in the `PARTS` object

```typescript
static PARTS = {
  // Part with additional template dependencies
  inventory: {
    template: "modules/my-module/templates/inventory.hbs",
    templates: [
      "modules/my-module/templates/partials/item-card.hbs",
      "modules/my-module/templates/partials/item-controls.hbs"
    ]
  }
};
```

#### Form Handling in ApplicationV2

ApplicationV2 has built-in form handling. Set `tag: "form"` and configure the form handler:

```typescript
export class MyFormApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    tag: "form", // Essential for form functionality
    form: {
      handler: MyFormApp.myFormHandler,
      submitOnChange: false,
      closeOnSubmit: false
    }
  };

  /**
   * Process form submission for the sheet
   * @this {MyFormApp}                        The handler is called with the application as its bound scope
   * @param {SubmitEvent} event                The originating form submission event
   * @param {HTMLFormElement} form             The form element that was submitted
   * @param {FormDataExtended} formData        Processed data for the submitted form
   * @returns {Promise<void>}
   */
  static async myFormHandler(event, form, formData) {
    console.log("Form submitted:", formData.object);
    // Process the form data here
  }
}
```

#### Actions System (Click Event Handling)

The actions system replaces `activateListeners` from Application V1:

```typescript
static DEFAULT_OPTIONS = {
  actions: {
    deleteItem: MyApp.deleteItem,
    editItem: MyApp.editItem,
    rollDice: MyApp.rollDice
  }
};

// Action handlers are static but have access to `this` (the app instance)
static deleteItem(event, target) {
  const itemId = target.dataset.itemId;
  console.log(this); // Points to the application instance
  // Handle deletion
}

static editItem(event, target) {
  // Handle editing
}
```

Use in templates with `data-action` attributes:
```handlebars
<button type="button" data-action="deleteItem" data-item-id="{{item.id}}">
  Delete Item
</button>
```

#### ApplicationV2 Lifecycle Methods

Key lifecycle methods for customization:

```typescript
export class MyApp extends HandlebarsApplicationMixin(ApplicationV2) {
  // Called once before first render - load templates here
  async _preFirstRender(context, options) {
    await super._preFirstRender(context, options);
    // Additional one-time setup
  }

  // Configure which parts to render
  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
    // Modify options.parts array here
  }

  // Prepare shared context for all parts
  async _prepareContext(options) {
    return {
      // Data shared across all parts
    };
  }

  // Prepare context specific to each part
  async _preparePartContext(partId, context) {
    context.partId = `${this.id}-${partId}`;
    // Add part-specific data
    return context;
  }

  // Called after rendering (replaces activateListeners)
  _onRender(context, options) {
    // Add non-click event listeners
    // Click events should use the actions system
  }
}
```

#### Document Sheets (DocumentSheetV2)

For document sheets, extend `DocumentSheetV2` instead:

```typescript
const { DocumentSheetV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class MyActorSheet extends HandlebarsApplicationMixin(DocumentSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["my-actor-sheet"],
    position: { width: 600, height: 700 },
    actions: {
      rollSkill: MyActorSheet.rollSkill
    }
  };

  static PARTS = {
    header: { template: "modules/my-module/templates/actor-header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    attributes: { template: "modules/my-module/templates/actor-attributes.hbs" },
    skills: { template: "modules/my-module/templates/actor-skills.hbs" }
  };

  // DocumentSheetV2 provides document context automatically
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    // Add custom data
    context.enrichedBiography = await TextEditor.enrichHTML(
      this.document.system.biography,
      { secrets: this.document.isOwner }
    );

    return context;
  }

  static async rollSkill(event, target) {
    const skillId = target.dataset.skillId;
    // Handle skill roll
  }
}

// Register the sheet
Hooks.once("init", () => {
  DocumentSheetConfig.registerSheet(Actor, "my-module", MyActorSheet, {
    label: "My Actor Sheet",
    types: ["character", "npc"],
    makeDefault: true
  });
});
```

#### Best Practices for ApplicationV2 Development

1. **Use HandlebarsApplicationMixin** unless you need a different rendering engine
2. **Leverage PARTS for modularity** - each part should have a clear purpose
3. **Use actions for click events** instead of manual event listeners
4. **Prepare context efficiently** - only compute what each part needs
5. **Take advantage of partial rendering** with `render({ parts: [...] })`
6. **Follow the lifecycle** - use appropriate methods for setup and teardown

## Data Storage Patterns

### Settings Management
```typescript
// src/settings/settings-manager.ts
export class SettingsManager {
  static registerSettings(): void {
    // Module configuration
    game.settings.register('module-id', 'enableFeature', {
      name: 'Enable Feature',
      hint: 'Enable this feature for enhanced functionality',
      scope: 'world',
      config: true,
      type: Boolean,
      default: true
    });

    // System-specific settings
    const systemConfig = getSystemConfig();
    game.settings.register('module-id', 'pathfinderSkill', {
      name: 'Pathfinder Skill',
      hint: 'Skill used for pathfinding',
      scope: 'world',
      config: true,
      type: String,
      choices: this.getSkillChoices(),
      default: systemConfig.skillNames.pathfinder
    });
  }

  static getSetting<T>(key: string): T {
    return game.settings.get('module-id', key) as T;
  }

  static async setSetting<T>(key: string, value: T): Promise<void> {
    await game.settings.set('module-id', key, value);
  }
}
```

### Document Integration Pattern
```typescript
// src/documents/party-actor.ts
export class PartyActor extends Actor {
  // Add custom methods to actor
  addMember(actorId: string): Promise<void> {
    const memberStatus = this.system.memberStatus || {};
    memberStatus[actorId] = { status: 'active', role: 'none' };

    return this.update({
      'system.memberStatus': memberStatus
    });
  }

  removeMember(actorId: string): Promise<void> {
    // Use Foundry deletion syntax
    return this.update({
      [`system.memberStatus.-=${actorId}`]: null
    });
  }

  get activeMembers(): Actor[] {
    const memberStatus = this.system.memberStatus || {};
    return Object.keys(memberStatus)
      .filter(id => memberStatus[id].status === 'active')
      .map(id => game.actors.get(id))
      .filter(actor => actor);
  }
}
```

## TypeScript Integration Patterns

### Type Definition Structure
```typescript
// src/types/foundry-extensions.d.ts
declare global {
  interface Game {
    seasonsStars?: {
      api: SeasonsStarsAPI;
      integration: IntegrationAPI;
    };
  }

  interface Window {
    SimpleCalendar?: SimpleCalendarAPI;
  }
}

// src/types/module-types.ts
export interface CalendarDate {
  year: number;
  month: number;
  day: number;
  weekday: number;
}

export interface PartyMember {
  actorId: string;
  status: 'active' | 'traveling' | 'staying';
  role: 'pathfinder' | 'lookout' | 'quartermaster' | 'none';
}
```

### Type Guards Pattern
```typescript
// src/types/type-guards.ts
export function isDragonbaneActor(actor: any): actor is DragonbaneActor {
  return actor &&
         game.system.id === 'dragonbane' &&
         typeof actor.getSkill === 'function';
}

export function isPartyActor(actor: Actor): boolean {
  return actor.type === 'journeys-and-jamborees.party';
}

export function hasIntegrationAPI(module: any): boolean {
  return module?.integration && typeof module.integration === 'object';
}
```

## Performance Optimization Patterns

### Lazy Loading Pattern
```typescript
// src/utils/lazy-loader.ts
export class LazyLoader {
  private static cache: Map<string, any> = new Map();

  static async loadResource<T>(
    key: string,
    loader: () => Promise<T>
  ): Promise<T> {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const resource = await loader();
    this.cache.set(key, resource);
    return resource;
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
```

### Debounced Updates Pattern
```typescript
// src/utils/debouncer.ts
export class Debouncer {
  private static timers: Map<string, NodeJS.Timeout> = new Map();

  static debounce(key: string, fn: Function, delay: number): void {
    const existingTimer = this.timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      fn();
      this.timers.delete(key);
    }, delay);

    this.timers.set(key, timer);
  }
}
```

## Error Handling and Logging

### Structured Logging Pattern
```typescript
// src/utils/logger.ts
export class Logger {
  private static prefix = 'Module Name';

  static info(message: string, data?: any): void {
    console.log(`${this.prefix} | ${message}`, data || '');
  }

  static warn(message: string, data?: any): void {
    console.warn(`${this.prefix} | ${message}`, data || '');
  }

  static error(message: string, error?: Error): void {
    console.error(`${this.prefix} | ${message}`, error || '');
    if (error?.stack) {
      console.error(error.stack);
    }
  }

  static debug(message: string, data?: any): void {
    if (game.settings.get('module-id', 'debugLogging')) {
      console.debug(`${this.prefix} | DEBUG | ${message}`, data || '');
    }
  }
}
```

## Clean Architecture Principles

### Separation of Concerns
- **Core Logic**: Independent of Foundry specifics
- **API Layer**: Foundry integration and external interfaces
- **UI Layer**: User interface and rendering
- **Data Layer**: Settings, documents, and persistence

### Dependency Injection Pattern
```typescript
// src/core/dependency-container.ts
export class DependencyContainer {
  private static services: Map<string, any> = new Map();

  static register<T>(key: string, service: T): void {
    this.services.set(key, service);
  }

  static get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not registered`);
    }
    return service;
  }
}
```

This architecture provides maintainable, testable, and extensible module design that scales across different Foundry systems and use cases.