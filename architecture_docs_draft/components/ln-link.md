# 🔗 ln-link
> **Класификација:** 🟢 Едноставна компонента (Layer 1 - Navigation Helper)

---

## 1. Заднинско дејство и одговорност
`ln-link` е едноставна помошна компонента која овозможува претворање на цели DOM контејнери (како што се картички, блокови или редови во табела) во кликабилни линкови, без притоа да се наруши семантиката на HTML-от и нативната пристапност.

*   **Главна Одговорност:** Го набљудува контејнерот (или редовите `<tr>` во табела), го пронаоѓа првиот дефиниран `<a>` таг во нив, и при клик било каде во контејнерот ја пренасочува навигацијата кон `href` адресата на тој линк.
*   **Исклучоци од интеракција:** Кликнувањето нема да се активира доколку корисникот директно кликне врз други интерактивни елементи во картичката (како копчиња, други линкови, полиња за избор, селекти или инпути). Ова спречува конфликти на повеќе акции во ист блок.
*   **Поддршка за Нови Табови:** Нативно ги препознава кликовите со средно копче од глушецот (middle click) и комбинациите Ctrl+Click или Cmd+Click, отворајќи го линкот во нов таб (`_blank`) во согласност со очекувањата на корисникот.
*   **Симулирана статусна лента (Status Bar):** При лебдење со глушецот (`mouseenter`) над кликабилниот блок, во долниот дел од екранот се прикажува прилагодена статусна лента (`.ln-link-status`) со URL-то на линкот, симулирајќи го нативното однесување на прелистувачот при лебдење над директен линк.
*   **Откажување на навигација:** Пред пренасочувањето, компонентата го емитува откажливиот CustomEvent настан `ln-link:navigate`. Доколку се повика `e.preventDefault()`, навигацијата се прекинува (корисно за пресретнување дејства во SPA).

---

## 2. Минимален HTML Маркап и Варијанти на Употреба

```html
<!-- Кликабилна картичка (Card) со примарен линк -->
<div class="card" data-ln-link>
    <img src="thumb.jpg" alt="Слика" />
    <h3>
        <!-- Примарниот линк кој ја одредува навигацијата на целата картичка -->
        <a href="/articles/zdravo-svet">Здраво Свет</a>
    </h3>
    <p>Ова е краток опис на картичката...</p>
    
    <!-- Дополнително копче (кликнувањето тука НЕ ја активира навигацијата на картичката) -->
    <button type="button" class="btn-like">Ми се допаѓа</button>
</div>

<!-- Цела табела каде секој ред е кликабилен -->
<table data-ln-link>
    <thead>
        <tr><th>Име</th><th>Акција</th></tr>
    </thead>
    <tbody>
        <!-- Секој TR автоматски се регистрира како линк кон href од првиот A елемент -->
        <tr>
            <td><a href="/users/142">Петар Петровски</a></td>
            <td><button type="button">Инфо</button></td>
        </tr>
    </tbody>
</table>
```

---

## 3. Декларативен API Договор (Атрибути и Настани)

| Атрибут | Тип | Опис |
| :--- | :--- | :--- |
| `data-ln-link` | `Flag` | Го активира компонентот врз контејнер (`<div>`, `<article>`, `<table>` или `<tbody>`). |

### Настани (Емитува)
| Настан | Payload `e.detail` | Опис |
| :--- | :--- | :--- |
| `ln-link:navigate` | `{ target: Node, href: String, link: Node }` | Се емитува пред да се изврши навигацијата. Може да биде откажан (`e.preventDefault()`). |

---

## 4. CSS Стилизирање и Поведенски Концепт
Препорачливо е означување на кликабилната област со промена на курсорот, како и стилизирање на симулираната статусна лента.

```scss
// SCSS интеграција во дизајн системот
[data-ln-link] {
    cursor: pointer; // Курсор кој индицира кликабилност
}

// Статусна лента која се додава на крајот од body
.ln-link-status {
    position: fixed;
    bottom: 0;
    left: 0;
    max-width: 30%;
    padding: 0.25rem 0.5rem;
    background-color: var(--color-gray-darkest, #1e293b);
    color: #fff;
    font-size: 0.75rem;
    font-family: monospace;
    border-top-right-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transform: translateY(100%);
    transition: opacity 0.15s ease, transform 0.15s ease;
    z-index: 9999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    
    &.ln-link-status--visible {
        opacity: 0.95;
        transform: translateY(0);
    }
}
```

---

## 5. Пристапност (ARIA) и Чести Грешки
*   **Пристапност:** Овој пристап е одличен за пристапност бидејќи во суровиот HTML сè уште постои вистински семантички `<a>` таг. Екранските читачи и роботите за пребарување го третираат елементот стандардно како линк. Не го заменувајте `<a>` елементот со суров `onclick` настан на контејнерот без линк во него.
*   **Честа грешка 1:** Непоставување на ниту еден `<a>` елемент во кликабилната област. Во овој случај, кликнувањето нема да има никаков ефект бидејќи скриптата нема да пронајде целен `href`.
*   **Честа грешка 2:** Игнорирање на фактот дека корисникот може да користи тастатура (Tab навигација). Со `ln-link`, корисникот се фокусира директно на внатрешниот `<a>` елемент. Осигурајте се дека картичката добива визуелен фокус преку CSS кога внатрешниот линк е во фокус:
    ```scss
    .card:focus-within {
        box-shadow: 0 0 0 3px var(--color-primary-light);
    }
    ```

---

## 6. Дијаграм на Текот и Животен Циклус

```mermaid
sequenceDiagram
    participant User
    participant Card as div[data-ln-link]
    participant Link as a Element
    participant LinkJS as ln-link JS
    participant Status as .ln-link-status

    Card->>LinkJS: Component Mount
    LinkJS->>LinkJS: Scan for first <a> tag
    LinkJS->>Card: Bind click, mouseenter, mouseleave

    alt User hovers card
        User->>Card: Hover (mouseenter)
        Card->>LinkJS: trigger hover handler
        LinkJS->>Status: Show and populate with link href
        User->>Card: Leave (mouseleave)
        Card->>LinkJS: trigger leave handler
        LinkJS->>Status: Hide status bar
    else User clicks card
        User->>Card: Click on card
        Card->>LinkJS: Intercept click
        alt Click on target 'a, button, input, select, textarea'
            LinkJS->>LinkJS: Ignore (allow native behavior)
        else Click on empty card space
            LinkJS->>Card: dispatch ln-link:navigate { href }
            alt defaultPrevented is false
                alt CTRL / CMD or middle click
                    LinkJS->>User: Open URL in new window/tab
                else Left click
                    LinkJS->>Link: Trigger native click()
                end
            end
        end
    end
```

---

## 7. Поврзани Компоненти
*   **`ln-table`**: Редовите во табелата често се опремуваат со `data-ln-link` за лесна навигација кон детален преглед на записите.
*   **`ln-external-links`**: Може да се користи заедно за одредување дали линковите во менијата треба автоматски да се однесуваат како надворешни.
