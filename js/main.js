window.onload = function () {
	let hwalMenu = document.querySelector('.hwal .child-menu')
	let saeromMenu = document.querySelector('.saerom .child-menu')
	let sarokMenu = document.querySelector('.sarok .child-menu')
	
	let image = document.querySelector('.image')
	let header = document.querySelector('.header')
	let contents = document.querySelector('.contents')

	let home = document.querySelector('.home')
	let about = document.querySelector('.about')

	hwalMenu.addEventListener('click', function () {
		image.style.display = 'none'
		header.innerText = '이거슨 정활이 글 제목'
		contents.innerText = '이거슨 정활이 글'
	})

	saeromMenu.addEventListener('click', function () {
		image.style.display = 'none'
		header.innerText = '이거슨 샐돔지 글 제목'
		contents.innerText = '이거슨 샐돔지 글'
	})

	sarokMenu.addEventListener('click', function () {
		image.style.display = 'none'
		header.innerText = '이거슨 사록이 글 제목'
		contents.innerText = '이거슨 사록이 글'
	})

	home.addEventListener('click', function (e) {
		e.preventDefault()
		image.style.display = 'block'
		header.innerText = ''
		contents.innerText = ''
	})

	about.addEventListener('click', function (e) {
		e.preventDefault()
	})

request = new XMLHttpRequest();
request.open('GET', 'config.xml', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400){
    // Success!
    data = JSON.parse(request.responseText);
  } else {
    // We reached our target server, but it returned an error
  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();
}