// Utilidades para el portapapeles
class ClipboardUtils {
    static async copyText(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            this.showCopyFeedback(button);
        } catch (err) {
            this.fallbackCopy(text, button);
        }
    }

    static fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showCopyFeedback(button);
    }

    static showCopyFeedback(button) {
        button.classList.add('copied');
        const originalText = button.innerHTML;
        button.innerHTML = '✓';
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalText;
        }, 1000);
    }
}

export { ClipboardUtils };