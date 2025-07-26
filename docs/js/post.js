document.addEventListener('DOMContentLoaded', () => {
	const urlParams = new URLSearchParams(window.location.search);
	const fileName = urlParams.get('file');
	const nav = document.querySelector('.nav');

	if (!fileName) {
		// 没有 file 参数，列出所有帖子
		const title = document.createElement('h1');
		title.textContent = '全部帖子';
		title.className = 'post-title';
		nav.insertAdjacentElement('afterend', title);

		const list = document.createElement('ul');
		list.className = 'post-list';
		title.insertAdjacentElement('afterend', list);

		fetch('./file/index.json')
			.then(res => {
				if (!res.ok) throw new Error('无法读取帖子列表');
				return res.json();
			})
			.then(files => {
				files.forEach(name => {
					const li = document.createElement('li');
					const a = document.createElement('a');
					a.href = `./post.html?file=${encodeURIComponent(name)}`;
					a.textContent = name;
					li.appendChild(a);
					list.appendChild(li);
				});
			})
			.catch(err => {
				console.error(err);
				window.location.href = './404.html';
			});
		return;
	}

	// 有 file 参数，显示对应帖子内容
	const title = document.createElement('h1');
	title.textContent = fileName;
	title.className = 'post-title';
	nav.insertAdjacentElement('afterend', title);

	const content = document.createElement('div');
	content.className = 'post-content';
	title.insertAdjacentElement('afterend', content);

	fetch(`./file/${fileName}.txt`)
		.then(response => {
			if (!response.ok) {
				throw new Error('File not found');
			}
			return response.text();
		})
		.then(text => {
			text.split('\n').forEach(line => {
				if (line.trim() !== '') {
					const p = document.createElement('p');
					p.textContent = line;
					content.appendChild(p);
				}
			});
		})
		.catch(err => {
			console.error(err);
			window.location.href = './404.html';
		});
});