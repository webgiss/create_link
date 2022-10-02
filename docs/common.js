/**
 * Create a new HTMLElement
 * 
 * @param {Object} params
 * @param {String} params.name
 * @param {String[]} params.classNames
 * @param {String} params.text
 * @param {String} params.id
 * @param {String} params.href
 * @param {String} params.src
 * @param {{[key: String]: String}} params.properties
 * @param {HTMLElement} params.parent
 * @param {HTMLElement[]} params.children
 * @param {(element: HTMLElement) => void} params.on_created
 * @returns 
 */
const create_element = (params) => {
    params = params || {}
    const name = params.name || 'div'
    const text = params.text
    const classNames = params.classNames
    const id = params.id
    const parent = params.parent
    const children = params.children
    const href = params.href
    const src = params.src
    const properties = params.properties
    const on_created = params.on_created
    const element = window.document.createElement(name)
    if (text) {
        element.innerText = text
    }
    if (classNames) {
        for (let className of classNames) {
            element.classList.add(className)
        }
    }
    if (id) {
        element.id = id
    }
    if (parent) {
        parent.appendChild(element)
    }
    if (children) {
        for (let child of children) {
            element.appendChild(child)
        }
    }
    if (href) {
        element.href = href
    }
    if (src) {
        element.src = src
    }
    for (let key in properties){
        element[key] = properties[key]
    }

    if (on_created) {
        on_created(element)
    }
    return element
}

/**
 * Add a new css string to the page
 * 
 * @param {string} styleText The CSS string to pass
 * @returns {void}
 */
const addStyle = (() => {
    /** @type HTMLStyleElement */
    let styleElement = null;
    /** @type String */
    let styleContent = null;

    /**
     * Add a new css string to the page
     * 
     * @param {string} styleText The CSS string to pass
     * @returns {void}
     */
    return (styleText) => {
        if (styleElement === null) {
            styleElement = window.document.createElement('style');
            styleContent = "";
            window.document.head.appendChild(styleElement);
        } else {
            styleContent += "\n";
        }

        styleContent += styleText;
        styleElement.textContent = styleContent;
    };
})();

/**
 * A promise that is resolved when the html DOM is ready. 
 * Should be part of any browser, but is not.
 * 
 * @type {Promise<void>} A promise that is resolved when the html DOM is ready
 */
const readyPromise = new Promise((resolve, reject) => {
    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        setTimeout(() => resolve(), 1);
    } else {
        const onContentLoaded = () => {
            resolve();
            document.removeEventListener('DOMContentLoaded', onContentLoaded, false);
        }
        document.addEventListener('DOMContentLoaded', onContentLoaded, false);
    }
})


/**
 * Fallback copy to clipboard
 * 
 * @param {String} text 
 */
const fallbackCopyTextToClipboard = (text) => {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

/**
 * Copy to clipboard
 * 
 * @param {String} text 
 */

const copyTextToClipboard = (text) => {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

/**
 * Promise to introduce delay
 * 
 * @param {Number} interval 
 * @returns 
 */
 const delay = (interval) => new Promise((resolve)=>{
    setTimeout(()=>resolve(), interval)
})

/**
 * Get all the params in the url as a javascript dictionnary (type Object)
 * 
 * @returns {{[key: String]: String}}
 */
const get_params = () => {
    const param_array = location.search.slice(1).split('&').map((param) => [param.split('=')[0], param.split('=').slice(1).join('=')])
    const result = {}
    for (let [key, value] of param_array) {
        result[key] = decodeURIComponent(value)
    }
    return result
}