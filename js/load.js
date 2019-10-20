(function () {
    function createMenu (writers) {
        for (let i = 0; i < writers.length; i++) {
            let writer = writers[i]
            let menu = document.querySelector(`.${writer.name} .child-menu`)
            let innerHTML = '' 
            let articles = []

            Array.isArray(writer.article)
            ? articles.push.apply(articles, writer.article)
            : articles.push(writer.article)

            for (let j = 0; j < articles.length; j++) {
                if (articles[j]) {
                    innerHTML 
                    += '<li class="title" data-id="' + articles[j].id + '">'
                    +     articles[j].title
                    +  '</li>'
                }
            }

            menu.innerHTML = innerHTML
        }
    }

    window.app.createMenu = function () {
        utils.ajax({
            url: 'config.xml',
            type: 'GET',
            dataType: 'xml',
            async: false,
            timeout: 10000,
            success: function (objXml) {
                if (typeof objXml === 'object') {
                    let writers = utils.xmltoJson(objXml)
                    createMenu(writers.writer)
                }
            },
            error: function () {
                throw new Error('ERROR.XML_PARSING')
            }
        })
    }
})()