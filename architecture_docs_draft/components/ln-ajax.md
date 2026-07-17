# 🌐 ln-ajax
> **Класификација:** 🟢 Едноставна компонента (Layer 1 - Dynamic Content & Network Engine)

---

## 1. Заднинско дејство и одговорност
`ln-ajax` е моќна компонента за мрежна оркестрација која го имплементира концептот **HTML-over-the-wire**. Таа овозможува пресретнување (hijacking) на класичните навигации преку линкови и поднесување форми за да ги претвори во безжични AJAX барања, со што се овозможува делумно освежување на страницата без нејзино целосно превчитување.

*   **Главна Одговорност:** Го набљудува контејнерот со `data-ln-ajax` и ги пресретнува кликовите на сите внатрешни `<a>` линкови и поднесувањето на сите `<form>` форми (освен оние означени со `data-ln-ajax="false"`).
*   **Приоритет на `data-ln-form-scope` (Local-First Write Routing):** `ln-ajax` е **втората скала** од трите можни во моделот за пресретнување на submit (види `architecture_docs_draft/write-workflow-guide.md`): (1) никој — нативен submit, (2) `ln-ajax` — прогресивно подобрување преку fetch, (3) `data-ln-form-scope` — координаторски write pipeline. Форма со `data-ln-form-scope` е експлицитно исклучена од `ln-ajax` — приоритетот на `data-ln-form-scope` победува секогаш. При наидување на таква форма, `ln-ajax` ја прескокнува целосно и еднократно (по форма) испишува `console.warn` предупредување во конзолата.
*   **Концепт HTML-over-the-wire:** При пристигнување на JSON одговор од серверот, компонентата ги чита следните информации:
    *   `title`: Го ажурира насловот на страницата (`document.title`).
    *   `content`: Мапа од типот `{ "целен-id": "HTML содржина" }`. За секој клуч во оваа мапа, скриптата го пронаоѓа соодветниот елемент во DOM-от и го заменува неговиот `innerHTML`.
    *   `message`: Автоматски испраќа настан `ln-toast:enqueue` за да се прикаже toast нотификација со соодветната порака.
*   **Синхронизација со Историјата (pushState):** По успешна обработка на линк или GET форма, компонентата ја ажурира URL адресата во адресарот на прелистувачот преку `window.history.pushState` за да се зачува природната навигација на корисникот (Back/Forward).
*   **Визуелен фидбек (Loading States):** Додека трае мрежното барање, автоматски ги оневозможува (`disabled`) сите копчиња во формата, додава CSS класа `ln-ajax--loading` и вметнува привремен индикатор за вчитување (`.ln-ajax-spinner`).
*   **Безбедност:** Автоматски го додава CSRF токенот во заглавјата на секое барање (`X-CSRF-TOKEN`) и како параметар во FormData (`_token`).

---

## 2. Минимален HTML Маркап и Варијанти на Употреба

### Базен HTML Маркап: Навигација во Контејнер

Линковите внатре во контејнерот се вчитуваат преку fetch, а целите се ажурираат врз основа на структурата на одговорот од серверот.

```html
<!-- Контејнер каде сите линкови ќе се вчитаат преку AJAX -->
<div data-ln-ajax id="main-content">
    <nav>
        <a href="/dashboard/analytics">Аналитика</a>
        <!-- Овој линк ќе се однесува стандардно, без AJAX -->
        <a href="/logout" data-ln-ajax="false">Одјави се</a>
    </nav>
    
    <div id="dynamic-panel">
        <!-- Содржината тука ќе се ажурира динамички -->
    </div>
</div>
```

### Варијант 1: AJAX Форма за Поднесување

Ги поднесува податоците од формата асинхроно и ги прима ажурираните DOM делови.

```html
<form action="/api/posts/save" method="POST" data-ln-ajax>
    <input type="text" name="title" required />
    <button type="submit">Зачувај</button>
</form>
```

### Варијант 2: AJAX Контејнер со исклучени елементи

Исклучување на одредени вгнездени елементи (линкови/форми) од пресретнување во контејнер овозможен со AJAX со користење на `data-ln-ajax="false"`.

```html
<!-- Контејнерот активира AJAX за сите внатрешни елементи -->
<div data-ln-ajax id="app-container">
    <!-- Овие ќе се вчитаат преку AJAX -->
    <a href="/dashboard">Контролна табла</a>
    <form action="/update-settings" method="POST"> ... </form>

    <!-- ИСКЛУЧЕНИ: Овие ќе направат стандардна навигација/поднесување во прелистувачот -->
    <a href="/download-pdf" data-ln-ajax="false">Преземи PDF</a>
    <form action="/legacy-logout" method="POST" data-ln-ajax="false"> ... </form>
</div>
```

---

## 3. Декларативен API Договор (Атрибути и Настани)

### Табела со Атрибути

| Атрибут | Елемент | Тип / Вредности | Опис |
| :--- | :--- | :--- | :--- |
| `data-ln-ajax` | Контејнер/Форма/Линк | *без вредност* (празен атрибут) | Го активира AJAX пресретнувањето за контејнерот и неговите деца (или за конкретната форма/линк). Се однесува како boolean флаг. |
| `data-ln-ajax="false"` | Линк/Форма | `"false"` | **Единствена поддржана вредност.** Експлицитно го иззема соодветниот линк или форма од AJAX обработката. |

