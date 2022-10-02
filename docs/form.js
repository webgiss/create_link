const create_input = ({ classNames, placeholder, on_created }) => {
    return create_element({
        classNames: [...classNames, 'ui', 'input'],
        children: [
            create_element({
                name: 'input',
                on_created,
                properties: {
                    placeholder,
                },
            })
        ]
    })
}

const create_label = (label) => create_element({
    name: 'label',
    classNames: ['label'],
    text: label,
})

const start = () => {
    /** @type HTMLInputElement */
    let image_url_element = null
    /** @type HTMLInputElement */
    let link_url_element = null
    /** @type HTMLInputElement */
    let final_link_element = null
    /** @type HTMLDivElement */
    let result_element = null
    /** @type HTMLFormElement */
    let form_element = null
    /** @type HTMLButtonElement */
    let button_element = null
    /** @type HTMLDivElement */
    let workspace_element = null

    addStyle('.workspace { padding: 10px }')
    addStyle('.hidden { display: none }')
    addStyle('.ui.form input.copied { border-color: #21ba45; border-width: 2px; }')

    create_element({
        classNames: ['workspace'],
        parent: document.body,
        on_created: (element) => { workspace_element = element },
        children: [
            create_element({
                classNames: ['ui', 'segment'],
                children: [
                    create_element({
                        name: 'form',
                        classNames: ['ui', 'form'],
                        on_created: (element) => { form_element = element },
                        children: [
                            create_element({
                                classNames: ['field'],
                                children: [
                                    create_label('Image URL'),
                                    create_input({
                                        classNames: ['image_url'],
                                        placeholder: 'Type image URL...',
                                        on_created: (element) => { image_url_element = element },
                                    }),
                                ]
                            }),
                            create_element({
                                classNames: ['field'],
                                children: [
                                    create_label('Link URL'),
                                    create_input({
                                        classNames: ['link_url'],
                                        placeholder: 'Type link URL...',
                                        on_created: (element) => { link_url_element = element },
                                    }),
                                ]
                            }),
                            create_element({
                                on_created: (element) => { result_element = element },
                                children: [
                                    create_element({
                                        classNames: ['ui', 'divider'],
                                    }),
                                    create_element({
                                        classNames: ['field'],
                                        children: [
                                            create_label('Result Link'),
                                            create_input({
                                                classNames: ['final_link'],
                                                on_created: (element) => { final_link_element = element },
                                            }),
                                        ]
                                    }),
                                    create_element({
                                        name: 'button',
                                        classNames: ['ui', 'button', 'blue', 'fluid', 'submit'],
                                        text: 'Copy',
                                        on_created: (element) => { button_element = element },
                                    }),
                                ]
                            }),
                        ],
                    }),
                ]
            }),

        ]
    })

    window.image_url_element = image_url_element
    window.link_url_element = link_url_element
    window.final_link_element = final_link_element
    window.result_element = result_element
    window.form_element = form_element

    const update_final_link = () => {
        const base_url = new URL('./link.html', location.href).toString()
        const image_url = image_url_element.value
        const link_url = link_url_element.value
        const url = `${base_url}?image=${encodeURIComponent(image_url)}&link=${encodeURIComponent(link_url)}`
        const result_exists = image_url.length > 0 && link_url.length > 0
        final_link_element.readOnly = true
        final_link_element.value = url
        // if (result_exists) {
        //     result_element.classList.remove('hidden')
        // } else {
        //    result_element.classList.add('hidden')
        // }
        console.log({ url })
    }

    update_final_link()
    image_url_element.addEventListener('input', (event) => {
        update_final_link()
    });
    link_url_element.addEventListener('input', (event) => {
        update_final_link()
    });
    form_element.addEventListener('submit', (event) => {
        console.log('validate')
        event.preventDefault()

        copyTextToClipboard(final_link_element.value)
        final_link_element.classList.add('copied')
        button_element.classList.remove('blue')
        button_element.classList.add('green')
        button_element.innerText = 'Copied !'
        delay(500).then(() => {
            final_link_element.classList.remove('copied')
            button_element.classList.remove('green')
            button_element.classList.add('blue')
            button_element.innerText = 'Copy'
        })
    })

    const { help } = get_params()

    if (help) {
        if (help === 'notion_fr') {
            create_element({
                classNames: ['ui', 'segment'],
                parent: workspace_element,
                children: [
                    create_element({
                        name: 'p',
                        text: 'Pour insérer une image cliquable dans notion.so, il faut :'
                    }),
                    create_element({
                        name: 'ol',
                        children: [
                            create_element({
                                name: 'li',
                                text: 'Mettre le lien vers une image dans le champs "Image URL".',
                            }),
                            create_element({
                                name: 'li',
                                text: 'Mettre le lien vers la page ou aller quand on clique sur l\'image dans le champs "Link URL".',
                            }),
                            create_element({
                                name: 'li',
                                text: 'Cliquer sur le bouton « Copy » pour placer le lien résultat dans le presse-papier.',
                            }),
                            create_element({
                                name: 'li',
                                text: 'Enfin dans notion, insérer un bloc de type « Intégration » ("embed" en anglais) en y plaçant le lien dans le presse papier.',
                            }),
                        ]
                    }),
                ],
            })
        }

    }
}

readyPromise.then(() => start())