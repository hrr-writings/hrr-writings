(function () {
	let menu = document.querySelectorAll('.child-menu')
	let homeButton = document.querySelector('.button-area .home')
	let aboutButton = document.querySelector('.button-area .about')

	let header = document.querySelector('.header')
	let contents = document.querySelector('.contents')

	let home = document.querySelector('.right .home')
	let about = document.querySelector('.right .about')
	let text = document.querySelector('.right .text')

	window.app.bindEvents = function () {
		for (let i = 0; i < menu.length; i++) {
			menu[i].addEventListener('click', function (e) {
				let target = e.target
				let writer = target.parentElement.dataset.name
				let id = target.dataset.id
				let url = `articles/${writer}/${id}.json`
				let selected = menu[i].querySelector('.selected')

				if (selected) selected.classList.remove('selected')
				target.classList.add('selected')

				utils.ajax({
					url: url,
					type: 'GET',
					dataType: 'json',
					async: false,
					timeout: 10000,
					success: function (json) {
						header.innerHTML = json.title
						contents.innerHTML = json.contents
						home.classList.add('hidden')
						about.classList.add('hidden')
						text.classList.remove('hidden')
					},
					error: function () {
						throw new Error('ERROR.XML_PARSING')
					}
				})
			})
		}

		homeButton.addEventListener('click', function (e) {
			e.preventDefault()
			text.classList.add('hidden')
			about.classList.add('hidden')
			home.classList.remove('hidden')
		})
	
		aboutButton.addEventListener('click', function (e) {
			e.preventDefault()
			home.classList.add('hidden')
			text.classList.add('hidden')
			about.classList.remove('hidden')
		})
	}
})()