> [!IMPORTANT]
> **Ограничување на вредноста на атрибутот:** Атрибутот `data-ln-ajax` работи врз основа на присуство (како boolean флаг).
> * **Единствената валидна и поддржана вредност е `"false"`**, која се користи за исклучување (opt-out) на специфични елементи во контејнер со AJAX навигација.
> * **Не користете сопствени вредности** (на пр. `data-ln-ajax="loginform"` или `data-ln-ajax="my-form"`). Компонентата **не прима**, не процесира и не менува однесување врз основа на други текстуални вредности. Доколку напишете сопствена вредност, таа ќе се третира како обично активирање на AJAX (исто како празен атрибут), но тоа е анти-шаблон што ги збунува девелоперите и AI агентите.


### DOM Барања и Настани (Емитува)
| Настан | Payload `e.detail` | Опис |
| :--- | :--- | :--- |
| `ln-ajax:before-start` | `{ method, url }` | Се емитува на елементот пред почеток на мрежното барање. Може да се откаже со `e.preventDefault()`. |
| `ln-ajax:start` | `{ method, url }` | Се емитува по започнување на барањето (се прикажува спинерот во UI). |
| `ln-ajax:success` | `{ method, url, data }` | Се емитува при успешен HTTP одговор (status 2xx). |
| `ln-ajax:error` | `{ method, url, status, data }` | Се емитува при неуспешен HTTP одговор или мрежен прекин. |
| `ln-ajax:complete` | `{ method, url }` | Се емитува откако целата акција и чистење на лоудерот е завршена. |

*Интеграција со систем за нотификации:* Доколку одговорот од серверот содржи својство `message` (на пр. `{ "message": { "type": "success", "body": "Зачувано!" } }`), компонентата автоматски го емитува настанот **`ln-toast:enqueue`** на глобално ниво (`window`).

---

## 4. CSS Стилизирање и Поведенски Концепт
Во текот на вчитавањето, на елементот му се додава класа `.ln-ajax--loading` и се инјектира елемент со класа `.ln-ajax-spinner`.

```scss
// SCSS стилови за лоудинг состојбата на елементот
.ln-ajax--loading {
    position: relative;
    pointer-events: none; // Спречува двојни кликови при вчитување
    opacity: 0.8;
}

// Индикатор за вчитување (Spinner)
.ln-ajax-spinner {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ln-ajax-spin 0.75s linear infinite;
    margin-left: 0.5rem;
    vertical-align: text-bottom;
}

@keyframes ln-ajax-spin {
    to { transform: rotate(360deg); }
}
```

---

## 5. Пристапност (ARIA) и Чести Грешки
*   **Пристапност:** Бидејќи `ln-ajax` врши динамички замени во DOM-от кои не се придружени со освежување на страницата, се препорачува целните контејнери (каде се врши замена на содржина) да бидат означени со `aria-live="polite"` за корисниците со оштетен вид да бидат известени за новата содржина.
*   **Честа грешка 1:** Враќање на чист HTML од серверот наместо валиден JSON со бараната структура. Серверот мора да одговори со структура од типот:
    ```json
    {
      "title": "Нов Наслов",
      "content": {
        "dynamic-panel": "<p>Нова динамичка содржина</p>"
      }
    }
    ```
    Доколку серверот врати само обичен HTML, парсирањето ќе пропадне и компонентата ќе емитува `ln-ajax:error`.
*   **Честа грешка 2:** Недодавање на `data-ln-ajax="false"` на внатрешни линкови со хаш рути (на пр. `<a href="#settings">`). (Иако скриптата содржи проверка `href.includes('#')` и ги игнорира, се препорачува рачно исклучување).
*   **Честа грешка 3:** Очекување дека `ln-ajax` ќе ја пресретне форма со `data-ln-form-scope`. Нема да ја пресретне — таквите форми се наменети за `ln-data-coordinator` write pipeline-от и `ln-ajax` активно ги прескокнува (со еднократен `console.warn`). Ако сакате AJAX-стил submit за local-first форма, тоа веќе го прави координаторот низ store/queue/connector слојот — нема потреба за `ln-ajax` на истата форма.

---

## 6. Дијаграм на Текот и Животен Циклус

```mermaid
sequenceDiagram
    participant User
    participant Link as a[data-ln-ajax]
    participant AjaxJS as ln-ajax JS
    participant Browser as Browser History
    participant Server as Backend API
    participant Target as DOM Target Container

    User->>Link: Click
    Link->>AjaxJS: Intercept click event
    AjaxJS->>Link: dispatch ln-ajax:before-start
    AjaxJS->>Link: dispatch ln-ajax:start
    AjaxJS->>Link: Add class .ln-ajax--loading & append spinner
    
    AjaxJS->>Server: Send fetch request (headers: XMLHttpRequest, Accept: json)
    Server-->>AjaxJS: Return JSON { title, content: { 'target-id': '...' } }
    
    alt HTTP Success (200)
        AjaxJS->>Target: innerHTML = new content
        AjaxJS->>Browser: history.pushState(url)
        AjaxJS->>Link: dispatch ln-ajax:success
    else HTTP Error (500/404)
        AjaxJS->>Link: dispatch ln-ajax:error
    end

    AjaxJS->>Link: Remove class .ln-ajax--loading & remove spinner
    AjaxJS->>Link: dispatch ln-ajax:complete
```

---

## 7. Поврзани Компоненти
*   **`ln-toast`**: Прима глобални `ln-toast:enqueue` настани испратени од `ln-ajax` при пристигнување одговор со `message` и прикажува тост пораки.
*   **`ln-router`**: Може да го набљудува `pushState` на прелистувачот за усогласување на рутите.
*   **`ln-form`**: Форми **без** `data-ln-form-scope` можат да користат AJAX прогресивно подобрување преку `ln-ajax` при поднесување. Форми **со** `data-ln-form-scope` секогаш се исклучени (види §1) — тие припаѓаат на [`ln-data-coordinator`](./ln-data-coordinator.md).
