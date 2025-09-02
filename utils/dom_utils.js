// Utilidades para manipulación del DOM
class DOMUtils {
    static getElementById(id) {
        return document.getElementById(id);
    }

    static querySelectorAll(selector) {
        return document.querySelectorAll(selector);
    }

    static createElement(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    static setFontSize(elements, size) {
        elements.forEach(element => {
            element.style.fontSize = `${size}px`;
        });
    }
}

export { DOMUtils };