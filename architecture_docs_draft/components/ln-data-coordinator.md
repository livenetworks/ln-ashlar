# 🌐 ln-data-coordinator

> **Класификација:** ⚙️ Координатор (Coordinator / Orchestrator)

---

## 1. Заднинско дејство и одговорност

- **Краток опис:**
  `ln-data-coordinator` е централниот координатор дефиниран во модулот [`js/ln-data-coordinator/src/ln-data-coordinator.js`](../../js/ln-data-coordinator/src/ln-data-coordinator.js) задужен за оркестрирање на податочниот слој (Local-First Architecture). Тој нема сопствено локално складиште и не иницира мрежни повици независно; неговата одговорност е **да ги набљудува, поврзува и оркестрира податочните слоеви во сопствениот DOM подграф** (`ln-data-store`, `ln-api-connector` / `ln-couchdb-connector` / `ln-websocket-connector` / `ln-rest-connector`, `ln-api-queue`) и да опслужува view компоненти кои можат да бидат било каде во документот (на пр. `ln-table`, `ln-list`, `ln-stat`, `ln-options`), слушајќи ги нивните барања на document ниво.

- **Ортогоналност (Што компонентата НЕ прави):**
  - **НЕ складира податоци во меморија или IndexedDB:** За зачувување на податоците е одговорен `ln-data-store`.
  - **НЕ извршува директен HTTP/REST/WS транспорт:** Транспортот на мрежните барања го извршуваат конекторите (препознава `data-ln-api-connector`, `data-ln-couchdb-connector`, `data-ln-rest-connector`, и `data-ln-websocket-connector`).
  - **НЕ управува со офлајн редицата:** За кеширање на барањата при прекината мрежа се грижи `ln-api-queue`.

---

## 2. Минимален HTML Маркап и Варијанти на Употреба

### Базен HTML Маркап (Local-First Data Subtree)
```html
<div data-ln-data-coordinator="users" id="users-coordinator">
    <!-- Локална база (IndexedDB) -->
    <div data-ln-data-store="users" id="users-store"></div>
    
    <!-- Мрежен транспорт (REST API) -->
    <div data-ln-api-connector="/api/users" id="users-connector"></div>
    
    <!-- Офлајн редица (опционално) -->
    <div data-ln-api-queue id="users-queue"></div>
</div>
```

### Варијанти на употреба

#### Пример 1: Обичен Податочен Координатор
Оркестрира автоматска синхронизација меѓу IndexedDB складиштето и REST API конекторот:
```html
<div data-ln-data-coordinator="products">
    <div data-ln-data-store="products"></div>
    <div data-ln-api-connector="/api/v1/products"></div>
</div>
```

#### Пример 2: Поврзување со надворешни View компоненти
View компонентите (како `ln-table`, `ln-list`, `ln-stat`) можат да се наоѓаат било каде во документот, надвор од DOM подграфот на координаторот. Тие комуницираат со координаторот преку `document` настани, поврзувајќи се преку името на store-от (на пр. `data-ln-table-store="users"`).

```html
<!-- Data Layer: Координатор -->
<div data-ln-data-coordinator="users">
    <div data-ln-data-store="users"></div>
    <div data-ln-api-connector="/api/users"></div>
</div>

<!-- View Layer: Компоненти кои го конзумираат "users" складиштето -->
<label class="search">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-search"></use></svg>
    <input type="search" 
           placeholder="Пребарај..." 
           data-ln-search="users-table" 
           aria-label="Пребарај корисници">
    <button type="button" data-ln-search-clear aria-label="Исчисти го пребарувањето">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
    </button>
</label>

<div id="users-table" data-ln-table="users" data-ln-table-source="users" data-ln-table-store="users">
    <table>
        <!-- Координаторот ќе одговори на барањата за податоци од оваа табела -->
    </table>
</div>
```

---

## 3. Декларативен API Договор (Атрибути и Настани)

### Табела со атрибути (HTML Attributes & Properties)

| Атрибут / Својство | Елемент | Тип | Стандардна вредност | Опис |
| :--- | :--- | :--- | :--- | :--- |
| `data-ln-data-coordinator` | Обвивач | `String` | Име на складиштето | Маркер за компонентата. Го дефинира просторот за имиња. |
| `data-ln-data-mapper` | Обвивач | `String` | Име на координатор | Регистриран мапер. Реактивен е (при промена тригерира `refreshMapper()`). Ако фали, се бара мапер со името на координаторот. |
| `data-ln-data-coordinator-stale` | Обвивач | `Number/String` | `300` | Време во секунди по кое кешот е застарен. Има fallback на `data-ln-data-store-stale` / `data-ln-store-stale`. |
| `data-ln-data-coordinator-no-autosync` | Обвивач | Marker | / | Спречува автоматска синхронизација. Има fallback на `data-ln-data-store-no-autosync` / `data-ln-store-no-autosync`. |
| `lnDataCoordinator` / `lnCoordinator` | DOM Елемент | `Object` | `instance` | Референци до JS инстанцата на координаторот. |

### Настани (Events API)

#### Примени настани (Слуша од децата и од document ниво)
- `ln-store:initialized` — Иницијализација на складиштето (ако кешот е празен или застарен, прави `forceSync`).
- `ln-store:request-remote-sync` / `create` / `update` / `delete` / `bulk-delete` — Барања за мутации на серверот.
- `ln-store:ready` / `loaded` / `created` / `updated` / `deleted` / `synced` — Тригери за освежување на view компонентите (за `synced` само ако `detail.changed` е true).
- `ln-api-queue:send` — Извршување на барање од офлајн редицата.
- `ln-table:request-data`, `ln-list:request-data`, `ln-options:request-data`, `ln-stat:request-count` — Барања од view компоненти (на ниво на `document`). Се совпаѓаат преку атрибути како `data-ln-table-store`.

