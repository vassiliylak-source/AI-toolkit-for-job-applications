
export const escapeHtml = (text: string | undefined): string => {
    if (!text) return '';
    const map: {[key: string]: string} = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
};

export const htmlToPlainText = (html: string): string => {
    const tempDiv = document.createElement('div');
    // Add newlines to block elements for better formatting
    const cleanHtml = html
        .replace(/<\/h[1-6]>/g, '</h2>\n')
        .replace(/<\/p>/g, '</p>\n')
        .replace(/<\/li>/g, '</li>\n')
        .replace(/<br\s*\/?>/g, '\n');
        
    tempDiv.innerHTML = cleanHtml;
    // Replace list items with a dash
    tempDiv.querySelectorAll('li').forEach(li => {
        li.textContent = `- ${li.textContent}`;
    });

    return (tempDiv.textContent || tempDiv.innerText || "").trim();
};
