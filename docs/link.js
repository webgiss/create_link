const start = () => {
    const { image, link } = get_params()

    addStyle('body { margin: 0; border: 0; padding: 0; overflow: hidden; position: absolute;}')
    addStyle('.workspace, a, img { margin: 0; border: 0; padding: 0}')
    addStyle('.workspace {position: fixed; width: 100%; height: 100%;}')
    addStyle('.flexbox {display: flex; align-items: stretch; justify-content: space-around;align-content: space-between; position: fixed;}')
    addStyle('.flexbox-v {flex-direction: column; height: 100%}')
    addStyle('.flexbox-h {flex-direction: row; width: 100%}')
    addStyle('img { }')

    create_element({
        classNames: ['flexbox', 'flexbox-v'],
        parent: document.body,
        children: [
            create_element({
                classNames: ['flexbox', 'flexbox-h'],
                children: [
                    create_element({
                        name: 'a',
                        properties: {
                            href: link,
                            target: 'blank',
                        },
                        children: [
                            create_element({
                                name: 'img',
                                properties: {
                                    src: image,
                                },
                            })
                        ],
                    })
                ],
            })
        ],
    })
}

readyPromise.then(() => start())