#### Диспачирани настани
- `ln-table:set-data`, `ln-list:set-data`, `ln-options:set-data`, `ln-stat:set-count` — Испраќање податоци/бројачи кон view компонентите.
- `ln-table:set-loading` — Диспачиран кога податоците се бараат, но store уште не е вчитан.
- `ln-api-queue:request-enqueue`, `ln-api-queue:ack`, `ln-api-queue:nack`, `ln-api-queue:request-remap` — Сигнали кон офлајн редицата (на пр. `request-remap` при `create` низ редицата за менување од `tempId` во серверски id). Единствениот настан во обратната насока е `ln-api-queue:send` (види Примени настани).
- `ln-store:sync-conflict` — Диспачиран при 4xx грешка од редицата (освен 401/419 и 409 при `update`) за отфрлање и реверт.
- `ln-store:online`, `ln-store:offline` — Сигнали за мрежната состојба.

---

## 4. CSS Стилизирање и Поведенски Концепт

- `ln-data-coordinator` е чист логички координатор кој НЕ инјектира и НЕ бара специфични CSS класи за сопствениот DOM обвивач.
- Координаторот комуницира со своите деца со повикување методи на JS инстанците (`store.applySync()`, `store.confirmMutation()`, `store.revertMutation()`, `connector.fetchDelta()`) и со емитување настани.

### Вградени Политики на Однесување (Behaviors)
- **Иницијална Синхронизација:** Координаторот извршува `forceSync` доколку при `ln-store:initialized` кешот е празен ИЛИ застарен.
- **Autosync:** Автоматски се извршува синхронизација на `visibilitychange` на документот (доколку табот стане видлив и кешот е застарен) како и при враќање `online`.
- **Офлајн Queue и Таксономија на Грешки:**
  - `401` / `419` (Auth Errors) → Се диспачира `nack` (паузирање на редицата).
  - `409` (Conflict при update) → Се повикува `resolveConflict(id, remoteRecord, fieldDiffs)` и барањето се отфрла (drop).
  - Останати `4xx` грешки → Се диспачира `ln-store:sync-conflict`, се повикува реверт, барањето се отфрла и се прави `forceSync`.
  - `5xx` или Мрежна грешка → Се диспачира `nack` (повторен обид подоцна).

---

## 5. Пристапност (ARIA) и Чести Грешки

### 5.1 ARIA & Навигација
Координаторот е невидлив, чисто логички елемент — нема сопствени ARIA улоги ниту манипулира со ARIA атрибути. Пристапноста на прикажаните податоци е одговорност на view компонентите (`ln-table`, `ln-list`, `ln-stat`) кои ги примаат неговите `set-data` / `set-count` настани.

### 5.2. Чести Грешки (Anti-Patterns / Common Pitfalls)

> [!CAUTION]
> **1. Мешање на локални и надворешни деца**
> `ln-data-coordinator` ги открива своите основни слоеви (`ln-data-store`, `ln-api-connector`, `ln-api-queue`) исклучиво во својот сопствен DOM подграф. Ако тие се поставени надвор, координацијата нема да работи. Наспроти нив, **view компонентите** (`ln-table`, `ln-list` итн.) **може да се наоѓаат било каде во документот**, бидејќи координаторот слуша за нивните настани на `document` ниво и ги поврзува преку store името (пр. `data-ln-table-store`).

> [!WARNING]
> **2. Користење на депрецирани инлајн мапери `<script data-ln-mapper>`**
> Инлајн скрипт маперите се отстранети поради XSS ранливости (`eval`). Секогаш регистрирајте ги вашите мапери безбедно преку `window.lnCore.registerDataMapper(...)`.

> [!TIP]
> **3. Автоматско управување со грешки (Rollback/Conflict)**
> За разлика од рачните координатори, `ln-data-coordinator` автоматски ги менаџира грешките: при мрежна грешка повикува `revertMutation()`, а при 409 конфликт повикува `resolveConflict()`. Консумерот не треба рачно да имплементира логика за враќање на оригиналната состојба.

---

## 6. Дијаграм на Текот и Животен Циклус

```mermaid
sequenceDiagram
    autonumber
    actor Dev as HTML / UI
    participant Coord as ln-data-coordinator
    participant Store as ln-data-store (IndexedDB)
    participant Conn as ln-api-connector (HTTP)

    Note over Dev, Conn: Сценарио 1: Local-First Data Orchestration
    Store->>Coord: Event: ln-store:request-remote-create { tempId, data }
    Coord->>Conn: connector.create(egressData)
    alt HTTP 200 OK
        Conn-->>Coord: Server response (rawRecord)
        Coord->>Store: store.confirmMutation(tempId, confirmedRecord)
    else HTTP Error / Offline
        Conn-->>Coord: Network Error / Status 500
        Coord->>Store: store.revertMutation(tempId, 'create', err)
    end
```

---

## 7. Поврзани Компоненти

- [`ln-data-store.md`](./ln-data-store.md) — Локалното IndexedDB складиште што координаторот го синхронизира со серверот.
- [`ln-table.md`](./ln-table.md) — View компонента за табели; бара податоци со `ln-table:request-data`, прима `ln-table:set-data`.
- [`ln-list.md`](./ln-list.md) — View компонента за листи; истиот договор како табелата (`ln-list:*`).
- [`ln-search.md`](./ln-search.md) — Влез за пребарување поврзан со табела; параметрите за пребарување патуваат во `request-data` барањата.
- [`ln-filter.md`](./ln-filter.md) — Компонента за филтрирање која испраќа барања до податочниот координатор.
