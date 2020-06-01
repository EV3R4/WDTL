const shortregex = /https?:\/\/(bit.ly|fb.me|goo.gl|ow.ly|t.co|tinyurl.com)/g,
      ytregex = /https?:\/\/youtu.be\/(.+)/gi,
      ytrepl = 'https://youtube.com/watch?v=$1',
      fytregex = /&feature=youtu.be/gi;

function unshorten(link, url) {
    const req = new XMLHttpRequest();
    req.open('HEAD', link.href);
    req.send();
    let completed = false;
    req.addEventListener('readystatechange', () => {
        if (!completed && document.readyState == 'complete') {
            switch (req.status) {
                case 301:
                    unshorten(link, url);
                    break;
                case 200:
                    const replresurl = req.responseURL.replace(fytregex, '');
                    link.href = replresurl;
                    break;
            }
            completed = true;
        }
    });
}

document.querySelectorAll('a').forEach((link) => {
    if (link.href.search(shortregex) >= 0) {
        unshorten(link, link.href);
    } else {
        const replhref = link.href.replace(ytregex, ytrepl);
        if (link.href != replhref) link.href = replhref;
    }
});